import { selectDataset, selectDatasets, selectVignettes, selectVisualizations } from '~bioblocks-portal~/selector';

describe('Portal Selectors', () => {
  it('Should handle selecting a dataset from an empty state.', () => {
    const state = {};
    expect(selectDataset(state)).toEqual(null);
  });

  it('Should handle selecting a dataset from the state.', () => {
    const expected = {
      _id: 'wind-nocture',
      analyses: [],
      authors: ['Lizz Robibnett'],
      derivedFrom: [],
      matrixLocation: 'A shooting start',
      name: "Wind's Nocturne",
    };
    const state = {
      dataset: expected,
      datasets: [expected],
      vignettes: [],
      visualizations: [],
    };
    expect(selectDataset(state)).toEqual(expected);
  });

  it('Should handle getting all datasets from an empty state.', () => {
    const state = {};
    expect(selectDatasets(state)).toEqual([]);
  });

  it('Should handle getting all datasets from the state.', () => {
    const expected = {
      _id: 'wind-nocture',
      analyses: [],
      authors: ['Lizz Robibnett'],
      derivedFrom: [],
      matrixLocation: 'A shooting start',
      name: "Wind's Nocturne",
    };
    const state = {
      dataset: expected,
      datasets: [expected],
      vignettes: [],
      visualizations: [],
    };
    expect(selectDatasets(state)).toEqual([expected]);
  });

  it('Should handle getting all vignettes from an empty state.', () => {
    const state = {};
    expect(selectVignettes(state)).toEqual([]);
  });

  it('Should handle getting all vignettes from the state.', () => {
    const expected = {
      _id: 'down-the-road',
      authors: ['The Fratellis'],
      dataset: 'Eyes Wide, Tongue Tied',
      icon: 'Medusa-in-Chains.png',
      name: 'Down the Road... And Back Again...',
      summary: 'Good song that is a "bonus track" for certain releases of the 4th album.',
      visualizations: [],
    };
    const state = {
      dataset: null,
      datasets: [],
      vignettes: [expected],
      visualizations: [],
    };
    expect(selectVignettes(state)).toEqual([expected]);
  });

  it('Should handle getting all visualizations from an empty state.', () => {
    const state = {};
    expect(selectVisualizations(state)).toEqual([]);
  });

  it('Should handle getting all visualizations from the state.', () => {
    const expected = {
      _id: 'daddy-wont-pay-your-bill',
      authors: ['Jon Fratelli'],
      citations: [],
      compatibleData: [],
      exampleDataset: 'Psycho Jukebox',
      isOriginal: true,
      labels: [],
      name: "Daddy Won't Your Bill",
      repo: {
        lastUpdate: '',
        link: '',
        version: '',
      },
      summary: 'Song from the solo album of Jon Fratelli.',
      version: '',
    };
    const state = {
      dataset: null,
      datasets: [],
      vignettes: [],
      visualizations: [expected],
    };
    expect(selectVisualizations(state)).toEqual([expected]);
  });
});
