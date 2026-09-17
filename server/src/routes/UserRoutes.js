const router = require('express').Router();
const UserController = require('../controllers/UserControllers');

router.post('/auth/cadastrar', UserController.create);

module.exports = router;