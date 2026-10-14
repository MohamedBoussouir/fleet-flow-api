const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');


const validateDto = require('../middlewares/validateDto');
const { registerSchema, loginSchema } = require('../dtos/authDto');


router.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur la route Auth !' });
});


router.post('/register', validateDto(registerSchema), AuthController.register);
router.post('/login', validateDto(loginSchema), AuthController.login);

module.exports = router;