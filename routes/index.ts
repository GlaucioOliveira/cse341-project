import express from 'express';
import playlistsRouter from './playlists';
import moviesRouter from './movies';

export const router = express.Router();

router.use('/playlists', playlistsRouter);
router.use('/movies', moviesRouter);

export default router;
