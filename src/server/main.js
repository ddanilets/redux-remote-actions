import bodyParser from 'body-parser';
import httpEnchancer from 'http';
import ioEnchancer from 'socket.io';
import websocketHandler from './ws';

export default function (server) {
  const http = httpEnchancer.Server(server);
  const io = ioEnchancer(http, { transports: ['polling', 'websocket'] });
  server.use(bodyParser.json());
  websocketHandler(io, server);
}
