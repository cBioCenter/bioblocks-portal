// ~bioblocks-portal~
// Site Header
// Nice little component to hold the header for the site.
// ~bioblocks-portal~

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, Header, Input, Menu } from 'semantic-ui-react';

import { IDataset, IVignette, IVisualization } from '~bioblocks-portal~/data';
import { IPortalReducerState } from '~bioblocks-portal~/reducer';
import { selectDataset, selectVignettes, selectVisualizations } from '~bioblocks-portal~/selector';

export interface ISiteHeaderProps {
  dataset: IDataset | null;
  pathname: string;
  search: string;
  vignettes: IVignette[];
  visualizations: IVisualization[];
}

export interface ISiteHeaderState {
  currentPageName: null | string;
  isModalOpen: boolean;
}

export class UnconnectedSiteHeader extends React.Component<ISiteHeaderProps, ISiteHeaderState> {
  public static defaultProps = {
    dataset: null,
    vignettes: new Array<IVignette>(),
    visualizations: new Array<IVisualization>(),
  };

  constructor(props: ISiteHeaderProps) {
    super(props);
    this.state = {
      currentPageName: null,
      isModalOpen: false,
    };
  }

  public componentDidMount() {
    window.addEventListener('click', this.onMouseClick);
    if (this.props.search) {
      this.handleQueryParams(this.props.search);
    }
  }

  public componentDidUpdate(prevProps: ISiteHeaderProps) {
    if (this.props.pathname && this.props.pathname !== prevProps.pathname) {
      this.handleQueryParams(this.props.search);
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('click', this.onMouseClick);
  }

  public render() {
    return (
      <Header>
        <Menu secondary={true} borderless={true} fluid={true} style={{ maxHeight: '40px', padding: '20px 0 0 0' }}>
          <Menu.Item fitted={'vertically'} position={'left'}>
            <Link to={'/'}>
              <img
                alt={'hca-dynamics-icon'}
                src={'assets/icons/bio-blocks-icon-2x.png'}
                style={{ height: '32px', width: '32px' }}
              />
              <span style={{ color: 'black', fontSize: '32px', fontWeight: 'bold' }}>HCA Dynamics</span>
            </Link>
          </Menu.Item>
          {this.renderNavMenu()}
          <Menu.Item position={'right'}>
            <Input icon={'search'} size={'massive'} transparent={true} />
          </Menu.Item>
        </Menu>
        {this.renderNavBreadcrumb()}
      </Header>
    );
  }

  protected renderNavBreadcrumb() {
    const { pathname } = this.props;

    return (
      <Breadcrumb style={{ padding: '0 0 0 40px' }}>
        <Breadcrumb.Section>
          <Link to={'/'}>home</Link>
        </Breadcrumb.Section>
        {pathname &&
          pathname
            .split('/')
            .filter(candidatePath => candidatePath.length >= 1)
            .map((path, index) => (
              <React.Fragment key={`breadcrumb-${index}`}>
                <Breadcrumb.Divider icon={'right angle'} />
                <Breadcrumb.Section>
                  <Link to={`/${path}`}>{path}</Link>
                </Breadcrumb.Section>
              </React.Fragment>
            ))}
        {this.state.currentPageName && (
          <>
            <Breadcrumb.Divider icon={'right angle'} />
            <Breadcrumb.Section>{this.state.currentPageName}</Breadcrumb.Section>
          </>
        )}
      </Breadcrumb>
    );
  }

  protected renderNavMenu = () => {
    return (
      <Menu defaultActiveIndex={-1} secondary={true}>
        <Menu.Item key={'datasets'}>
          <Link to={'/datasets'} style={{ color: 'black', fontSize: '18px' }}>
            datasets
          </Link>
        </Menu.Item>
        <Menu.Item key={'visualizations'}>
          <Link to={'/visualizations'} style={{ color: 'black', fontSize: '18px' }}>
            visualizations
          </Link>
        </Menu.Item>
        <Menu.Item key={'vignettes'}>
          <Link to={'/vignettes'} style={{ color: 'black', fontSize: '18px' }}>
            vignettes
          </Link>
        </Menu.Item>
      </Menu>
    );
  };

  protected handleQueryParams(search: string) {
    const { dataset, visualizations, vignettes } = this.props;
    const params = new URLSearchParams(search);
    const visualizationsInURL = params.getAll('viz');
    // tslint:disable-next-line:no-backbone-get-set-outside-model
    let currentPageName = params.get('id');

    if (dataset && currentPageName) {
      currentPageName = dataset.name;
    } else {
      const findResult = [...visualizations, ...vignettes].find(foo => foo._id === currentPageName);
      currentPageName = findResult ? findResult.name : currentPageName;
    }

    if (visualizationsInURL.length >= 1 && !name) {
      this.setState({
        currentPageName,
        isModalOpen: true,
      });
    } else {
      this.setState({
        currentPageName,
        isModalOpen: false,
      });
    }
  }

  protected onMouseClick = (e: MouseEvent) => {
    return;
  };
}

const mapStateToProps = (state: IPortalReducerState) => ({
  dataset: selectDataset(state),
  pathname: state.router.location.pathname,
  search: state.router.location.search,
  vignettes: selectVignettes(state),
  visualizations: selectVisualizations(state),
});

export const SiteHeader = connect(mapStateToProps)(UnconnectedSiteHeader);
