import express from 'express'
import * as auth from './auth.controller.js'
import { validation } from '../../middleware/validation.js'
import { signUpUserSchema } from './auth.validation.js'

const authRouter = express.Router()

authRouter.post('/signup', validation(signUpUserSchema), auth.signUp)
authRouter.post('/signin', auth.signIn)

export default authRouter
