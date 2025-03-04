import { Request, Response } from 'express';
import {getDatabaseClient} from '../db/client';
import { ObjectId } from 'mongodb';

const mongoCollection = () => {
  return getDatabaseClient().db().collection('movie');
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await mongoCollection().find();
    const resultArray = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(resultArray);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Must use a valid id to get a movie." });
  }

  try {
    const movieId = new ObjectId(req.params.id);
    const result = await mongoCollection().findOne({ _id: movieId });

    if (!result) {
      return res.status(404).json({ message: "Movie not found." });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const create = async (req: Request, res: Response) => {
  const movie = {
    Title: req.body.Title,
    Year: req.body.Year,
    Rated: req.body.Rated,
    Released: req.body.Released,
    Runtime: req.body.Runtime,
    Genre: req.body.Genre,
    Director: req.body.Director,
    Writer: req.body.Writer,
    Actors: req.body.Actors,
    Plot: req.body.Plot,
    Language: req.body.Language,
    Country: req.body.Country,
    Awards: req.body.Awards,
    Poster: req.body.Poster,
    Ratings: req.body.Ratings,
    Metascore: req.body.Metascore,
    imdbRating: req.body.imdbRating,
    imdbVotes: req.body.imdbVotes,
    imdbID: req.body.imdbID,
    Type: req.body.Type,
    totalSeasons: req.body.totalSeasons
  };

  try {
    const dbResponse = await mongoCollection().insertOne(movie);
    if (dbResponse.acknowledged) {
      res.status(201).json(dbResponse);
    } else {
      res.status(500).json({ message: 'Some error occurred while creating the movie.' });
    }
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Must use a valid id to update a movie." });
  }

  const movieId = new ObjectId(req.params.id);
  const movieToUpdate = await mongoCollection().findOne({ _id: movieId });

  if (!movieToUpdate) {
    return res.status(404).json({ message: "Movie not found." });
  }

  const updatedMovie = { ...movieToUpdate, ...req.body };

  try {
    const dbResponse = await mongoCollection().replaceOne({ _id: movieId }, updatedMovie);
    if (dbResponse.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Some error occurred while updating the movie.' });
    }
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteOne = async (req: Request, res: Response) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Must use a valid id to delete a movie." });
  }

  const movieId = new ObjectId(req.params.id);

  try {
    const dbResponse = await mongoCollection().deleteOne({ _id: movieId });

    if (dbResponse.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(500).json({ message: 'Some error occurred while deleting the movie.' });
    }
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


export default { getAll, getById, create, update, deleteOne };