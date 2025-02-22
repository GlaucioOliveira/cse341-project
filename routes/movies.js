const express = require('express');
const router = express.Router();
const validation = require("../middlewares/validation");
const moviesController = require('../controllers/movies');

router.get('/', moviesController.getAll);

router.get('/:id', moviesController.getById);

router.post('/', validation.savePlaylist, moviesController.create);

router.put('/:id', validation.savePlaylist, moviesController.update);

router.delete('/:id', moviesController.deleteOne);

module.exports = router;
