const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class PestMLService {
  constructor() {
    this.pythonPath = 'python'; // Default to python, could be configured via .env
    this.scriptPath = path.join(__dirname, 'pest_inference.py');
  }

  async runPestInference(imagePath) {
    return new Promise((resolve, reject) => {
      // ✅ Step 1: Validate file exists
      if (!fs.existsSync(imagePath)) {
        return reject(new Error(`Image path not found: ${imagePath}`));
      }

      // ✅ Step 2: Spawn Python process
      console.log(`🚀 Spawning Python for Pest Inference on: ${imagePath}`);
      const pythonProcess = spawn(this.pythonPath, [this.scriptPath, imagePath]);

      let outputData = '';
      let errorData = '';

      // ✅ Step 3: Handle stdout
      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      // ✅ Step 4: Handle stderr
      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      // ✅ Step 5: Handle close
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`❌ Python script exited with code ${code}. Error: ${errorData}`);
          return reject(new Error(`Pest detection engine failed: ${errorData || 'Unknown error'}`));
        }

        try {
          const result = JSON.parse(outputData);
          if (!result.success) {
            return reject(new Error(result.error || 'Pest detection failed on inference side.'));
          }
          resolve(result);
        } catch (err) {
          console.error(`❌ Failed to parse Python output: ${outputData}`);
          reject(new Error(`Invalid response from pest detection engine.`));
        }
      });

      // ✅ Step 6: Set timeout (30 seconds)
      setTimeout(() => {
        pythonProcess.kill();
        reject(new Error('Pest detection timed out after 30 seconds.'));
      }, 30000);
    });
  }
}

module.exports = new PestMLService();
