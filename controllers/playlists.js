const mongodb = require('../db/client');
const ObjectId = require('mongodb').ObjectId;

const mongoCollection = () => {
  return mongodb.getDatabaseClient().db().collection('playlist');
};

const getAll = async (req, res) => {
  const result = await mongoCollection().find();
  result.toArray((err, lists) => {
    if(err){
      res.status(400).json({message: err});
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
});
};

const getById = async (req, res) => {
  if(!ObjectId.isValid(req.params.id))
    {
      res.status(400).json("Must use a valid id to get a playlist.");
    }

  const playlistId = new ObjectId(req.params.id);
  const result = await mongoCollection().find({ _id: playlistId });
  result.toArray((err, result) => {
    if(err){
      res.status(400).json({message: err});
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result[0]);
  });
};

const create = async (req, res) => {
  const playlist = {
    name: req.body.name,
    type: req.body.type,
    owner: req.body.owner
  };

  if (
    !playlist.name ||
    !playlist.type ||
    !playlist.owner
  ) {
    res.status(400).json('Please provide all required fields.');
    return;
  }

  const dbResponse = await mongoCollection().insertOne(playlist);
  if (dbResponse.acknowledged) {
    res.status(201).json(dbResponse);
  } else {
    res
      .status(500)
      .json(dbResponse.error || 'Some error occurred while creating the playlist.');
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
  const dbResponse = await mongoCollection().replaceOne({ _id: playlistId }, playlist);
  console.log(dbResponse);
  if (dbResponse.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(dbResponse.error || 'Some error occurred while updating the playlist.');
  }
};

const deleteOne = async (req, res) => {
  if(!ObjectId.isValid(req.params.id))
    {
      res.status(400).json("Must use a valid id to delete a playlist.");
    }
  const playlistId = new ObjectId(req.params.id);

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
};

module.exports = { getAll, getById, create, update, deleteOne };
