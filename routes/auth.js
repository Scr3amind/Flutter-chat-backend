/*
    path:api/login

*/

const {Router, response} = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const validateFields = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();

router.post('/new',[
    check('name', 'El nombre es requerido').not().isEmpty(),
    check('email', 'El email valido es requerido').isEmail(),
    check('password', 'La contraseña es requerida').not().isEmpty(),
    validateFields
] ,createUser);

router.post('/', [
    check('email', 'El email valido es requerido').isEmail(),
    check('password', 'La contraseña es requerida').not().isEmpty(),
    validateFields
], loginUser);

router.get('/renew', validateJWT ,renewToken);


module.exports = router;