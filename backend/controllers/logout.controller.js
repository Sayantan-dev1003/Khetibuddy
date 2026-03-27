
const logoutUser = async (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,      // true in production
      sameSite: 'lax'
    });
  
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  logoutUser
};