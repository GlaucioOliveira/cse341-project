import { Request, Response } from 'express';
import mongodb from '../db/client';
import { ObjectId } from 'mongodb';

// Helper function to get MongoDB collection
const mongoCollection = (collectionName: string) => {
  return mongodb.getDatabaseClient().db().collection(collectionName);
};

// Add a movie to a playlist
export const create = async (req: Request, res: Response): Promise<void> => {
  const { playlistId, movieId } = req.params;

  // Validate playlistId and movieId
  if (!ObjectId.isValid(playlistId)) {
    res.status(400).json({ message: "Must use a valid id to a playlist." });
    return;
  }

  if (!ObjectId.isValid(movieId)) {
    res.status(400).json({ message: "Must use a valid id to a movie." });
    return;
  }

  try {
    const playlists = mongoCollection('playlist');
    const movies = mongoCollection('movie');

    // Check if the movie exists
    const movie = await movies.findOne({ _id: new ObjectId(movieId) });
    if (!movie) {
      res.status(404).json({ message: "Movie not found." });
      return;
    }

    const movieData = {
      movieId: movie._id,
      Title: movie.Title,
      Year: movie.Year,
      Runtime: movie.Runtime,
      Genre: movie.Genre,
      imdbRating: movie.imdbRating
    };

    // Add movie to playlist
    const dbResponse = await playlists.updateOne(
      { _id: new ObjectId(playlistId) },
      { $addToSet: { movies: movieData } } // Prevents duplicate movies
    );

    if (dbResponse.acknowledged) {
      res.status(201).json(dbResponse);
    } else {
      res.status(500).json({ message: 'Some error occurred while adding a movie to the playlist.' });
    }
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Remove a movie from a playlist
export const deleteOne = async (req: Request, res: Response): Promise<void> => {
  const { playlistId, movieId } = req.params;

  // Validate playlistId and movieId
  if (!ObjectId.isValid(playlistId)) {
    res.status(400).json({ message: "Must use a valid id to a playlist." });
    return;
  }

  if (!ObjectId.isValid(movieId)) {
    res.status(400).json({ message: "Must use a valid id to a movie." });
    return;
  }

  try {
    const playlists = mongoCollection('playlist');
    const movies = mongoCollection('movie');

    // Check if the movie exists
    const movie = await movies.findOne({ _id: new ObjectId(movieId) });
    if (!movie) {
      res.status(404).json({ message: "Movie not found." });
      return;
    }

    // Remove movie from playlist
    await playlists.updateOne(
      { _id: new ObjectId(playlistId) },
      { pull: { movies: { movieId: new ObjectId(movieId) } } } // Removes movie from the array
    );

    res.status(200).json({ message: "Movie removed from playlist successfully." });
  } catch (err: any) {
    res.status(500).json({ message: "Error removing movie from playlist.", error: err.message });
  }
};

export default { create, deleteOne };