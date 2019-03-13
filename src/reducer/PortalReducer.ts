import { DataReducer } from 'bioblocks-viz';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import { combineReducers, Reducer } from 'redux';
import { IVignette, IVisualization } from '~bioblocks-portal~/data';

export interface IPortalReducerState {
  router: RouterState;
  vignettes: IVignette[];
  visualizations: IVisualization[];
}

export const PortalReducer = (history: History): Reducer<IPortalReducerState> =>
  combineReducers({
    router: connectRouter(history),
    vignettes: DataReducer<IVignette[]>('vignettes', []),
    visualizations: DataReducer<IVisualization[]>('visualizations', []),
  });
