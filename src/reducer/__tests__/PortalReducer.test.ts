import { createHashHistory } from 'history';
import { PortalReducer } from '~bioblocks-portal~/reducer';

describe('PortalReducer', () => {
  it('Should handle an empty state.', () => {
    const history = createHashHistory();
    const expectedState = {
      dataset: null,
      router: {
        action: 'POP',
        location: {
          hash: '',
          pathname: '/',
          search: '',
          state: undefined,
        },
      },
      vignettes: [],
      visualizations: [],
    };
    const reducer = PortalReducer(history);
    const state = reducer(undefined, { type: '' });
    expect(reducer(state, { type: 'BIOBLOCKS/PORTAL_ACTION' })).toEqual(expectedState);
  });
});
