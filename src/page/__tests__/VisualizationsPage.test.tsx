import { shallow } from 'enzyme';
import * as React from 'react';

import { VisualizationsPage } from '~bioblocks-portal~/page';
import { testVisualizations } from '~bioblocks-portal~/test';

describe('AppsPage', () => {
  it('Should match existing snapshot when given no visualizations.', () => {
    const wrapper = shallow(<VisualizationsPage />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given sample visualizations.', () => {
    const wrapper = shallow(<VisualizationsPage visualizations={testVisualizations} />);
    expect(wrapper).toMatchSnapshot();
  });
});
