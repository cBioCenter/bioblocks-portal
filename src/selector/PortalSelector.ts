// ~bioblocks-portal~
// Portal Selector
// Selector for bioblocks-portal, for accessing the store and dealing with default values.
// ~bioblocks-portal~

import { IPortalReducerState } from '~bioblocks-portal~/reducer';

export const selectDataset = <T>(state: Partial<IPortalReducerState>) =>
  state.dataset !== undefined ? state.dataset : null;

export const selectDatasets = <T>(state: Partial<IPortalReducerState>) =>
  state.datasets !== undefined ? state.datasets : [];

export const selectVignettes = <T>(state: Partial<IPortalReducerState>) =>
  state.vignettes !== undefined ? state.vignettes : [];

export const selectVisualizations = <T>(state: Partial<IPortalReducerState>) =>
  state.visualizations ? state.visualizations : [];
