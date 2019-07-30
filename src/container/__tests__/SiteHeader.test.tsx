import { shallow } from 'enzyme';
import * as React from 'react';

import { UnconnectedSiteHeader } from '~bioblocks-portal~/container';

describe('SiteHeader', () => {
  it('Should match existing snapshot when giving required props.', () => {
    const wrapper = shallow(<UnconnectedSiteHeader pathname={''} search={''} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when changing the visualization via routing', () => {
    const wrapper = shallow(<UnconnectedSiteHeader pathname={''} search={'id=eminem-viz-id'} />);
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({
      pathname: '/datasets',
      search: 'id=psycho-jukebox-vignette-id&viz=franz-ferdinand-viz-id',
    });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });
});
