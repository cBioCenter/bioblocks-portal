import { EMPTY_FUNCTION, fetchDataset } from 'bioblocks-viz';
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { Container } from 'semantic-ui-react';

import { ConnectedRouter } from 'connected-react-router';
import { SiteHeader } from '~bioblocks-portal~/container';
import { IDataset, IEveResponse, IVignette, IVisualization } from '~bioblocks-portal~/data';
import {
  DatasetsPage,
  DynamicsPage,
  LandingPage,
  VignettesPage,
  VisualizationsPage,
  VizOverviewPage,
} from '~bioblocks-portal~/page';
import { history, IPortalReducerState } from '~bioblocks-portal~/reducer';
import { selectDatasets, selectVignettes, selectVisualizations } from '~bioblocks-portal~/selector';

export interface IBioblocksPortalPageProps {
  datasets: IDataset[];
  vignettes: IVignette[];
  visualizations: IVisualization[];
  dispatchDatasetsFetch(dataset: string, fetchFn: () => Promise<IDataset[]>): void;
  dispatchVignettesFetch(dataset: string, fetchFn: () => Promise<IVignette[]>): void;
  dispatchVisualizationsFetch(dataset: string, fetchFn: () => Promise<IVisualization[]>): void;
}

export class UnconnectedBioblocksPortalPage extends React.Component<IBioblocksPortalPageProps> {
  public static defaultProps = {
    datasets: new Array<IDataset>(),
    dispatchDatasetsFetch: EMPTY_FUNCTION,
    dispatchVignettesFetch: EMPTY_FUNCTION,
    dispatchVisualizationsFetch: EMPTY_FUNCTION,
    vignettes: new Array<IVignette>(),
    visualizations: new Array<IVisualization>(),
  };

  constructor(props: IBioblocksPortalPageProps) {
    super(props);
  }

  public async componentDidMount() {
    const { dispatchDatasetsFetch, dispatchVignettesFetch, dispatchVisualizationsFetch } = this.props;

    dispatchDatasetsFetch('datasets', this.onDatasetFetch);

    dispatchVignettesFetch('vignettes', this.onVignetteFetch);

    dispatchVisualizationsFetch('visualizations', this.onVisualizationFetch);
  }

  public render() {
    return (
      <ConnectedRouter history={history}>
        <Container id={'BioblocksPortalPage'} fluid={true}>
          <SiteHeader {...this.props} />

          <Switch>
            <Route exact={true} strict={true} path={'/datasets'} render={this.renderDatasetsPage} />
            <Route exact={true} strict={true} path={'/visualizations'} render={this.renderVisualizationsPage} />
            <Route exact={true} strict={true} path={'/visualizations/'} render={this.renderVizOverviewPage} />
            <Route path={'/dynamics'} render={this.renderDynamicsPage} />
            <Route path={'/vignettes'} render={this.renderVignettesPage} />
            <Route exact={true} path={'/'} render={this.renderLandingPage} />
          </Switch>
        </Container>
      </ConnectedRouter>
    );
  }

  protected onDatasetFetch = async () => {
    const datasetFetchResult = await fetch(`${process.env.API_URL}/dataset?embedded={"analyses": 1}`);
    if (!datasetFetchResult.ok) {
      return [];
    } else {
      const response = (await datasetFetchResult.json()) as IEveResponse<IDataset>;

      return response._items.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  protected onVignetteFetch = async () => {
    const vignetteFetchResult = await fetch(`${process.env.API_URL}/vignette`);
    if (!vignetteFetchResult.ok) {
      return [];
    } else {
      const response = (await vignetteFetchResult.json()) as IEveResponse<IVignette>;

      return response._items.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  protected onVisualizationFetch = async () => {
    const visualizationFetchResult = await fetch(`${process.env.API_URL}/visualization`);
    if (!visualizationFetchResult.ok) {
      return [];
    } else {
      const response = (await visualizationFetchResult.json()) as IEveResponse<IVisualization>;

      return response._items.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  protected renderDynamicsPage = () => {
    return <DynamicsPage />;
  };

  protected renderLandingPage = (props: RouteComponentProps) => {
    const { vignettes, visualizations } = this.props;

    const featuredVignettes = new Array<IVignette>();
    if (vignettes) {
      const tabulaVignette = vignettes.find(vignette => vignette._id === 'bbdecade-0000-0000-0001-a1234567890b');
      const springVignette = vignettes.find(vignette => vignette._id === 'bbdecade-0000-0000-0002-a1234567890b');

      if (springVignette) {
        featuredVignettes.push(springVignette);
      }
      if (tabulaVignette) {
        featuredVignettes.push(tabulaVignette);
      }
    }

    const featuredVisualizations = new Array<IVisualization>();
    if (visualizations) {
      const springViz = visualizations.find(viz => viz.name === 'SPRING');
      const umapViz = visualizations.find(viz => viz.name === 'UMAP');

      if (springViz) {
        featuredVisualizations.push(springViz);
      }
      if (umapViz) {
        featuredVisualizations.push(umapViz);
      }
    }

    return (
      <LandingPage {...props} featuredVignettes={featuredVignettes} featuredVisualizations={featuredVisualizations} />
    );
  };

  protected renderDatasetsPage = (props: RouteComponentProps) => {
    const { datasets, visualizations } = this.props;

    return <DatasetsPage datasets={datasets} visualizations={visualizations} {...props} />;
  };

  protected renderVignettesPage = (props: RouteComponentProps) => {
    const { vignettes } = this.props;

    return <VignettesPage {...props} vignettes={vignettes} />;
  };

  protected renderVisualizationsPage = (props: RouteComponentProps) => {
    const { visualizations } = this.props;

    return <VisualizationsPage {...props} visualizations={visualizations} />;
  };

  protected renderVizOverviewPage = (props: RouteComponentProps) => {
    const { vignettes, visualizations } = this.props;

    return <VizOverviewPage {...props} vignettes={vignettes} visualizations={visualizations} />;
  };
}

const mapStateToProps = (state: IPortalReducerState) => ({
  datasets: selectDatasets(state),
  vignettes: selectVignettes(state),
  visualizations: selectVisualizations(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      dispatchDatasetsFetch: fetchDataset,
      dispatchVignettesFetch: fetchDataset,
      dispatchVisualizationsFetch: fetchDataset,
    },
    dispatch,
  );

export const BioblocksPortalPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedBioblocksPortalPage);
