//All routing takes place here
const express = require('express');

const router = express.Router();
const postDB = require('./data/db');

//Post

// /api/posts Creates a post using the information sent inside the `request body`.
//This one isn't working and I don't know why
router.post('/', (req, res) => {
	const postData = req.body;
	if (!postData.title || !postData.contents) {
		res
			.status(400)
			.json({errorMessage: 'Please provide title and contents for the post.'});
		console.log(postData.title);
		console.log(postData.contents);
	} else {
		postDB
			.insert(postData)
			.then(post => {
				res.status(201).json(post);
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: 'There was an error while saving the post to the database'
				});
			});
	}
});

// /api/posts/:id/comments  Creates a comment for the post with the specified id using information sent inside of the `request body`.
router.post('/:id/comments', (req, res) => {
	const postData = req.body;
	if (!postData.text) {
		res
			.status(400)
			.json({errorMessage: 'Please provide text for the comment.'});
	} else if (!postDB.findById(postData.post_id)) {
		res
			.status(404)
			.json({message: 'The post with the specified ID does not exist.'});
	} else {
		postDB
			.insertComment(postData)
			.then(id => {
				res.status(201).json(id);
			})
			.catch(error => {
				console.log(error);
				res.status(500).json({
					error: 'There was an error while saving the comment to the database'
				});
			});
	}
});

//Get

// /api/posts          Returns an array of all the post objects contained in the database.
router.get('/', (req, res) => {
	const pagination = req.query;
	postDB
		.find(pagination)
		.then(posts => {
			res.status(201).json(posts);
		})
		.catch(err => {
			res
				.status(500)
				.json({error: 'The post information could not be retrieved.'});
		});
});

// /api/posts/:id      Returns the post object with the specified id.
router.get('/:id', (req, res) => {
	postDB
		.findById(req.params.id)
		.then(posts => {
			if (post) {
				res.status(200).json(post);
			} else {
				res
					.status(404)
					.json({message: 'The post with the specified ID does not exist.'});
			}
			res.status(201).json(posts);
		})
		.catch(error =>
			res
				.status(500)
				.json({error: 'The post information could not be retrieved.'})
		);
});
// /api/posts/:id/comments Returns an array of all the comment objects
// associated with the post with the specified id.

router.get('/:id/comments', (req, res) => {
	postDB
		.findCommentById(req.params.id)
		.then(posts => {
			if (posts) {
				res.status(200).json(posts);
			} else {
				res
					.status(404)
					.json({message: 'The post with the specified ID does not exist.'});
			}
			res.status(201).json(posts);
		})
		.catch(error =>
			res
				.status(500)
				.json({error: 'The comments information could not be retrieved.'})
		);
});

//Delete

// /api/posts/:id  Removes post with specified id and returns the **deleted post object**.
//You may need to make additional calls to the database in order to satisfy this requirement.

router.delete('/:id', (req, res) => {
	postDB
		.remove(req.params.id)
		.then(posts => {
			if (postDB.findById(posts)) {
				res.status(201).json(posts);
			} else {
				res
					.status(404)
					.json({message: 'The post with the specified ID does not exist.'});
			}
		})
		.catch(error => {
			res
				.status(500)
				.json({message: 'The post with the specified ID does not exist.'});
		});
});

//Put
// /api/posts/:id  Updates post with specified `id` using data from the `request body`. Returns the modified document, **NOT the original**.                                           |
router.put('/:id', (req, res) => {
	postDB
		.update(req.params.id, req.body)
		.then(posts => {
			if (posts === undefined) {
				res
					.status(404)
					.json({message: 'The post with the specified ID does not exist.'});
			} else if (!req.body.title || !req.body.contents) {
				res.status(400).json({
					errorMessage: 'Please provide title and contents for the post.'
				});
			} else {
				res.status(200).json(posts);
			}
		})
		.catch(err => {
			console.log(err);
			res
				.status(500)
				.json({error: 'The post information could not be modified.'});
		});
});

module.exports = router;
