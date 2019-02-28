import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';

export const PortalReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
  });
