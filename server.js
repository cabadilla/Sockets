const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server, {
    cors: { origin: '*' }
});

// Mapa para rastrear las conexiones de socket por usuario
const usersMap = new Map();
const messagesMap = new Map();

const { guardarMensaje, obtenerMensajesOrden } = require('./api');

io.on('connection', (socket) => {
    console.log('Se ha conectado un cliente:', socket.id);

    socket.on('join_chat', async (orderId) => {
        // Verificar si ya existe una lista de sockets para este número de orden
        if (!usersMap.has(orderId)) {
            // Si no existe, crear una nueva lista y asociarla con el número de orden
            usersMap.set(orderId, []);
            messagesMap.set(orderId, []);
        }
        // Agregar el socket actual a la lista de sockets asociados con este número de orden
        const userSockets = usersMap.get(orderId);
        userSockets.push(socket);
        //Se traen los mensajes anteriores de la base de datos
        //let mensajesAnteriores = await obtenerMensajesOrden(orderId); //TODO mandar los mensajes de la BD, de momento se guardan en un arreglo
        //Se emiten los mensajes anteriores
        socket.emit('get_chats', messagesMap.get(orderId));
        console.log(`Usuario ${socket.id} se ha unido al chat para la orden ${orderId}`);
    });


    socket.on('chat_message', async (data) => {
        console.log("data", data)
        const orderId = data.orderId;
        const message = data.mensaje;
        //Se guarda el mensaje en la base de datos
        let saveMessage = {
            idOrdenTrabajo: orderId,
            _id: message._id,
            user: message.user,
            text: message.text,
            createdAt: message.createdAt
        }
        await guardarMensaje(saveMessage);
        // Obtener la lista de sockets asociados con este número de orden
        const userSockets = usersMap.get(orderId) || [];    
        //Se guarda el mensaje en el map para mantener el historial
        const mensajes = messagesMap.get(orderId);
        mensajes.push(message);
        // Enviar el mensaje a todos los sockets asociados con este número de orden
        userSockets.forEach(targetUserSocket => {
            // Compara el socket que envía el mensaje con el socket destino
            if (targetUserSocket !== socket) {
                targetUserSocket.emit('chat_message', message);
                console.log(`Mensaje enviado de ${socket.id} a ${targetUserSocket.id}:`, message);
            }
        });
    });

    // Manejar desconexiones
    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
        // Eliminar la conexión desconectada de todas las listas de sockets
        usersMap.forEach((userSockets, orderId) => {
            const index = userSockets.indexOf(socket);
            if (index !== -1) {
                userSockets.splice(index, 1);
                console.log(`Usuario ${socket.id} desconectado del chat para la orden ${orderId}`);
            }
        });
    });
});

const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server, {
    cors: { origin: '*' }
});

// Mapa para rastrear las conexiones de socket por usuario
const usersMap = new Map();
const messagesMap = new Map();

const { guardarMensaje, obtenerMensajesOrden } = require('./api');

io.on('connection', (socket) => {
    socket.on('join_chat', async (orderId) => {
        console.log("join_chat", socket.id);
        // Verificar si ya existe una lista de sockets para este número de orden
        if (!usersMap.has(orderId)) {
            // Si no existe, crear una nueva lista y asociarla con el número de orden
            usersMap.set(orderId, []);
            messagesMap.set(orderId, []);
        }
        // Agregar el socket actual a la lista de sockets asociados con este número de orden
        const userSockets = usersMap.get(orderId);
        userSockets.push(socket);
        //Se traen los mensajes anteriores de la base de datos
        //let mensajesAnteriores = await obtenerMensajesOrden(orderId); //TODO mandar los mensajes de la BD, de momento se guardan en un arreglo
        //Se emiten los mensajes anteriores
        socket.emit('get_chats', messagesMap.get(orderId));
        console.log(`Usuario ${socket.id} se ha unido al chat para la orden ${orderId}`);
    });


    socket.on('chat_message', async (data) => {
        console.log("chat_message", socket.id);
        console.log("data", data)
        const orderId = data.orderId;
        const message = data.mensaje;
        //Se guarda el mensaje en la base de datos
        let saveMessage = {
            idOrdenTrabajo: orderId,
            _id: message._id,
            user: message.user,
            text: message.text,
            createdAt: message.createdAt
        }
        await guardarMensaje(saveMessage);
        // Obtener la lista de sockets asociados con este número de orden
        const userSockets = usersMap.get(orderId) || [];    
        //Se guarda el mensaje en el map para mantener el historial
        const mensajes = messagesMap.get(orderId);
        mensajes.push(message);
        //console.log("Sockets ",userSockets)
        console.log("Cantidad sockets ", userSockets.length)
        // Enviar el mensaje a todos los sockets asociados con este número de orden
        userSockets.forEach(targetUserSocket => {
            // Compara el socket que envía el mensaje con el socket destino
            if (targetUserSocket !== socket) {
                targetUserSocket.emit('chat_message', message);
                console.log(`Mensaje enviado de ${socket.id} a ${targetUserSocket.id}:`, message);
            }
        });
    });

    // Manejar desconexiones
    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
        // Eliminar la conexión desconectada de todas las listas de sockets
        usersMap.forEach((userSockets, orderId) => {
            const index = userSockets.indexOf(socket);
            if (index !== -1) {
                userSockets.splice(index, 1);
                console.log(`Usuario ${socket.id} desconectado del chat para la orden ${orderId}`);
                // Verificar si el arreglo está vacío después de eliminar el socket
                if (userSockets.length === 0) {
                    // Si está vacío, eliminar la entrada de la lista
                    usersMap.delete(orderId);
                    console.log(`No hay más sockets conectados para la orden ${orderId}. La entrada ha sido eliminada.`);
                }
            }
        });
    });
});

const port = process.env.PORT || 3000;
server.listen(port);
