const express = require('express');
const router = express.Router();
const RemorqueController = require('../controllers/remorqueController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('Admin'));

router.post('/', RemorqueController.create);
router.get('/', RemorqueController.getAll);

module.exports = router;