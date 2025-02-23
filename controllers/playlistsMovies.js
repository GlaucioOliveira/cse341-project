const mongodb = require('../db/client');
const ObjectId = require('mongodb').ObjectId;

const mongoCollection = (collectionName) => {
  return mongodb.getDatabaseClient().db().collection(collectionName);
};


const create = async (req, res) => {
  ///playlists/:playlistId/movies/:movieId
  const { playlistId, movieId } = req.params;

  if(!ObjectId.isValid(req.params.playlistId))
    {
      res.status(400).json("Must use a valid id to a playlist.");
    }

  if(!ObjectId.isValid(req.params.movieId))
    {
      res.status(400).json("Must use a valid id to a movie.");
    }    
  
  try{

    const playlists = mongoCollection("playlist");
    const movies = mongoCollection("movie");

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
      res.status(201).json(dbResponse);
    } else {
      res
        .status(500)
        .json(dbResponse.error || 'Some error occurred while adding a movie to the playlist.');
    }
  }
  catch (err){
    res.status(400).json({message: err.message});
  }
};

const deleteOne = async (req, res) => {
  ///playlists/:playlistId/movies/:movieId
  const { playlistId, movieId } = req.params;

  if(!ObjectId.isValid(req.params.playlistId))
    {
      res.status(400).json("Must use a valid id to a playlist.");
    }

  if(!ObjectId.isValid(req.params.movieId))
    {
      res.status(400).json("Must use a valid id to a movie.");
    }    

  try{
    const playlists = mongoCollection("playlist");
    const movies = mongoCollection("movie");
    
    const movie = await movies.findOne({ _id: new ObjectId(movieId) });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    // Remove movie from playlist
    await playlists.updateOne(
      { _id: new ObjectId(playlistId) },
      { $pull: { movies: {movieId: new ObjectId(movieId) } } } // Removes movie from the array
    );

  
    res.status(200).json({ message: "Movie removed from playlist successfully." });
  }
  catch (err){
    res.status(500).json({ message: "Error removing movie from playlist.", error: err.message });

  }
};

module.exports = { create, deleteOne };