// ~bioblocks-portal~
// Portal Reducer
// Reducer for bioblocks-portal, for handling routing and data returned from bioblocks-server.
// ~bioblocks-portal~

import { DataReducer } from 'bioblocks-viz';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import { combineReducers, Reducer } from 'redux';
import { IDataset, IVignette, IVisualization } from '~bioblocks-portal~/data';

export interface IPortalReducerState {
  dataset: IDataset | null;
  datasets: IDataset[];
  router: RouterState;
  vignettes: IVignette[];
  visualizations: IVisualization[];
}

export const PortalReducer = (history: History): Reducer<IPortalReducerState> =>
  combineReducers({
    dataset: DataReducer<IDataset | null>('dataset', null),
    datasets: DataReducer<IDataset[]>('datasets', []),
    router: connectRouter(history),
    vignettes: DataReducer<IVignette[]>('vignettes', []),
    visualizations: DataReducer<IVisualization[]>('visualizations', []),
  });
