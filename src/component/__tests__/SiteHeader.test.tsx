import { shallow } from 'enzyme';
import * as React from 'react';

import { SiteHeader } from '~bioblocks-portal~/component';

describe('SiteHeader', () => {
  it('Should match existing snapshot.', () => {
    const wrapper = shallow(<SiteHeader />);
    expect(wrapper).toMatchSnapshot();
  });
});
