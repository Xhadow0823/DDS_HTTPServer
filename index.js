const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const api = require('./routes');

const app = express();
const { createServer } = require('http');
const httpServer = createServer(app);
const { Server } = require("socket.io");
const { win32 } = require('path');
const io = new Server(httpServer);

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cookieParser());

app.use('/api', api);

app.use(express.static('statics'));
// 前端網頁
app.use(express.static('statics/html'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 當有新 Socket 連接上時，做...
io.on('connection', (socket) => {
  console.log('New socket connection!');
});

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

// ========== Interrupt 邏輯處理 Start ==========
if(process.platform == win32) {
  var readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });
  readline.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}
process.on('SIGINT', () => {
  console.log('i got you');
  process.exit();  // for windows
});
// ========== Interrupt 邏輯處理 End ==========