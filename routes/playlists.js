const express = require('express');
const router = express.Router();
const validation = require("../middlewares/validation");
const playlistsController = require('../controllers/playlists');
const playlistsMoviesController = require('../controllers/playlistsMovies');
const { requiresAuth } = require('express-openid-connect');

router.get('/', playlistsController.getAll);

router.get('/:id', playlistsController.getById);

router.post('/', requiresAuth(), validation.savePlaylist, playlistsController.create);

router.put('/:id', requiresAuth(), validation.savePlaylist, playlistsController.update);

router.delete('/:id', requiresAuth(), playlistsController.deleteOne);

router.post('/:playlistId/movies/:movieId', requiresAuth(), playlistsMoviesController.create);

router.delete('/:playlistId/movies/:movieId', requiresAuth(), playlistsMoviesController.deleteOne);

module.exports = router;
