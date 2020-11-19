const{response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {

    const {email, password} = req.body;

    try {

        const emailExists = await User.findOne({email});

        if(emailExists) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const user = new User(req.body);

        // Cifrar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password,salt);

        await user.save();

        // Generando JWT
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
           ok: false,
           msg: 'Error en el servidor, contacte administrador' 
        });
    }

    
}

const loginUser = async (req, res = response) => {

    const {email, password} = req.body;

    try {

        const userInDB = await User.findOne({email});

        if(!userInDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no está registrado'
            });
        }

        // Validar contraseña
        const validPassword = bcrypt.compareSync(password, userInDB.password)

        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña Erronea'
            });
        }

        // Generando el token
        const token = await generateJWT(userInDB.id);


        res.json({
            ok: true,
            user: userInDB,
            token
        });


       
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
           ok: false,
           msg: 'Error en el servidor, contacte administrador' 
        });
    }

    
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    const newToken = await generateJWT(uid)
    
    const userInDB = await User.findById(uid);

    res.json({
        ok: true,
        user: userInDB,
        token: newToken
    });

}


module.exports = {
    createUser,
    loginUser,
    renewToken
}