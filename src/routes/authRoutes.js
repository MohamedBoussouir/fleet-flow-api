const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur la route Auth !' });
});


router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

module.exports = router;