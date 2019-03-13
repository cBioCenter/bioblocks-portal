import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore, ConnectedBioblocksPortalApp as App } from '~bioblocks-portal~';

// tslint:disable-next-line:no-import-side-effect no-relative-imports
import './assets/semantic.flat.min.css';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app-root'),
);

if (module.hot) {
  module.hot.accept();
}
