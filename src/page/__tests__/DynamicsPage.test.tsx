import { mount, shallow } from 'enzyme';
import * as React from 'react';

import { ConnectedRouter } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { DynamicsPage, UnconnectedDynamicsPage } from '~bioblocks-portal~/page';
import { configureStore } from '~bioblocks-portal~/reducer';
import { originalViz, testVignettes, testVisualizations } from '~bioblocks-portal~/test';

describe('DynamicsPage', () => {
  const visualizations = ['anatomogram', 'spring', 'tfjs-tsne'];

  it('Should match existing snapshot when no props are provided.', () => {
    const wrapper = shallow(<DynamicsPage />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot for initial visualizations.', () => {
    visualizations.forEach(viz => {
      describe(`${viz}: `, () => {
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
        expect(wrapper.find(DynamicsPage)).toMatchSnapshot();
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
});
