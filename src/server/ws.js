/* eslint-disable no-restricted-syntax, no-console */
import * as constants from '../common/constants';

export default function (io, server) {
  io.on('connection', (newSocket) => {
    const socketId = newSocket.handshake.query.id;
    const sockets = io.sockets.sockets;
    Object.keys(sockets).forEach((socket) => {
      sockets[socket].emit('event', {
        type: constants.GATHER_CLIENTS,
        payload: socketId,
      });
    });
  });
  server.get('/ws/clients', (req, res) => {
    const sockets = io.sockets.sockets;
    const clients = Object.keys(sockets).map((socket) => {
      return sockets[socket].handshake.query.id;
    });
    res.send(`
    Opened connections: ${clients.length}\n
    ${clients.join('\n')}
    `);
  });

  server.post('/ws/action/:id', (req, res) => {
    res.send(200);
    const socketId = req.params.id;
    const action = req.body;
    let currentSocket = null;
    const sockets = io.sockets.connected;
    for (const socket in sockets) {
      if (Object.hasOwnProperty.call(sockets, socket)) {
        if (sockets[socket].handshake.query.id === socketId) {
          currentSocket = sockets[socket];
        }
      }
    }
    if (currentSocket) {
      if (action && action.type === constants.TRANSFER_ACTION) {
        currentSocket.emit('event', {
          type: constants.ACTION_TRANSPORT,
          payload: action.payload,
        });
      }
    }
  });
}
