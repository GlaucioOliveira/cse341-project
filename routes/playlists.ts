import express, { Request, Response } from 'express';
import validation from '../middlewares/validation';
import playlistsController from '../controllers/playlists';
import playlistsMoviesController from '../controllers/playlistsMovies';
import { requiresAuth } from 'express-openid-connect';

const router = express.Router();

// Get all playlists
router.get('/', requiresAuth(), (req: Request, res: Response) => playlistsController.getAll(req, res));

// Get a playlist by ID
router.get('/:id', (req: Request, res: Response) => {
  playlistsController.getById(req, res); // Make sure getById is typed to accept the id
});

// Create a new playlist
router.post('/', requiresAuth(), validation.savePlaylist, (req: Request, res: Response) => playlistsController.create(req, res));

// Update a playlist by ID
router.put('/:id', requiresAuth(), validation.savePlaylist, (req: Request, res: Response) => {
  playlistsController.update(req, res); // Pass the id to the update method
});

// Delete a playlist by ID
router.delete('/:id', requiresAuth(), (req: Request, res: Response) => {
  playlistsController.deleteOne(req, res); // Pass the id to the delete method
});

// Add a movie to a playlist
router.post('/:playlistId/movies/:movieId', requiresAuth(), (req: Request, res: Response) => {
  playlistsMoviesController.create(req, res); // Ensure this method can handle both params
});


// Remove a movie from a playlist
router.delete('/:playlistId/movies/:movieId', requiresAuth(), (req: Request, res: Response) => {
    const { playlistId, movieId } = req.params;
    playlistsMoviesController.deleteOne(req, res); // Ensure this method can handle both params
  });
  
  export default router;