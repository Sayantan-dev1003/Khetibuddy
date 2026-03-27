# Fertilizer Advisor - Testing Guide

## Quick Test Scenarios

### Test Case 1: Rice Farmer - Basic Usage
**Input:**
- Crop: Rice (धान)
- Land Area: 2
- Unit: Acre
- Growth Stage: Vegetative Growth
- Soil Type: Alluvial Soil
- Budget: Medium Budget
- Issues: (leave empty)

**Expected Output:**
- Summary with rice-specific recommendations
- 2-4 primary fertilizers (e.g., Urea, DAP, MOP)
- Dosages calculated for 2 acres
- Timing appropriate for vegetative stage
- Organic alternatives (e.g., Vermicompost, Green Manure)
- General advice about application
- Cost estimates in ₹

---

### Test Case 2: Wheat Farmer - With Issues
**Input:**
- Crop: Wheat (गेहूं)
- Land Area: 5
- Unit: Bigha
- Growth Stage: Flowering
- Soil Type: Black Soil
- Budget: Low Budget
- Issues: "Yellow leaves appearing on upper portion"

**Expected Output:**
- Summary addressing yellowing issue
- Budget-friendly fertilizer options
- Nitrogen-rich recommendations (for yellowing)
- Organic alternatives emphasized
- Specific advice for black soil
- Cost-effective solutions
- Additional tips for the issue

---

### Test Case 3: Tomato Farmer - Premium Budget
**Input:**
- Crop: Tomato (टमाटर)
- Land Area: 0.5
- Unit: Acre
- Growth Stage: Fruiting
- Soil Type: Sandy Soil
- Budget: Premium
- Issues: (leave empty)

**Expected Output:**
- Premium fertilizer recommendations
- Micronutrient suggestions for fruiting
- Higher dosages for sandy soil (nutrients leach faster)
- Multiple application timings
- Foliar spray recommendations
- Cost not a constraint, quality focus

---

### Test Case 4: Cotton Farmer - Large Farm
**Input:**
- Crop: Cotton (कपास)
- Land Area: 10
- Unit: Hectare
- Growth Stage: Pre-Sowing
- Soil Type: Black Soil
- Budget: Medium Budget
- Issues: (leave empty)

**Expected Output:**
- Pre-sowing soil preparation advice
- Dosages scaled for 10 hectares
- Basal dose recommendations
- Split application schedule
- Black soil-specific advice (already nutrient-rich)
- Bulk purchase cost estimates

---

## Validation Tests

### 1. Missing Required Fields
**Test:** Leave crop field empty
**Expected:** Error message: "Please fill in all required fields"

### 2. Invalid Land Area
**Test:** Enter 0 or negative number
**Expected:** Error message: "Please enter a valid land area"

### 3. All Fields Filled
**Test:** Fill all required + optional fields
**Expected:** Successful recommendation with issue-specific advice

---

## UI/UX Tests

### 1. Form Responsiveness
- [ ] Test on mobile (320px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1024px+ width)
- [ ] All dropdowns work correctly
- [ ] Text area expands properly

### 2. Loading State
- [ ] Loading spinner appears
- [ ] Button shows "loading" state
- [ ] Form fields are disabled during loading
- [ ] Previous results are cleared

### 3. Results Display
- [ ] All result cards appear
- [ ] Proper spacing and formatting
- [ ] Icons display correctly
- [ ] Colors match theme
- [ ] Text is readable

### 4. Reset Functionality
- [ ] Reset button appears after results
- [ ] Clears all form fields
- [ ] Removes result cards
- [ ] Returns to initial state

---

## Backend Tests

### 1. API Validation
```bash
# Test with valid data
curl -X POST http://localhost:3000/api/fertilizer/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "crop": "rice",
    "landArea": 2,
    "areaUnit": "acre",
    "growthStage": "vegetative",
    "soilType": "alluvial",
    "budget": "medium"
  }'
```

### 2. Database Check
```javascript
// In MongoDB
db.fertilizerplans.find().sort({createdAt: -1}).limit(5)
// Should show recent recommendations
```

### 3. Error Handling
```bash
# Test with missing fields
curl -X POST http://localhost:3000/api/fertilizer/recommend \
  -H "Content-Type: application/json" \
  -d '{"crop": "rice"}'

# Should return 400 error with message
```

---

## Performance Tests

### 1. Response Time
- Average API response: < 5 seconds
- LLM processing: < 4 seconds
- Database save: < 1 second

### 2. Multiple Requests
- Test 5 consecutive requests
- Check for rate limiting
- Verify all return unique recommendations

### 3. Large Land Area
- Test with 100 acres
- Verify dosage calculations scale correctly
- Check cost estimates are reasonable

---

## Edge Cases

### 1. Decimal Land Area
**Input:** landArea = 0.5
**Expected:** Works correctly, calculates proportional dosages

### 2. Very Large Area
**Input:** landArea = 1000
**Expected:** Recommendations include bulk purchase advice

### 3. Special Characters in Issues
**Input:** issues = "Leaves turning yellow!! Need urgent help???"
**Expected:** Handles gracefully, provides relevant advice

### 4. Different Units
**Test:** Try acre, hectare, and bigha
**Expected:** Dosages adjust correctly for each unit

---

## Integration Tests

### 1. Frontend-Backend Communication
- [ ] Request payload matches API expectations
- [ ] Response format matches frontend expectations
- [ ] Error messages display correctly
- [ ] Success responses render properly

### 2. Database Integration
- [ ] Data saves correctly
- [ ] Schema validation works
- [ ] Query responses are fast
- [ ] No duplicate entries for same request

### 3. LLM Integration
- [ ] Prompt includes all parameters
- [ ] Response is valid JSON
- [ ] Response matches expected structure
- [ ] Handles LLM errors gracefully

---

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## Accessibility Tests

- [ ] Form labels are readable by screen readers
- [ ] Tab navigation works correctly
- [ ] Focus states are visible
- [ ] Error messages are announced
- [ ] Color contrast meets WCAG standards

---

## Success Criteria

✅ All required fields validated correctly  
✅ API returns recommendations within 5 seconds  
✅ Results display properly formatted  
✅ Database saves recommendations  
✅ Error handling works for all edge cases  
✅ UI is responsive on all screen sizes  
✅ Bilingual labels display correctly  
✅ Cost estimates are in Indian Rupees  
✅ Organic alternatives always included  
✅ Reset functionality works perfectly  

---

## Common Issues & Solutions

### Issue: "Failed to get fertilizer recommendation"
**Solution:** Check if backend is running and LLM service is configured

### Issue: No results displayed
**Solution:** Check browser console for errors, verify API response format

### Issue: Database save fails
**Solution:** Check MongoDB connection, verify schema matches data

### Issue: Slow response
**Solution:** Check LLM service, network latency, or increase timeout

### Issue: Incorrect dosage calculations
**Solution:** Verify unit conversions in backend logic

---

## Manual Testing Checklist

Before marking as complete:
- [ ] Test all 4 scenarios above
- [ ] Verify validation works
- [ ] Check responsive design
- [ ] Test error handling
- [ ] Verify database saves
- [ ] Check loading states
- [ ] Test reset functionality
- [ ] Verify bilingual labels
- [ ] Check all dropdown options
- [ ] Test with different budgets
- [ ] Verify cost estimates
- [ ] Check organic alternatives appear
- [ ] Test with and without issues field
- [ ] Verify all growth stages work
- [ ] Test all soil types
- [ ] Check all crops

---

**Testing Status:** Ready for testing ✅  
**Last Updated:** January 24, 2026  
**Version:** 2.0 (Redesigned)
