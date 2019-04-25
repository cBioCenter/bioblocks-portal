import { IPortalReducerState } from '~bioblocks-portal~/reducer';

export const selectDataset = <T>(state: IPortalReducerState) => state.dataset;

export const selectDatasets = <T>(state: IPortalReducerState) => (state.datasets ? state.datasets : []);

export const selectVignettes = <T>(state: IPortalReducerState) => (state.vignettes ? state.vignettes : []);

export const selectVisualizations = <T>(state: IPortalReducerState) =>
  state.visualizations ? state.visualizations : [];
