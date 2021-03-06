import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, ReactReduxContext } from 'react-redux';

import { BioblocksPortalPage, configureStore } from '~bioblocks-portal~';

// tslint:disable-next-line:no-submodule-imports no-import-side-effect
import 'bioblocks-viz/lib/assets/semantic.flat.min.css';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <BioblocksPortalPage />
  </Provider>,
  document.getElementById('app-root'),
);

// Hot reloading
if (module.hot) {
  module.hot.accept();
}
