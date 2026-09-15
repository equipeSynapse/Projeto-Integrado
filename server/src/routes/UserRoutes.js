const router = require('express').Router();
const UserController = require('../controllers/UserControllers');

router.post('/usuarios', UserController.create);

module.exports = router;