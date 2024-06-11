const express = require('express');

const { authenticate, validateBody, upload } = require('../helpers');
const schemas = require('../schemas/userSchema');
const ctrl = require('../controllers/authControllers');

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(schemas.registerSchema),
  ctrl.register
);

authRouter.post('/login', validateBody(schemas.loginSchema), ctrl.login);

authRouter.get('/current', authenticate, ctrl.getCurrent);

authRouter.post('/logout', authenticate, ctrl.logout);

authRouter.put(
  '/update',
  authenticate,
  upload.single('avatarURL'),
  validateBody(schemas.updateUserSchema),
  ctrl.updateUser
);

authRouter.patch(
  '/theme',
  authenticate,
  validateBody(schemas.updateThemeSchema),
  ctrl.updateUserTheme
);

module.exports = authRouter;
