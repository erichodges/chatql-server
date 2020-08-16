const bcrypt = require('bcrypt');
const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { JWT_SECRET } = require('../config/env.json');

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (err) {
        console.log(err);
      }
    },
    login: async (_, args) => {
      const { username, password } = args;
      const errors = {};

      try {
        if (username.trim() === '')
          errors.username = 'username must not be empty';
        if (password === '') errors.password = 'password must not be empty';
        if (Object.keys(errors).length > 0) {
          throw new UserInputError('bad input', { errors });
        }

        const user = await User.findOne({
          where: { username },
        });

        if (!user) {
          errors.username = 'user not found';
          throw new UserInputError('user not found', { errors });
        }
        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
          errors.password = 'password is incorrect';
          throw new AuthenticationError('password is incorrect', { errors });
        }

        const token = jwt.sign(
          {
            username,
          },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        user.token = token;

        return user;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { username, email, password, confirmPassword } = args;
      const errors = {};

      try {
        // Validate input data

        if (email.trim() === '') errors.email = 'email must not be empty';
        if (username.trim() === '')
          errors.username = 'username must not be empty';
        if (password.trim() === '')
          errors.password = 'password must not be empty';
        if (confirmPassword.trim() === '')
          errors.confirmPassword = 'confirm password must not be empty';

        if (password !== confirmPassword)
          errors.confirmPassword = 'passwords must match exactly';

        // Check if username / email exist
        // const userByUsername = await User.findOne({ where: { username } });
        // const userByEmail = await User.findOne({ where: { email } });

        // if (userByUsername) errors.username = 'Username is taken';
        // if (userByEmail) errors.email = 'Email is taken';

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        // Hash password
        password = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
          username,
          email,
          password,
        });

        // Return user
        return user;
      } catch (err) {
        console.log(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
          err.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken`)
          );
        } else if (err.name === 'SequelizeValidationError') {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError('Bad user input', { errors });
      }
    },
  },
};
