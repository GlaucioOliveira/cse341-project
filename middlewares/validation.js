const validator = require('../helpers/validate.js');

const savePlaylist = async (req, res, next) => {
    const validationRule = {
        name: "required|string",
        type: "required|string",
        owner: "required|string",
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch( err => console.log(err))
}

const saveMovie = async (req, res, next) => {
    const validationRule = {
        Title: "required|string",
        Year: "required|digits:4",
        Rated: "string",
        Released: "string",
        Runtime: "string",
        Genre: "string",
        Director: "string",
        Writer: "string",
        Actors: "string",
        Plot: "string",
        Language: "string",
        Country: "string",
        Awards: "string",
        Poster: "url",
        "Ratings.*.Source": "string",
        "Ratings.*.Value": "string",
        Metascore: "string",
        imdbRating: "string",
        imdbVotes: "string",
        imdbID: "string",
        Type: "string",
        totalSeasons: "string",
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch( err => console.log(err))
}

const updateMovie = async (req, res, next) => {
    const validationRule = {
        Title: "string",
        Year: "digits:4",
        Rated: "string",
        Released: "string",
        Runtime: "string",
        Genre: "string",
        Director: "string",
        Writer: "string",
        Actors: "string",
        Plot: "string",
        Language: "string",
        Country: "string",
        Awards: "string",
        Poster: "url",
        "Ratings.*.Source": "string",
        "Ratings.*.Value": "string",
        Metascore: "string",
        imdbRating: "string",
        imdbVotes: "string",
        imdbID: "string",
        Type: "string",
        totalSeasons: "string",
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch( err => console.log(err))
}

module.exports = {
    savePlaylist, saveMovie, updateMovie
};