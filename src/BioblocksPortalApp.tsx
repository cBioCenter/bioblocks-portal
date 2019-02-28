import { RootState } from 'bioblocks-viz';
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { SiteHeader } from '~bioblocks-portal~/component';
import { IEveResponse, IVignette } from '~bioblocks-portal~/data';
import { DatasetPage, LandingPage, VignettesPage, VisualizationsPage, VizOverviewPage } from '~bioblocks-portal~/page';

export interface IBioblocksPortalAppProps extends Partial<RouteComponentProps> {
  visualizations: any[];
}

export interface IBioblocksPortalAppState {
  vignettes: IVignette[];
}

export class BioblocksPortalApp extends React.Component<IBioblocksPortalAppProps, IBioblocksPortalAppState> {
  constructor(props: IBioblocksPortalAppProps) {
    super(props);
    this.state = {
      vignettes: [],
    };
  }

  public async componentDidMount() {
    const fetchResult = await fetch('http://localhost:8080/vignette');
    if (!fetchResult.ok) {
      console.log('Error fetching vignettes');
    } else {
      const response = (await fetchResult.json()) as IEveResponse<IVignette>;
      this.setState({
        vignettes: response._items,
      });
    }
  }

  public render() {
    return <Route render={this.renderComponents} />;
  }

  protected renderComponents = (props: RouteComponentProps) => (
    <Container id={'BioblocksVizApp'} fluid={true}>
      <SiteHeader {...props} />
      <Route exact={true} strict={true} path={'/visualizations'} render={this.renderVisualizationsPage} />
      <Route exact={true} strict={true} path={'/visualizations/'} render={this.renderOverviewPage} />
      <Route path={'/dataset'} render={this.renderDatasetPage} />
      <Route path={'/vignettes'} render={this.renderVignettesPage} />
      <Route exact={true} path={'/'} render={this.renderLandingPage} />
    </Container>
  );

  protected renderDatasetPage = (props: RouteComponentProps) => {
    return <DatasetPage {...props} />;
  };

  protected renderLandingPage = (props: RouteComponentProps) => {
    return <LandingPage {...props} />;
  };

  protected renderOverviewPage = (props: RouteComponentProps) => {
    return <VizOverviewPage {...props} />;
  };

  protected renderVignettesPage = (props: RouteComponentProps) => {
    return <VignettesPage {...props} vignettes={this.state.vignettes} />;
  };

  protected renderVisualizationsPage = (props: RouteComponentProps) => {
    return <VisualizationsPage {...props} />;
  };
}

const mapStateToProps = (state: RootState) => ({
  visualizations: state.visualizations,
});

export const ConnectedBioblocksPortalApp = connect(mapStateToProps)(BioblocksPortalApp);
