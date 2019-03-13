import { shallow } from 'enzyme';
import * as React from 'react';

import { UnconnectedVizOverviewPage } from '~bioblocks-portal~/page';
import { testVignettes, testVisualizations } from '~bioblocks-portal~/test';

describe('VizOverviewPage', () => {
  it('Should match existing snapshot when given no vignettes or visualizations.', () => {
    const wrapper = shallow(<UnconnectedVizOverviewPage />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given sample vignettes and visualizations.', () => {
    const wrapper = shallow(
      <UnconnectedVizOverviewPage vignettes={testVignettes} visualizations={testVisualizations} />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when chenging the visualization via routing', () => {
    const wrapper = shallow(
      <UnconnectedVizOverviewPage
        location={{ search: 'id=eminem-viz-id', pathname: '', hash: '', state: '' }}
        vignettes={testVignettes}
        visualizations={testVisualizations}
      />,
    );
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({
      location: { search: 'id=franz-ferdinand-viz-id', pathname: '', hash: '', state: '' },
    });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });
});
