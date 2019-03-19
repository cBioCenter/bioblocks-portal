import {
  BioblocksMiddleware,
  DataReducer,
  ReducerRegistry,
  Store
} from "bioblocks-viz";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createHashHistory } from "history";
import { Middleware } from "redux";
import { logger } from "redux-logger";
import * as thunk from "redux-thunk";

import { IDataset, IVignette, IVisualization } from "~bioblocks-portal~/data";

export const history = createHashHistory();

const middleWares: Middleware[] = [thunk.default, routerMiddleware(history)];
if (process.env.NODE_ENV === `development`) {
  middleWares.push(logger);
}
middleWares.push(BioblocksMiddleware);

ReducerRegistry.register(
  "dataset",
  DataReducer<IDataset | null>("dataset", null)
);
ReducerRegistry.register("router", connectRouter(history) as any);
ReducerRegistry.register(
  "vignettes",
  DataReducer<IVignette[]>("vignettes", [])
);
ReducerRegistry.register(
  "visualizations",
  DataReducer<IVisualization[]>("visualizations", [])
);

export const configureStore = () => {
  return Store;
};
