import { Request, Response } from 'express';
import mongodb from '../db/client';
import { ObjectId } from 'mongodb';

const mongoCollection = () => {
  return mongodb.getDatabaseClient().db().collection('playlist');
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await mongoCollection().find();
    const resultArray = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(resultArray);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Must use a valid id to get a playlist." });
  }

  try {
    const playlistId = new ObjectId(req.params.id);
    const result = await mongoCollection().findOne({ _id: playlistId });

    if (!result) {
      return res.status(404).json({ message: "Playlist not found." });
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const create = async (req: Request, res: Response) => {
  const playlist = {
    name: req.body.name,
    type: req.body.type,
    owner: req.body.owner,
    movies: req.body.movies || []
  };

  try {
    const dbResponse = await mongoCollection().insertOne(playlist);
    if (dbResponse.acknowledged) {
      return res.status(201).json(dbResponse);
    } else {
      return res.status(500).json({ message: 'Some error occurred while creating the playlist.' });
    }
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Must use a valid id to update a playlist." });
  }

  const playlistId = new ObjectId(req.params.id);

  const playlist = {
    name: req.body.name,
    type: req.body.type,
    owner: req.body.owner
  };

  try {
    const dbResponse = await mongoCollection().replaceOne({ _id: playlistId }, playlist);
    if (dbResponse.modifiedCount > 0) {
      return res.status(204).send();
    } else {
      return res.status(500).json({ message: 'Some error occurred while updating the playlist.' });
    }
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const deleteOne = async (req: Request, res: Response) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Must use a valid id to delete a playlist." });
  }

  const playlistId = new ObjectId(req.params.id);

  try {
    const dbResponse = await mongoCollection().deleteOne({ _id: playlistId });

    if (dbResponse.deletedCount > 0) {
      return res.status(200).send();
    } else {
      return res.status(500).json({ message: 'Some error occurred while deleting the playlist.' });
    }
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export default { getAll, getById, create, update, deleteOne };