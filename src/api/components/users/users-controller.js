// controller itu manages data, usage/interaction logic
const usersService = require('./users-service'); // ini buat interacting sama sata layer (cnth database) utk CRUD (Create Remove Update Delete)
const { errorResponder, errorTypes } = require('../../../core/errors'); // error handling yg diimport dari module core/errors

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

// {object} itu tipe parameter
// request, response, dan next itu nama parameter
// antara return object atau ga pass error

async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers(); // ini buat dapetin list of user
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id); // ini buat kasi user dengan id tertentu

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;

    // cek password

    if (password != password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password and password confirmation do not match'
      );
    }

    // cek email sama/ engga
    const emailExist = await usersService.isEmailTaken(email);

    if (emailExist) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already exist'
      );
    }

    // cek berhasil create user/ engga
    const success = await usersService.createUser(name, email, password); // ini bkin user

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    const emailExist = await usersService.isEmailTaken(email);
    if (emailExist) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already exist'
      );
    }
    const success = await usersService.updateUser(id, name, email);

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;
    const password = request.params.password;

    const success = await usersService.deleteUser(id); // delete user
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function changePassword(request, response, next) {
  try {
    const id = request.params.id;
    const password = request.params.password;
    const new_password = request.params.new_password;
    const new_password_confirm = request.params.new_password_confirm;

    // cek berhasil change/ engga
    const success = await usersService.changePassword(id, new_password);

    if (new_password != new_password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password and password confirmation do not match'
      );
    }

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ password, new_password });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
