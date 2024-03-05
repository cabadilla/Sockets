const axios = require('axios');
const URL = "https://apiapp.telecablecr.com/App/Uberizacion"

async function guardarMensaje(mensaje) {
    try {
        //TODO descomentar cuando este el api
        //const respuesta = await axios.post(URL + "/enviarMensajeChat", mensaje);
        //console.log('Mensaje guardado en la API:', respuesta.data);
        console.log(mensaje)
    } catch (error) {
        console.error('Error al guardar el mensaje en la API:', error);
    }
}

async function obtenerMensajesOrden(idOrdenTrabajo) {
    try {
        //TODO descomentar cuando este el api
        //const respuesta = await axios.post(URL + "/obtenerChat", mensaje);
        //console.log('Mensaje guardado en la API:', respuesta.data);
        let respuesta = [{
            _id: 1,
            user: {
                _id: 1,
                avatar: "http://drive.google.com/uc?export=view&id=1K80GfJf3byXUiF0VhcqWYkRz_4emXpJh"
            },
            text: "hola",
            createdAt: "2024-02-27T21:38:26.632Z"
        }]
        console.log(respuesta)
        return respuesta.listadoMensajes
    } catch (error) {
        console.error('Error al guardar el mensaje en la API:', error);
    }
}

module.exports = {
    guardarMensaje,
    obtenerMensajesOrden
};
