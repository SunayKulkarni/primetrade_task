const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');


router.use(protect, authorize('admin'));

router.route('/').get(getAllUsers);
router.route('/:id').delete(deleteUser);

module.exports = router;
