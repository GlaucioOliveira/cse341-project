const mongodb = require('../db/client');
const ObjectId = require('mongodb').ObjectId;

const mongoCollection = () => {
  return mongodb.getDatabaseClient().db().collection('playlist');
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
      res.status(400).json("Must use a valid id to get a playlist.");
    }

  try{
    const playlistId = new ObjectId(req.params.id);
    const result = await mongoCollection().find({ _id: playlistId });
    const resultArray = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(resultArray[0]);
  }
  catch (err){
    res.status(400).json({message: err.message});
  }
};

const create = async (req, res) => {
  const playlist = {
    name: req.body.name,
    type: req.body.type,
    owner: req.body.owner
  };

  try{
    const dbResponse = await mongoCollection().insertOne(playlist);
    if (dbResponse.acknowledged) {
      res.status(201).json(dbResponse);
    } else {
      res
        .status(500)
        .json(dbResponse.error || 'Some error occurred while creating the playlist.');
    }
  }
  catch (err){
    res.status(400).json({message: err.message});
  }
};

const update = async (req, res) => {
  if(!ObjectId.isValid(req.params.id))
    {
      res.status(400).json("Must use a valid id to update a playlist.");
    }

  const playlistId = new ObjectId(req.params.id);

  const playlist = {
    name: req.body.name,
    type: req.body.type,
    owner: req.body.owner
  };

  try{
    const dbResponse = await mongoCollection().replaceOne({ _id: playlistId }, playlist);
    console.log(dbResponse);
    if (dbResponse.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(dbResponse.error || 'Some error occurred while updating the playlist.');
    }
  }
  catch (err){
    res.status(400).json({message: err.message});
  }
};

const deleteOne = async (req, res) => {
  if(!ObjectId.isValid(req.params.id))
    {
      res.status(400).json("Must use a valid id to delete a playlist.");
    }
  const playlistId = new ObjectId(req.params.id);

  try{
    const dbResponse = await mongoCollection().deleteOne(
      {
        _id: playlistId
      },
      true
    );
  
    console.log(dbResponse);
  
    if (dbResponse.deletedCount > 0) {
      res.status(200).send();
    } else {
      res
        .status(500)
        .json(dbResponse.error || 'Some error occurred while deleting the playlist.');
    }
  }
  catch (err){
    res.status(400).json({message: err.message});
  }
  
};

module.exports = { getAll, getById, create, update, deleteOne };
