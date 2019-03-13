import { shallow } from 'enzyme';
import * as React from 'react';

import { UnconnectedVignettesPage } from '~bioblocks-portal~/page';
import { testVignettes } from '~bioblocks-portal~/test';

describe('VignettesPage', () => {
  it('Should match existing snapshot when given no vignettes.', () => {
    const wrapper = shallow(<UnconnectedVignettesPage />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given sample vignettes.', () => {
    const wrapper = shallow(<UnconnectedVignettesPage vignettes={testVignettes} />);
    expect(wrapper).toMatchSnapshot();
  });
});
