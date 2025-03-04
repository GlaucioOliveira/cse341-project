import express, { NextFunction, Request, Response } from 'express';
import validation from '../middlewares/validation';
import playlistsController from '../controllers/playlists';
import playlistsMoviesController from '../controllers/playlistsMovies';
import { requiresAuth } from 'express-openid-connect';

const router = express.Router();

// Get all playlists
router.get('/', requiresAuth(), (req: Request, res: Response) => {playlistsController.getAll(req, res)});

// Get a playlist by ID
router.get('/:id', (req: Request, res: Response) => {
  playlistsController.getById(req, res);
});

// Create a new playlist
router.post('/', requiresAuth()
,(req: Request, res: Response, next: NextFunction) => {
    validation.savePlaylist(req, res, next);
}
,(req: Request, res: Response) => {
    playlistsController.create(req, res)
});

// Update a playlist by ID
router.put('/:id', requiresAuth()
,(req: Request, res: Response, next: NextFunction) => {
    validation.savePlaylist(req, res, next);
}
,(req: Request, res: Response) => {
  playlistsController.update(req, res);
});

// Delete a playlist by ID
router.delete('/:id', requiresAuth(), (req: Request, res: Response) => {
  playlistsController.deleteOne(req, res);
});

// Add a movie to a playlist
router.post('/:playlistId/movies/:movieId', requiresAuth(), (req: Request, res: Response) => {
  playlistsMoviesController.create(req, res);
});


// Remove a movie from a playlist
router.delete('/:playlistId/movies/:movieId', requiresAuth(), (req: Request, res: Response) => {
    const { playlistId, movieId } = req.params;
    playlistsMoviesController.deleteOne(req, res);
  });
  
  export default router;