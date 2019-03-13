import { EMPTY_FUNCTION, fetchDataset } from 'bioblocks-viz';
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { Container } from 'semantic-ui-react';

import { ConnectedRouter } from 'connected-react-router';
import { SiteHeader } from '~bioblocks-portal~/component';
import { IEveResponse, IVignette, IVisualization } from '~bioblocks-portal~/data';
import { DatasetPage, LandingPage, VignettesPage, VisualizationsPage, VizOverviewPage } from '~bioblocks-portal~/page';
import { history, IPortalReducerState } from '~bioblocks-portal~/reducer';
import { selectVignettes, selectVisualizations } from '~bioblocks-portal~/selector';

export interface IBioblocksPortalPageProps {
  vignettes: IVignette[];
  visualizations: IVisualization[];
  dispatchVignettesFetch(dataset: string, fetchFn: () => Promise<IVignette[]>): void;
  dispatchVisualizationsFetch(dataset: string, fetchFn: () => Promise<IVisualization[]>): void;
}

export class UnconnectedBioblocksPortalPage extends React.Component<IBioblocksPortalPageProps> {
  public static defaultProps = {
    dispatchVignettesFetch: EMPTY_FUNCTION,
    dispatchVisualizationsFetch: EMPTY_FUNCTION,
    vignettes: new Array<IVignette>(),
    visualizations: new Array<IVisualization>(),
  };

  constructor(props: IBioblocksPortalPageProps) {
    super(props);
  }

  public async componentDidMount() {
    const { dispatchVignettesFetch, dispatchVisualizationsFetch } = this.props;

    dispatchVignettesFetch('vignettes', async () => {
      const vignetteFetchResult = await fetch(`${process.env.API_URL}/vignette`);
      if (!vignetteFetchResult.ok) {
        return [];
      } else {
        const response = (await vignetteFetchResult.json()) as IEveResponse<IVignette>;

        return response._items.sort((a, b) => a.name.localeCompare(b.name));
      }
    });

    dispatchVisualizationsFetch('visualizations', async () => {
      const visualizationFetchResult = await fetch(`${process.env.API_URL}/visualization`);
      if (!visualizationFetchResult.ok) {
        return [];
      } else {
        const response = (await visualizationFetchResult.json()) as IEveResponse<IVisualization>;

        return response._items.sort((a, b) => a.name.localeCompare(b.name));
      }
    });
  }

  public render() {
    return (
      <ConnectedRouter history={history}>
        <Container id={'BioblocksPortalPage'} fluid={true}>
          <SiteHeader {...this.props} />

          <Switch>
            <Route exact={true} strict={true} path={'/visualizations'} render={this.renderVisualizationsPage} />
            <Route exact={true} strict={true} path={'/visualizations/'} render={this.renderOverviewPage} />
            <Route path={'/dataset'} render={this.renderDatasetPage} />
            <Route path={'/vignettes'} render={this.renderVignettesPage} />
            <Route exact={true} path={'/'} render={this.renderLandingPage} />
          </Switch>
        </Container>
      </ConnectedRouter>
    );
  }

  protected renderDatasetPage = () => {
    return <DatasetPage />;
  };

  protected renderLandingPage = (props: RouteComponentProps) => {
    const { vignettes, visualizations } = this.props;

    const featuredVignettes = new Array<IVignette>();
    if (vignettes) {
      const springVignette = vignettes.find(vignette => vignette._id === '12345678-1234-1234-1234-a1234567890b');
      const tabulaVignette = vignettes.find(vignette => vignette._id === '12345678-4321-1234-1234-a1234567890b');

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
      const tsneViz = visualizations.find(viz => viz.name === 'tfjs-tsne');

      if (springViz) {
        featuredVisualizations.push(springViz);
      }
      if (tsneViz) {
        featuredVisualizations.push(tsneViz);
      }
    }

    return (
      <LandingPage {...props} featuredVignettes={featuredVignettes} featuredVisualizations={featuredVisualizations} />
    );
  };

  protected renderOverviewPage = (props: RouteComponentProps) => {
    const { vignettes, visualizations } = this.props;

    return <VizOverviewPage {...props} vignettes={vignettes} visualizations={visualizations} />;
  };

  protected renderVignettesPage = (props: RouteComponentProps) => {
    const { vignettes } = this.props;

    return <VignettesPage {...props} vignettes={vignettes} />;
  };

  protected renderVisualizationsPage = (props: RouteComponentProps) => {
    const { visualizations } = this.props;

    return <VisualizationsPage {...props} visualizations={visualizations} />;
  };
}

const mapStateToProps = (state: IPortalReducerState) => ({
  vignettes: selectVignettes(state),
  visualizations: selectVisualizations(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      dispatchVignettesFetch: fetchDataset,
      dispatchVisualizationsFetch: fetchDataset,
    },
    dispatch,
  );

export const BioblocksPortalPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedBioblocksPortalPage);
