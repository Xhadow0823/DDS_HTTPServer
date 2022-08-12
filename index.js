const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const api = require('./routes');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cookieParser());

app.use('/api', api);

app.use(express.static('statics'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
}); 