const mongodb = require('../db/client');
const ObjectId = require('mongodb').ObjectId;

const mongoCollection = () => {
  return mongodb.getDatabaseClient().db().collection('playlist');
};

const getAll = async (request, response) => {
  const result = await mongoCollection().find();
  result.toArray().then((lists) => {
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json(lists);
  });
};

const getById = async (request, response) => {
  const playlistId = new ObjectId(request.params.id);
  const result = await mongoCollection().find({ _id: playlistId });
  result.toArray().then((lists) => {
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json(lists[0]);
  });
};

const create = async (request, response) => {
  const playlist = {
    name: request.body.name,
    type: request.body.type,
    owner: request.body.owner
  };

  if (
    !playlist.name ||
    !playlist.type ||
    !playlist.owner
  ) {
    response.status(400).json('Please provide all required fields.');
    return;
  }

  const dbResponse = await mongoCollection().insertOne(playlist);
  if (dbResponse.acknowledged) {
    response.status(201).json(dbResponse);
  } else {
    response
      .status(500)
      .json(dbResponse.error || 'Some error occurred while creating the playlist.');
  }
};

const update = async (request, response) => {
  const playlistId = new ObjectId(request.params.id);

  const playlist = {
    name: request.body.name,
    type: request.body.type,
    owner: request.body.owner
  };
  const dbResponse = await mongoCollection().replaceOne({ _id: playlistId }, playlist);
  console.log(dbResponse);
  if (dbResponse.modifiedCount > 0) {
    response.status(204).send();
  } else {
    response
      .status(500)
      .json(dbResponse.error || 'Some error occurred while updating the playlist.');
  }
};

const deleteOne = async (request, response) => {
  const playlistId = new ObjectId(request.params.id);

  const dbResponse = await mongoCollection().deleteOne(
    {
      _id: playlistId
    },
    true
  );

  console.log(dbResponse);

  if (dbResponse.deletedCount > 0) {
    response.status(200).send();
  } else {
    response
      .status(500)
      .json(dbResponse.error || 'Some error occurred while deleting the playlist.');
  }
};

module.exports = { getAll, getById, create, update, deleteOne };
