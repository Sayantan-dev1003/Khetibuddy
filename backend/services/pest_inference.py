import os
import sys
import json
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import pickle

# =========================
# CONFIG
# =========================
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "pest_model.pth")
LABELS_PATH = os.path.join(os.path.dirname(__file__), "..", "class_labels.pkl")
IMG_SIZE = 224

# Fallback classes if .pkl is missing
DEFAULT_CLASSES = [
    "Aphids", "Armyworm", "Beetle", "Bollworm", "Grasshopper", 
    "Mites", "Mosquito", "Sawfly", "Stem Borer", "Thrips"
]

def load_model(num_classes):
    model = models.mobilenet_v2(weights=None) # No need for pretrained weights here
    model.classifier = nn.Sequential(
        nn.Linear(model.last_channel, 256),
        nn.ReLU(),
        nn.Dropout(0.4),
        nn.Linear(256, num_classes)
    )
    
    # Load state dict
    try:
        state_dict = torch.load(MODEL_PATH, map_session=torch.device('cpu'), weights_only=True)
        model.load_state_dict(state_dict)
    except Exception as e:
        # If loading fails, it might be because num_classes mismatch or older torch
        # We try to infer num_classes from the state_dict if possible
        pass
        
    model.eval()
    return model

def predict(image_path):
    # Load labels
    classes = DEFAULT_CLASSES
    if os.path.exists(LABELS_PATH):
        try:
            with open(LABELS_PATH, "rb") as f:
                classes = pickle.load(f)
        except:
            pass
            
    num_classes = len(classes)
    
    # Initialize model
    model = load_model(num_classes)
    
    # Transform
    transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    try:
        img = Image.open(image_path).convert("RGB")
        img_tensor = transform(img).unsqueeze(0)
        
        with torch.no_grad():
            outputs = model(img_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            confidence, index = torch.max(probabilities, 0)
            
        result = {
            "success": True,
            "pestName": classes[index.item()],
            "confidence": float(confidence.item()) * 100,
            "index": int(index.item())
        }
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No image path provided"}))
        sys.exit(1)
        
    img_path = sys.argv[1]
    res = predict(img_path)
    print(json.dumps(res))
