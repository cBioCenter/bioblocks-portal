// ~bioblocks-portal~
// Vignettes Page
// Page to display information about vignettes from bioblocks-server.
// ~bioblocks-portal~

import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Grid, Header } from 'semantic-ui-react';

import { connect } from 'react-redux';
import { getFormattedAuthors, IVignette } from '~bioblocks-portal~/data';

export interface IVignettesPageProps extends Partial<RouteComponentProps> {
  vignettes: IVignette[];
}

export class UnconnectedVignettesPage extends React.Component<IVignettesPageProps, any> {
  public static defaultProps = {
    vignettes: [],
  };

  constructor(props: IVignettesPageProps) {
    super(props);
  }

  public render() {
    const { vignettes } = this.props;

    return (
      <Grid centered={true} padded={true} relaxed={true}>
        {vignettes.map((vignette, index) => (
          <React.Fragment key={`vignette-${index}`}>{this.renderSingleVignette(vignette)}</React.Fragment>
        ))}
      </Grid>
    );
  }

  protected renderSingleVignette(vignette: IVignette) {
    return (
      <Grid.Row columns={3}>
        <Grid.Column>
          <img
            src={`${process.env.API_URL}${vignette.icon}`}
            style={{ height: '90px', width: '90px' }}
            alt={`vignette ${vignette.name} icon`}
          />
        </Grid.Column>
        {this.renderVignetteSummary(vignette)}
        {this.renderVignetteLink(vignette)}
      </Grid.Row>
    );
  }

  protected renderVignetteLink(vignette: IVignette) {
    return (
      <Grid.Column>
        <Button basic={true}>
          <Link to={`/dynamics?id=${vignette.dataset}${vignette.visualizations.map(viz => `&viz=${viz}`).join('')}`}>
            launch
          </Link>
        </Button>
      </Grid.Column>
    );
  }

  protected renderVignetteSummary(vignette: IVignette) {
    return (
      <Grid.Column textAlign={'left'}>
        <Header>{vignette.name}</Header>
        <p>
          <span style={{ fontWeight: 'bold' }}>Description: </span>
          {vignette.summary}
        </p>
        <p>
          <span style={{ fontWeight: 'bold' }}>Analysis authors: </span>
          {getFormattedAuthors(vignette)}
        </p>
        <br />
      </Grid.Column>
    );
  }
}

export const VignettesPage = connect(undefined)(UnconnectedVignettesPage);
