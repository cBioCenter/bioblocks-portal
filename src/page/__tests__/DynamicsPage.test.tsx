import { mount, shallow } from 'enzyme';
import * as React from 'react';

import { ConnectedRouter } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { DynamicsPage, UnconnectedDynamicsPage } from '~bioblocks-portal~/page';
import { configureStore } from '~bioblocks-portal~/reducer';
import { originalViz, testVignettes, testVisualizations } from '~bioblocks-portal~/test';

describe('DynamicsPage', () => {
  const visualizations = ['anatomogram', 'spring', 'tfjs-tsne', 'umap'];

  it('Should match existing snapshot when no props are provided.', () => {
    const wrapper = shallow(<UnconnectedDynamicsPage />);
    expect(wrapper).toMatchSnapshot();
  });

  // tslint:disable-next-line: mocha-no-side-effect-code
  visualizations.forEach(viz => {
    it(`Should match existing snapshot for initial visualization '${viz}'`, done => {
      const testVisualization = {
        ...originalViz,
        name: viz,
      };
      const wrapper = shallow(
        <UnconnectedDynamicsPage
          search={`/dynamics?id=psycho-jukebox-vignette-id&viz=${originalViz._id}`}
          vignettes={testVignettes}
          visualizations={[testVisualization]}
        />,
      );
      wrapper.setProps({
        dataset: {
          _id: 'sample-dataset-id',
          analyses: [],
          authors: [],
          derivedFrom: [],
          matrixLocation: 'the-church-of-rock-and-roll',
          name: 'sample-dataset',
        },
      });
      wrapper.instance().forceUpdate(() => {
        expect(wrapper).toMatchSnapshot();
        done();
      });
    });
  });

  it('Should match existing snapshot when hooked up to a Redux store.', () => {
    const store = configureStore();
    const history = createMemoryHistory();
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <DynamicsPage vignettes={testVignettes} visualizations={testVisualizations} />
        </ConnectedRouter>
      </Provider>,
    );
    history.push('/dynamics?id=psycho-jukebox-vignette-id');
    wrapper.update();
    expect(wrapper.find(DynamicsPage)).toMatchSnapshot();
  });

  it('Should match existing snapshot when given an analysis.', () => {
    const store = configureStore();
    const history = createMemoryHistory();
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <DynamicsPage vignettes={testVignettes} visualizations={testVisualizations} />
        </ConnectedRouter>
      </Provider>,
    );
    history.push('/dynamics?analysis=aaaaaaaa-0000-0000-0001-a1234567890b');
    wrapper.update();
    expect(wrapper.find(DynamicsPage)).toMatchSnapshot();
  });

  it('Should match existing snapshot when given an Anatomogram analysis.', () => {
    const store = configureStore();
    const history = createMemoryHistory();
    const wrapper = mount(
      <UnconnectedDynamicsPage
        dataset={{
          _id: 'sample-dataset-id',
          analyses: [],
          authors: [],
          derivedFrom: [],
          matrixLocation: 'the-church-of-rock-and-roll',
          name: 'sample-dataset',
          species: 'mus_musculus' as const,
        }}
        search={`/dynamics?id=psycho-jukebox-vignette-id&viz=${originalViz._id}`}
        vignettes={testVignettes}
        visualizations={[{ ...originalViz, name: 'anatomogram' }]}
      />,
    );
    expect(wrapper.find(DynamicsPage)).toMatchSnapshot();
  });
});
