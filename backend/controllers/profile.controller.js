const User = require('../models/user.model.js');
const { hashPassword, comparePassword } = require('../Methods/bcryptPassword.js');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update user profile details
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, bio } = req.body;
    
    // Find user by ID and update the fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        phone,
        address,
        bio
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Change user password
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both old and new password' });
    }
    
    // Get user with password
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if old password matches
    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect old password' });
    }
    
    // Hash new password using the existing hashPassword helper
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword
};
