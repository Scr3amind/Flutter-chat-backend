/*
    path:api/users

*/

const {Router, response} = require('express');
const { getUsers } = require('../controllers/users');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();

router.get('/', validateJWT, getUsers);


module.exports = router;