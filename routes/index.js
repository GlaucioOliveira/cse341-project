const express = require('express');
const router = express.Router();

router.use('/playlists', require('./playlists'));

module.exports = router;
