const argon2 = require("argon2");

const generateHash = async (password) => {
  try {
    // Hash the password using Argon2
    const hash = await argon2.hash(password);
    return hash;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateHash
};
