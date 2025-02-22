const express = require('express');
const router = express.Router();
const validation = require("../middlewares/validation");
const moviesController = require('../controllers/movies');

router.get('/', moviesController.getAll);

router.get('/:id', moviesController.getById);

router.post('/', validation.saveMovie, moviesController.create);

router.put('/:id', validation.saveMovie, moviesController.update);

router.delete('/:id', moviesController.deleteOne);

module.exports = router;
