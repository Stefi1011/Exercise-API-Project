const { User } = require('../../../models');

// ini fungsi"nya dipake di users-service
/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({}); // mereturn semua users
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id); // mereturn user dengan id tertentu
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    // create user berdasarkan parameter yg diberikan
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    // update name dan email (yg diidentifikasi id)
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id }); // delete user dengan id tertentu
}

/**
 * Check if email is already taken
 * @param {string} email - Email to check
 * @returns {Promise}
 */
async function isEmailTaken(email) {
  const user = await User.findOne({ email });
  if (user !== null) {
    return true;
  }
  return false;
}

// ganti password
/**
 * Check if email is already taken
 * @param {string} id- id to check
 * @param {string} password - password
 * @returns {Promise<boolean>}
 */

async function changePassword(id, password) {
  return User.updateOne(
    // update password
    {
      _id: id,
    },
    {
      $set: {
        password,
      },
    }
  );
}
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  isEmailTaken,
  changePassword,
};
