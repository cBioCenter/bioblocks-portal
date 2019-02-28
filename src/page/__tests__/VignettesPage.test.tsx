import { shallow } from 'enzyme';
import * as React from 'react';

import { VignettesPage } from '~bioblocks-portal~/page';

describe('VignettesPage', () => {
  it('Should match existing snapshot.', () => {
    const wrapper = shallow(<VignettesPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
