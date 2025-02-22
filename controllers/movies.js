const mongodb = require('../db/client');
const ObjectId = require('mongodb').ObjectId;

const mongoCollection = () => {
  return mongodb.getDatabaseClient().db().collection('movie');
};

const getAll = async (req, res) => {
  try{
    const result = await mongoCollection().find();
    const resultArray = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(resultArray);

  } catch (err) {
    res.status(400).json({message: err.message});
  }
};

const getById = async (req, res) => {
  if(!ObjectId.isValid(req.params.id))
    {
      res.status(400).json("Must use a valid id to get a movie.");
    }

  try{
    const movieId = new ObjectId(req.params.id);
    const result = await mongoCollection().find({ _id: movieId });
    const resultArray = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(resultArray[0]);
  }
  catch (err){
    res.status(400).json({message: err.message});
  }
};

const create = async (req, res) => {
  const movie = {
    name: req.body.name
  };

  try{
    const dbResponse = await mongoCollection().insertOne(movie);
    if (dbResponse.acknowledged) {
      res.status(201).json(dbResponse);
    } else {
      res
        .status(500)
        .json(dbResponse.error || 'Some error occurred while creating the movie.');
    }
  }
  catch (err){
    res.status(400).json({message: err.message});
  }
};

const update = async (req, res) => {
  if(!ObjectId.isValid(req.params.id))
    {
      res.status(400).json("Must use a valid id to update a movie.");
    }

  const movieId = new ObjectId(req.params.id);

  const movie = {
    name: req.body.name
  };

  try{
    const dbResponse = await mongoCollection().replaceOne({ _id: movieId }, movie);
    console.log(dbResponse);
    if (dbResponse.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(dbResponse.error || 'Some error occurred while updating the movie.');
    }
  }
  catch (err){
    res.status(400).json({message: err.message});
  }
};

const deleteOne = async (req, res) => {
  if(!ObjectId.isValid(req.params.id))
    {
      res.status(400).json("Must use a valid id to delete a movie.");
    }
  const movieId = new ObjectId(req.params.id);

  try{
    const dbResponse = await mongoCollection().deleteOne(
      {
        _id: movieId
      },
      true
    );
  
    console.log(dbResponse);
  
    if (dbResponse.deletedCount > 0) {
      res.status(200).send();
    } else {
      res
        .status(500)
        .json(dbResponse.error || 'Some error occurred while deleting the movie.');
    }
  }
  catch (err){
    res.status(400).json({message: err.message});
  }
  
};

module.exports = { getAll, getById, create, update, deleteOne };
