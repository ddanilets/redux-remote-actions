import io from 'socket.io-client';
import * as constants from '../../common/constants';

const socketMiddleware = () => {
  let socket = null;

  const onOpen = (store, ws) => {
    return () => {
      store.dispatch({ type: constants.CONNECT_SUCCESS, payload: ws });
    };
  };

  const onClose = (store) => {
    return () => {
      store.dispatch({ type: constants.DISCONNECT_WS, payload: null });
    };
  };

  const onMessage = (store) => {
    return (evt) => {
      const message = evt.data;
      store.dispatch({ type: constants.RECEIVE_DATA, payload: message });
      if (message) {
        switch (message.type) {
          case constants.ACTION_TRANSPORT:
            store.dispatch(message.payload);
            break;
          case constants.GATHER_CLIENTS:
            store.dispatch({ type: constants.ADD_CLIENT, payload: message.payload });
            break;
          default:
            break;
        }
      }
    };
  };

  return (store) => {
    return (next) => {
      return (action) => {
        if (action.type === constants.WS_ACTION) {
          if (socket) {
            socket.close();
          }
          socket = io(action.payload.url,
            {
              query: `id=${action.payload.id}`,
              transports: ['polling', 'websocket'],
            });
          socket.on('connect', onOpen(store, socket));
          socket.on('event', onMessage(store));
          socket.on('disconnect', onClose(store));
        } else {
          return next(action);
        }
        return next(action);
      };
    };
  };
};

export default socketMiddleware();
