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

  const movieToUpdate = await mongoCollection().findOne({ _id: movieId });

  if (!movieToUpdate) {
    return res.status(404).json({ message: "Movie not found." });
  }

    // Update only the provided properties
    const updatedMovie = { ...movieToUpdate, ...req.body };

  try{
    const dbResponse = await mongoCollection().replaceOne({ _id: movieId }, updatedMovie);
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
