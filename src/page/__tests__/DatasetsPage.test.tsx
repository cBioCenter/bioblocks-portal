import { ConnectedRouter } from 'connected-react-router';
import { mount, shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Header } from 'semantic-ui-react';

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

  it('Should sort datasets with analysis links before those without.', () => {
    const sampleDatasets: IDataset[] = [
      {
        _id: 'blend',
        analyses: [],
        authors: [],
        derivedFrom: [],
        matrixLocation: '',
        name: 'blend',
      },
      {
        _id: 'will',
        analyses: [
          {
            _id: 'yes',
            processType: 'SPRING',
          },
          {
            _id: 'no',
            processType: 'SPRING',
          },
        ],
        authors: [],
        derivedFrom: [],
        matrixLocation: '',
        name: 'will',
      },
      {
        _id: 'it',
        analyses: [
          {
            _id: 'maybe',
            processType: 'SPRING',
          },
        ],
        authors: [],
        derivedFrom: [],
        matrixLocation: '',
        name: 'it',
      },
    ];
    const wrapper = shallow(<UnconnectedDatasetsPage datasets={sampleDatasets} />);
    const headers = wrapper.find(Header);
    expect(
      headers
        .at(0)
        .childAt(0)
        .text(),
    ).toEqual('will');
    expect(
      headers
        .at(1)
        .childAt(0)
        .text(),
    ).toEqual('it');
    expect(
      headers
        .at(2)
        .childAt(0)
        .text(),
    ).toEqual('blend');
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
