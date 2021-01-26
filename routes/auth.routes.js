const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Not valid email').isEmail(),
        check('password', "min length password 6 symbol").isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Not valid value at registration'
                })
            }

            const {email, password} = req.body

            const candidate = await User.findOne({email})

            if (candidate) {
                return res.status(400).json({message: 'That user already exists'})
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({email, password: hashedPassword})

            await user.save()

            res.status(201).json({message: 'User create!!!'})

        } catch (e) {
            res.status(500).json({message: 'Error try again'})
        }
    })

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Enter in correct email').normalizeEmail().isEmail(),
        check('password', 'Enter in password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Not valid value at enter in system'
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({email})


            if (!user) {
                return res.status(400).json({message: 'User is not find'})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({message: 'Password is not true pleas try again'})
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
             )
            console.log('token', token)
            res.json({token, userId: user.id})


        }
        catch (e) {
            console.log("-------------------")
            res.status(500).json({message: e.message})
        }
    })

module.exports = router
