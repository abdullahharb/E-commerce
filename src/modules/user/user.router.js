import express from 'express'
import * as user from './user.controller.js'
import { validation } from '../../middleware/validation.js'
import { createUserSchema, updateUserOrChangePasswordSchema, getOrDeleteUserSchema, changeUserRoleSchema } from './user.validation.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const userRouter = express.Router()


userRouter.route('/')
    .post(protectedRoutes, allowedTo('admin'), validation(createUserSchema), user.createUser)
    .get(protectedRoutes, allowedTo('admin', 'user'), user.getAllUsers)

userRouter.route('/:id')
    .get(protectedRoutes, allowedTo('admin', 'user'), validation(getOrDeleteUserSchema), user.getUser)
    .put(protectedRoutes, allowedTo('admin'), validation(updateUserOrChangePasswordSchema), user.updateUser)
    .delete(protectedRoutes, allowedTo('admin'), validation(getOrDeleteUserSchema), user.deleteUser)

// Admin only
userRouter.patch('/changeUserPassword/:id', protectedRoutes, allowedTo('admin'), validation(updateUserOrChangePasswordSchema), user.changeUserPassword)
// Admin only
userRouter.patch('/changeRole/:id', protectedRoutes, allowedTo('admin'), validation(changeUserRoleSchema), user.changeUserRole);


export default userRouter
