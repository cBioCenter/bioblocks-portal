import { IVignette, IVisualization } from '~bioblocks-portal~/data';

export const riseAgainstVignette = {
  _id: 'bbdecade-0000-0000-0001-a1234567890b',
  authors: [],
  dataset: '',
  icon: '',
  name: '',
  summary: 'Rise Against Viz',
  visualizations: ['bbfacade-0000-0000-0001-a1234567890b'],
};

export const jukeboxVignette = {
  _id: 'bbdecade-0000-0000-0002-a1234567890b',
  authors: [],
  dataset: '',
  icon: '',
  name: '',
  summary: 'Psycho Jukebox Vignette',
  visualizations: ['bbfacade-0000-0000-0002-a1234567890b'],
};

export const testVignettes: IVignette[] = [riseAgainstVignette];

export const originalViz = {
  _id: 'bbfacade-0000-0000-0001-a1234567890b',
  authors: ['Franz Ferdinand'],
  citations: [{ fullCitation: 'A full citation', link: 'A link' }],
  compatibleData: [],
  exampleDataset: 'bbdeeded-0000-0000-0001-a1234567890b',
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
  _id: 'bbfacade-0000-0000-0002-a1234567890b',
  authors: ['Eminem'],
  citations: [{ fullCitation: 'A full citation', link: 'A link' }],
  compatibleData: [],
  exampleDataset: 'bbdeeded-0000-0000-0002-a1234567890b',
  isOriginal: false,
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
