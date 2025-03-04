import express, { NextFunction, Request, Response } from 'express';
import validation from '../middlewares/validation';
import moviesController from '../controllers/movies';
import { requiresAuth } from 'express-openid-connect';

const router = express.Router();

// Get all movies
router.get('/', async (req: Request, res: Response) => {
  await moviesController.getAll(req, res);
});

// Get movie by ID
router.get('/:id', (req: Request, res: Response) => {
  moviesController.getById(req, res);
});

// Create movie
router.post('/', requiresAuth()
,(req: Request, res: Response, next: NextFunction) => {
    validation.saveMovie(req, res, next);
}
,(req: Request, res: Response) => {
    moviesController.create(req, res);
});

// Update movie by ID
router.put('/:id', requiresAuth()
,(req: Request, res: Response, next: NextFunction) => {
    validation.updateMovie(req, res, next);
}
, (req: Request, res: Response) => {
  moviesController.update(req, res);
});

// Delete movie by ID
router.delete('/:id', requiresAuth(), (req: Request, res: Response) => {
  moviesController.deleteOne(req, res);
});

export default router;
