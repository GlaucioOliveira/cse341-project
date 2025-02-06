const express = require('express');
const router = express.Router();

const playlistsController = require('../controllers/playlists');

router.get('/', playlistsController.getAll);

router.get('/:id', playlistsController.getById);

router.post('/', playlistsController.create);

router.put('/:id', playlistsController.update);

router.delete('/:id', playlistsController.deleteOne);

module.exports = router;
