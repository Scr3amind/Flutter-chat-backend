const { validateRawJWT } = require('../helpers/jwt');
const { io } = require('../index');
const {userConnected,userDisconnected, storeMessage} = require('../controllers/socket')


// Mensajes de Sockets
io.on('connection', client => {

    console.log('Cliente conectado');

    const[isValid, uid] = validateRawJWT(client.handshake.headers['x-token']);

    // Verificar autenticación
    if(!isValid) {return client.disconnect();}

    //Autenticado
    userConnected(uid);

    // Ingresar al usuario a una sala en particular
    // Sala global, client.id
    client.join(uid);

    // Escuchar del cliente personal-message

    client.on('personal-message', async (payload) => {
        console.log(payload);
        await storeMessage(payload);
        io.to(payload.to).emit('personal-message', payload);
    });


    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        userDisconnected(uid);
    });

    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje', payload);

    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    // });


});
