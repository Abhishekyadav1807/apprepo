const express = require('express');
const auth = require('../middleware/auth');
const { createTask, runTask, listTasks, getTask, updateTask, deleteTask } = require('../controllers/taskController');

const router = express.Router();

router.use(auth);
router.post('/', createTask);
router.get('/', listTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/run', runTask);

module.exports = router;
