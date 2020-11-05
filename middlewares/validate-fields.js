const { validationResult } = require("express-validator");

const validateFields = () => {

}

module.exports =(req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    next();
}