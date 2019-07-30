import { mount, shallow } from 'enzyme';
import * as React from 'react';

import { ConnectedRouter } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { IDataset } from '~bioblocks-portal~/data';
import { DatasetsPage, UnconnectedDatasetsPage } from '~bioblocks-portal~/page';
import { configureStore } from '~bioblocks-portal~/reducer';

describe('DatasetsPage', () => {
  it('Should match existing snapshot when no props are provided.', () => {
    const wrapper = shallow(<UnconnectedDatasetsPage />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given a dataset.', () => {
    const sampleDatasets: IDataset[] = [
      {
        _id: 'some-kind-of-musical-reference',
        analyses: [],
        authors: [],
        derivedFrom: [],
        matrixLocation: '',
        name: '',
      },
    ];
    const wrapper = shallow(<UnconnectedDatasetsPage datasets={sampleDatasets} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render dynamics links correctly.', () => {
    const sampleDatasets: IDataset[] = [
      {
        _id: 'some-kind-of-musical-reference',
        analyses: [
          {
            _id: 'down-the-road...',
            processType: 'SPRING',
          },
          {
            _id: 'and-back-again...',
            processType: 'TSNE',
          },
        ],
        authors: [],
        derivedFrom: [],
        matrixLocation: '',
        name: '',
      },
    ];
    const wrapper = shallow(<UnconnectedDatasetsPage datasets={sampleDatasets} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when hooked up to a Redux store.', () => {
    const store = configureStore();
    const history = createMemoryHistory();
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <DatasetsPage />
        </ConnectedRouter>
      </Provider>,
    );
    history.push('/dynamics?id=psycho-jukebox-vignette-id');
    wrapper.update();
    expect(wrapper.find(DatasetsPage)).toMatchSnapshot();
  });
});
