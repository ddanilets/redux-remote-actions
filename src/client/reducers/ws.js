import * as constants from '../../common/constants';
import initialState from '../initialState/ws';

export default function (state = initialState, action) {
  const newState = Object.assign({}, state);
  const { type, payload } = action;
  switch (type) {
    case constants.RECEIVE_DATA:
      newState.messages = state.messages.concat(payload);
      break;
    case constants.CONNECT_SUCCESS:
      newState.websocket = payload;
      break;
    case constants.DISCONNECT_WS:
      newState.websocket = null;
      break;
    case constants.ADD_CLIENT:
      newState.clients = state.clients.concat(payload);
      break;
    case constants.ACTION_TRANSPORT:
      newState.actionHistory = state.actionHistory.concat(payload);
      break;
    default:
      break;
  }
  return newState;
}

