const express = require('express');
const router = express.Router();
const validation = require("../middlewares/validation");
const playlistsController = require('../controllers/playlists');

router.get('/', playlistsController.getAll);

router.get('/:id', playlistsController.getById);

router.post('/', validation.savePlaylist, playlistsController.create);

router.put('/:id', validation.savePlaylist, playlistsController.update);

router.delete('/:id', playlistsController.deleteOne);

module.exports = router;
