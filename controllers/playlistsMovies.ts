import { Request, Response } from 'express';
import mongodb from '../db/client';
import { ObjectId, UpdateFilter } from 'mongodb';
import { Playlist } from '../models/playlist';

// Helper function to get MongoDB collection
const mongoCollection = (collectionName: string) => {
  return mongodb.getDatabaseClient().db().collection(collectionName);
};

// Add a movie to a playlist
export const create = async (req: Request, res: Response) => {
  const { playlistId, movieId } = req.params;

  // Validate playlistId and movieId
  if (!ObjectId.isValid(playlistId)) {
    return res.status(400).json({ message: "Must use a valid id to a playlist." });
  }

  if (!ObjectId.isValid(movieId)) {
    return res.status(400).json({ message: "Must use a valid id to a movie." });
  }

  try {
    const playlists = mongoCollection('playlist');
    const movies = mongoCollection('movie');

    // Check if the movie exists
    const movie = await movies.findOne({ _id: new ObjectId(movieId) });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
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
      return res.status(201).json(dbResponse);
    } else {
      return res.status(500).json({ message: 'Some error occurred while adding a movie to the playlist.' });
    }
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

// Remove a movie from a playlist
export const deleteOne = async (req: Request, res: Response) => {
  const { playlistId, movieId } = req.params;

  // Validate playlistId and movieId
  if (!ObjectId.isValid(playlistId)) {
    return res.status(400).json({ message: "Must use a valid id to a playlist." });
  }

  if (!ObjectId.isValid(movieId)) {
    return res.status(400).json({ message: "Must use a valid id to a movie." });
  }

  try {
    const playlists = mongodb.getDatabaseClient().db().collection<Playlist>('playlist');
    const movies = mongoCollection('movie');

    // Check if the movie exists
    const movie = await movies.findOne({ _id: new ObjectId(movieId) });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });      
    }

    // Remove movie from playlist
    await playlists.updateOne(
      { _id: new ObjectId(playlistId) },
      { $pull: { movies: { movieId: new ObjectId(movieId) } } }
    );

    
    return res.status(200).json({ message: "Movie removed from playlist successfully." });
  } catch (err: any) {
    return res.status(500).json({ message: "Error removing movie from playlist.", error: err.message });
  }
};

export default { create, deleteOne };