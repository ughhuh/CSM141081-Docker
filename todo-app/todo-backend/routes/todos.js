const express = require('express');
const { Todo } = require('../mongo');
const { getAsync, setAsync, Counter } = require('../redis');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* GET statistics. */
router.get('/statistics', async (_, res) => {
  const addedTodos = await getAsync('todo_counter');
  const statistics = { todo_counter: addedTodos || 0 };

  res.json(statistics);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: req.body.done
  })
  // Increment the todo counter in Redis
  await Counter();
  const counterValue = await getAsync('todo_counter'); // Get the current counter value
  console.log('Counter Value:', counterValue);
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
router.get('/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    return res.status(404).send('To-Do not found');
  }
  res.send(todo);
});

/* PUT todo. */
router.put('/:id', async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
      text: req.body.text,
      done: req.body.done,
    },
    { new: true })
    res.send(todo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
