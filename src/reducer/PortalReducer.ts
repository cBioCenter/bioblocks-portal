import { DataReducer } from "bioblocks-viz";
import { connectRouter, RouterState } from "connected-react-router";
import { History } from "history";
import { combineReducers, Reducer } from "redux";
import { IDataset, IVignette, IVisualization } from "~bioblocks-portal~/data";

export interface IPortalReducerState {
  dataset: IDataset | null;
  router: RouterState;
  vignettes: IVignette[];
  visualizations: IVisualization[];
}

export const PortalReducer = (history: History): Reducer<IPortalReducerState> =>
  combineReducers({
    dataset: DataReducer<IDataset | null>("dataset", null),
    router: connectRouter(history),
    vignettes: DataReducer<IVignette[]>("vignettes", []),
    visualizations: DataReducer<IVisualization[]>("visualizations", [])
  });
