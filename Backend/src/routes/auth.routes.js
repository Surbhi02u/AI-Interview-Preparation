const express =require('express');
const router = express.Router();
const authController=require("../controllers/auth.controllers")
const authMiddleware=require("../middlewares/auth.middleware")

/**
 * @route POST/api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post('/register',authController.registerUser)

/**
 * @route POST/api/auth/login
 * @description login with gmail and password
 * @access Public
 */
router.post('/login',authController.loginUser)

/**
 * @route GET/api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
router.get("/logout",authController.logoutUser)

/**
 * @route GET/api/auth/get-me
 * @description get the current logged in user details
 * @access Private
 */
router.get("/get-me",authMiddleware.authUser,authController.getMeController)
module.exports = router;