const express = require('express');
const router = express.Router();
const userController = require('../controller/user-controller');

router.post('/create', userController.createUser);
router.get('/:id', userController.getUser);

module.exports = router;