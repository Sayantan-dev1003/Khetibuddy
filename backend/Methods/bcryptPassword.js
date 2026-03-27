const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  try {

    // Generate a salt with 10 rounds
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;

  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }

}

const comparePassword = async (password, hashedPassword) => {
    try {
        // Compare the plain password with the hashed password
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error("Error comparing password:", error);
        throw new Error("Failed to compare password");
    }
}

module.exports = {
  hashPassword,
  comparePassword
};