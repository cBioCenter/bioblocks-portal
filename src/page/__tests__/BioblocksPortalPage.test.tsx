import { ConnectedRouter } from 'connected-react-router';
import { mount, shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';

import { IVignette, IVisualization } from '~bioblocks-portal~/data';
import { BioblocksPortalPage, UnconnectedBioblocksPortalPage } from '~bioblocks-portal~/page';
import { configureStore } from '~bioblocks-portal~/reducer';
import { riseAgainstVignette, testVignettes, testVisualizations, unoriginalViz } from '~bioblocks-portal~/test';

describe('BioblocksPortalPage', () => {
  it('Should match existing snapshot when no props are provided.', () => {
    const wrapper = shallow(<UnconnectedBioblocksPortalPage />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when vignettes and visualizations are given.', () => {
    const vignettes: IVignette[] = [riseAgainstVignette];
    const visualizations: IVisualization[] = [unoriginalViz];

    const wrapper = shallow(<UnconnectedBioblocksPortalPage vignettes={vignettes} visualizations={visualizations} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should invoke dispatch functions upon creation.', async () => {
    const mocks = {
      dispatchVignettesFetchSpy: jest.fn(),
      dispatchVisualizationsFetchSpy: jest.fn(),
    };

    shallow(
      <UnconnectedBioblocksPortalPage
        dispatchVignettesFetch={mocks.dispatchVignettesFetchSpy}
        dispatchVisualizationsFetch={mocks.dispatchVisualizationsFetchSpy}
      />,
    );

    for (const spy of Object.values(mocks)) {
      expect(spy).toHaveBeenCalledTimes(1);
      // tslint:disable: no-unsafe-any
      expect(spy.mock.calls[0][1]).toBeInstanceOf(Function);
      await expect(spy.mock.calls[0][1]()).rejects.toBeDefined();
      // tslint:enable: no-unsafe-any
    }
  });

  it('Should match existing snapshot when hooked up to a Redux store.', () => {
    const store = configureStore();
    const wrapper = mount(
      <Provider store={store}>
        <UnconnectedBioblocksPortalPage vignettes={testVignettes} visualizations={testVisualizations} />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('Should update the page when navigating to a page', () => {
    [['/datasets'], ['/visualizations'], ['/visualizations/'], ['/dynamics'], ['/vignettes'], ['/']].forEach(
      ([page]) => {
        const store = configureStore();
        const history = createMemoryHistory();
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter keyLength={0}>
              <ConnectedRouter history={history}>
                <BioblocksPortalPage />
              </ConnectedRouter>
            </MemoryRouter>
          </Provider>,
        );

        history.push(page);
        wrapper.update();
        expect(wrapper.find(BioblocksPortalPage)).toMatchSnapshot();
      },
    );
  });
});
