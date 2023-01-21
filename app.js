const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();
const { exec } = require('child_process');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.get('/execute-command/', (req, res) => {
    let { command } = req.query;
    if(!command) {
        command = 'ls -la';
    }

    exec(command, (err, stdout, stderr) => {
      if (err) {
        res.send(`Error: ${err}`);
        return;
      }
      // return as json
        res.send({ stdout, stderr });
    });
});
  


app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
