const usersRepository = require('./users-repository'); // function ke db utk CRUD
const { hashPassword } = require('../../../utils/password'); // buat hashing

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers(); // mengambil alist of user

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    // mauskkin user dr array users ke array results
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  // if (await usersRepository.isEmailTaken(email)) {
  //   throw new Error('Email already taken'); // Throw an error if email is already taken
  // }
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  if (await usersRepository.isEmailTaken(email, id)) {
    throw new Error('Email already taken');
  }
  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

async function isEmailTaken(email) {
  return await usersRepository.isEmailTaken(email);
}

async function changePassword(id, password) {
  // cari id
  const user = await usersRepository.getUser(id);
  // kalau gada maka:
  if (!user) {
    return null;
  }

  // kalau ada, maka ganti passwordd
  try {
    await usersRepository.changePassword(id, password);
  } catch (err) {
    return null;
  }

  return true;
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
