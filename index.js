const express = require('express');
const postsRouter = require('./postsRouter');
const server = express();

server.use(express.json());

//for URLs beginning with /api
server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
	res.send(`
    <h2>Blog Post </h2>
    <p> The app for posts is working</p>
  `);
});

const port = 5000;
server.listen(port, () => {
	console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});
