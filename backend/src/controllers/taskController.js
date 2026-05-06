const Task = require('../models/Task');
const { enqueueTask } = require('../services/queue');

const createTask = async (req, res) => {
  const { title, inputText, operation } = req.body;

  if (!title || !inputText || !operation) {
    return res.status(400).json({ message: 'title, inputText and operation are required' });
  }

  const task = await Task.create({
    userId: req.user.id,
    title,
    inputText,
    operation,
    status: 'pending',
    logs: ['Task created']
  });

  return res.status(201).json(task);
};

const runTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (task.status === 'running') {
    return res.status(409).json({ message: 'Task is already running' });
  }

  task.status = 'pending';
  task.logs.push('Task queued for processing');
  await task.save();

  await enqueueTask({ taskId: task._id.toString() });

  return res.json({ message: 'Task queued', taskId: task._id });
};

const listTasks = async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
  return res.json(tasks);
};

const getTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.json(task);
};

const updateTask = async (req, res) => {
  const { title, inputText, operation } = req.body;
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (task.status === 'running') {
    return res.status(409).json({ message: 'Running task cannot be edited' });
  }

  if (title) task.title = title;
  if (inputText) task.inputText = inputText;
  if (operation) task.operation = operation;
  task.logs.push('Task updated by user');
  await task.save();
  return res.json(task);
};

const deleteTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (task.status === 'running') {
    return res.status(409).json({ message: 'Running task cannot be deleted' });
  }

  await Task.deleteOne({ _id: task._id });
  return res.json({ message: 'Task deleted' });
};

module.exports = { createTask, runTask, listTasks, getTask, updateTask, deleteTask };
