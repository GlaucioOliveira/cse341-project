const express = require('express');
const router = express.Router();
const validation = require("../middlewares/validation");
const moviesController = require('../controllers/movies');
const { requiresAuth } = require('express-openid-connect');

router.get('/', moviesController.getAll);

router.get('/:id', moviesController.getById);

router.post('/', requiresAuth(), validation.saveMovie, moviesController.create);

router.put('/:id', requiresAuth(), validation.updateMovie, moviesController.update);

router.delete('/:id', requiresAuth(), moviesController.deleteOne);

module.exports = router;
