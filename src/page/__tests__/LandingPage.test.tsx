import { shallow } from 'enzyme';
import * as React from 'react';

import { IVignette, IVisualization } from '~bioblocks-portal~/data';
import { LandingPage } from '~bioblocks-portal~/page';

describe('LandingPage', () => {
  it('Should match existing snapshot when no props are provided.', () => {
    const wrapper = shallow(<LandingPage />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render featured vignettes correctly.', () => {
    const featuredVignettes: IVignette[] = [
      {
        _id: 'song-001',
        authors: ['The Strokes'],
        dataset: 'some-dataset',
        icon: 'some-icon',
        name: 'Someday',
        summary: 'A song',
        visualizations: ['some-viz'],
      },
      {
        _id: 'song-002',
        authors: ['Eminem', 'Dido'],
        dataset: 'some-dataset-2',
        icon: 'some-icon-2',
        name: 'Stan',
        summary: 'Dear Slim...',
        visualizations: ['some-viz-2'],
      },
    ];
    const wrapper = shallow(<LandingPage featuredVignettes={featuredVignettes} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render featured visualizations correctly.', () => {
    const featuredVisualizations: IVisualization[] = [
      {
        _id: 'some-viz-1',
        authors: ['The Offspring'],
        citations: [],
        compatibleData: [],
        exampleDataset: 'some-dataset',
        isOriginal: true,
        labels: [],
        name: 'Hit That',
        repo: { lastUpdate: 'yesterday', version: '0.0.1', link: 'some-repo-link' },
        summary: 'A song',
        version: '0.0.1',
      },
      {
        _id: 'some-viz-2',
        authors: ['Queen', 'David Bowie'],
        citations: [],
        compatibleData: [],
        exampleDataset: 'some-dataset-2',
        isOriginal: false,
        labels: [],
        name: 'Under Pressure',
        repo: { lastUpdate: 'yesterday', version: '0.0.2', link: 'some-repo-link-2' },
        summary: 'A song',
        version: '0.0.2',
      },
    ];
    const wrapper = shallow(<LandingPage featuredVisualizations={featuredVisualizations} />);
    expect(wrapper).toMatchSnapshot();
  });
});
