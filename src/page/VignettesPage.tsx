import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Grid, Header } from 'semantic-ui-react';

import { connect } from 'react-redux';
import { IVignette } from '~bioblocks-portal~/data';

export interface IVignettesPageProps extends Partial<RouteComponentProps> {
  vignettes: IVignette[];
}

export class VignettesPageClass extends React.Component<IVignettesPageProps, any> {
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
          <React.Fragment key={`vignette-${index}`}>{this.renderSingleFeaturedVignette(vignette)}</React.Fragment>
        ))}
      </Grid>
    );
  }

  protected renderSingleFeaturedVignette(vignette: IVignette) {
    return (
      <Grid.Row columns={3}>
        <Grid.Column>
          <img src={vignette.icon} style={{ height: '90px', width: '90px' }} alt={`vignette ${vignette.name} icon`} />
        </Grid.Column>
        <Grid.Column textAlign={'left'}>
          <Header>{vignette.name}</Header>
          <p>
            <span style={{ fontWeight: 'bold' }}>Description: </span>
            {vignette.summary}
          </p>
          <p>
            <span style={{ fontWeight: 'bold' }}>Analysis authors: </span>
            {vignette.authors.length === 2
              ? `${vignette.authors[0]} and ${vignette.authors[1]}`
              : vignette.authors.join(', ')}
          </p>
          <br />
        </Grid.Column>
        <Grid.Column>
          <Button basic={true}>
            <Link to={`/dataset?id=${vignette._id}`}>launch</Link>
          </Button>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export const UnconnectedVignettesPage = (props: IVignettesPageProps) => <VignettesPageClass {...props} />;

export const VignettesPage = connect(undefined)(UnconnectedVignettesPage);
