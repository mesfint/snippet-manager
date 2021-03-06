import express from "express";
import passport from "passport";
import {
  register,
  getAll,
  login,
  loginForm,
  registerForm,
  logout,
} from "../controller/userController.js";
import user from "../model/user.js";

const userRouter = express.Router();

userRouter.get("/users", getAll);
//register form
userRouter.get("/register", registerForm);
userRouter.post("/register", register);

//login form
userRouter.get("/login", loginForm);
userRouter.post("/login", login);
//userRouter.post('/login', loginForm)

//login form
userRouter.get("/login", loginForm);

//user logout 
userRouter.post("/logout", logout)
/* userRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login'
*/
export default userRouter;
