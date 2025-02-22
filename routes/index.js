const express = require('express');
const router = express.Router();

router.use('/playlists', require('./playlists'));
router.use('/movies', require('./movies'));

module.exports = router;
