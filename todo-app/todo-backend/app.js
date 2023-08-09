require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require("mongoose");

const indexRouter = require('./routes/index');
const todosRouter = require('./routes/todos');

mongoose.connect(process.env.MONGO_URL)

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());

app.use('/', indexRouter);
app.use('/todos', todosRouter);

module.exports = app;
