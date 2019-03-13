import { IVignette, IVisualization } from '~bioblocks-portal~/data';

export const riseAgainstVignette = {
  _id: 'rise-against-vignette-id',
  authors: [],
  icon: '',
  link: '',
  name: '',
  summary: 'Rise Against Viz',
  visualizations: ['franz-ferdinand-viz-id'],
};

export const jukeboxVignette = {
  _id: 'psycho-jukebox-vignette-id',
  authors: [],
  icon: '',
  link: '',
  name: '',
  summary: 'Psycho Jukebox Vignette',
  visualizations: ['eminem-viz-id'],
};

export const testVignettes: IVignette[] = [riseAgainstVignette];

export const originalViz = {
  _id: 'franz-ferdinand-viz-id',
  authors: ['Franz Ferdinand'],
  citations: [],
  compatibleData: [],
  isOriginal: true,
  labels: [],
  name: '',
  repo: {
    lastUpdate: '03/13/19',
    link: 'the-dark-of-the-matinée',
    version: '',
  },
  summary: '',
  version: '',
};

export const unoriginalViz = {
  _id: 'eminem-viz-id',
  authors: ['Eminem'],
  citations: [],
  compatibleData: [],
  isOriginal: true,
  labels: [],
  name: '',
  repo: {
    lastUpdate: '03/13/19',
    link: 'The Ringer',
    version: '',
  },
  summary: '',
  version: '',
};

export const testVisualizations: IVisualization[] = [originalViz, unoriginalViz];
