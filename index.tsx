import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { PredictedContactMap } from 'bioblocks-viz';

// tslint:disable-next-line:no-submodule-imports no-import-side-effect
import 'bioblocks-viz/lib/assets/semantic.flat.min.css';

ReactDOM.render(<PredictedContactMap />, document.getElementById('app-root'));

if (module.hot) {
  module.hot.accept();
}
