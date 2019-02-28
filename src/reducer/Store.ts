import { RootState } from 'bioblocks-viz';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';

import { PortalReducer } from '~bioblocks-portal~/reducer';

export const history = createBrowserHistory();

export const configureStore = (preloadedState: RootState) => {
  return createStore(PortalReducer(history), preloadedState, compose(applyMiddleware(routerMiddleware(history))));
};
