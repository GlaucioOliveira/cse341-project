import express, { Request, Response } from 'express';
import validation from '../middlewares/validation';
import moviesController from '../controllers/movies';
import { requiresAuth } from 'express-openid-connect';

const router = express.Router();

// Get all movies
router.get('/', (req: Request, res: Response) => moviesController.getAll(req, res));

// Get movie by ID
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  moviesController.getById(req, res); // Ensure getById can handle the id
});

// Create movie
router.post('/', requiresAuth(), validation.saveMovie, (req: Request, res: Response) => moviesController.create(req, res));

// Update movie by ID
router.put('/:id', requiresAuth(), validation.updateMovie, (req: Request, res: Response) => {
  const { id } = req.params;
  moviesController.update(req, res); // Pass the id to the update method
});

// Delete movie by ID
router.delete('/:id', requiresAuth(), (req: Request, res: Response) => {
  moviesController.deleteOne(req, res); // Pass the id to the delete method
});

export default router;
