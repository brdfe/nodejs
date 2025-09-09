const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors())

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the router for handling routes
app.use('/', indexRouter);

app.get('/events', (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.flushHeaders();

  const interval = setInterval(() => {
    res.write(`data: ${new Date().toISOString()}\n\n`);
  }, 1000);

  // 👇 Detect client disconnect
  req.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
    res.end();
  });

  res.on("close", () => {
    console.log('couldnt contact client')
  })
});

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
