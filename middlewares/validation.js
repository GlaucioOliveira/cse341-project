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

module.exports = {
    savePlaylist
};