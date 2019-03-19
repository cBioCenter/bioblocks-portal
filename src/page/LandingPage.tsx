import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Segment
} from "semantic-ui-react";

import { IVignette, IVisualization } from "~bioblocks-portal~/data";

export interface ILandingPageProps extends Partial<RouteComponentProps> {
  featuredVignettes: IVignette[];
  featuredVisualizations: IVisualization[];
}

export class LandingPage extends React.Component<ILandingPageProps, any> {
  public static defaultProps = {
    featuredVignettes: [],
    featuredVisualizations: []
  };

  constructor(props: ILandingPageProps) {
    super(props);
  }

  public render() {
    return (
      <Container fluid={false}>
        <Segment basic={true} padded={"very"}>
          <Grid centered={true} padded={true} relaxed={true}>
            {this.renderFeaturedVignettes()}
            {this.renderFeaturedVisualizations()}
            {this.renderFeaturedDatasets()}
          </Grid>
        </Segment>
      </Container>
    );
  }

  protected renderSingleVisualization(viz: IVisualization) {
    return (
      <Grid.Row columns={3}>
        <Grid.Column width={2}>
          <img
            src={`${process.env.API_URL}${viz.icon}`}
            style={{ height: "90px", width: "90px" }}
            alt={`viz ${viz.name} icon`}
          />
        </Grid.Column>
        <Grid.Column textAlign={"left"} width={8}>
          <Header>{viz.name}</Header>
          {viz.summary}
          <p>
            <span style={{ fontWeight: "bold" }}>
              {viz.isOriginal ? "Original authors" : "Authors"}:{" "}
            </span>
            {viz.authors.length === 2
              ? `${viz.authors[0]} and ${viz.authors[1]}`
              : viz.authors.join(", ")}
          </p>
          <br />
        </Grid.Column>
        <Grid.Column width={2}>
          <Grid.Row>
            <Button basic={true}>
              <Link
                to={{ pathname: "/visualizations/", search: `?id=${viz._id}` }}
              >
                details
              </Link>
            </Button>
          </Grid.Row>
          <Grid.Row>
            <Button basic={true}>
              <Link
                to={{
                  pathname: "/dataset",
                  search: `?id=${viz.exampleDataset}&viz=${viz._id}`
                }}
              >
                launch
              </Link>
            </Button>
          </Grid.Row>
        </Grid.Column>
      </Grid.Row>
    );
  }

  protected renderFeaturedDatasets() {
    return (
      <>
        <Grid.Row centered={true}>
          <Grid.Column width={12}>
            <Header floated={"left"}>Featured Datasets</Header>
            <Divider section={true} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2} divided={true}>
          {this.renderHCADatasets()}
          {this.renderUserSharedDatasets()}
        </Grid.Row>
      </>
    );
  }

  protected renderFeaturedVignettes() {
    const { featuredVignettes } = this.props;

    return (
      <>
        <Grid.Row centered={false}>
          <Grid.Column width={12}>
            <Header floated={"left"}>Featured Vignettes</Header>
            <Divider section={true} />
          </Grid.Column>
        </Grid.Row>
        {featuredVignettes[0] &&
          this.renderSingleFeaturedVignette(featuredVignettes[0])}
        {featuredVignettes[1] &&
          this.renderSingleFeaturedVignette(featuredVignettes[1])}
        <Grid.Row centered={false}>
          <Grid.Column width={12}>
            <Link style={{ color: "blue", float: "right" }} to={"vignettes"}>
              more vignettes...
            </Link>
          </Grid.Column>
        </Grid.Row>
      </>
    );
  }

  protected renderFeaturedVisualizations() {
    const { featuredVisualizations } = this.props;

    return (
      <>
        <Grid.Row centered={false}>
          <Grid.Column width={12}>
            <Header floated={"left"}>Featured Visualizations</Header>
            <Divider section={true} />
          </Grid.Column>
        </Grid.Row>
        {featuredVisualizations[0] &&
          this.renderSingleVisualization(featuredVisualizations[0])}
        {featuredVisualizations[1] &&
          this.renderSingleVisualization(featuredVisualizations[1])}
        <Grid.Row centered={false}>
          <Grid.Column width={12}>
            <Link
              style={{ color: "blue", float: "right" }}
              to={"visualizations"}
            >
              more visualizations...
            </Link>
          </Grid.Column>
        </Grid.Row>
      </>
    );
  }

  protected renderSingleFeaturedVignette(vignette: IVignette) {
    return (
      <Grid.Row columns={3}>
        <Grid.Column width={2}>
          <img
            src={`${process.env.API_URL}${vignette.icon}`}
            style={{ height: "90px", width: "90px" }}
            alt={`vignettes ${vignette.name} icon`}
          />
        </Grid.Column>
        <Grid.Column textAlign={"left"} width={8}>
          <Header>{vignette.name}</Header>
          <p>
            <span style={{ fontWeight: "bold" }}>Description: </span>
            {vignette.summary}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Analysis authors: </span>
            {vignette.authors.length === 2
              ? `${vignette.authors[0]} and ${vignette.authors[1]}`
              : vignette.authors.join(", ")}
          </p>
          <br />
        </Grid.Column>
        <Grid.Column width={2}>
          <Button basic={true}>
            <Link
              to={`/dataset?id=${vignette.dataset}${vignette.visualizations
                .map(viz => `&viz=${viz}`)
                .join("")}`}
            >
              launch
            </Link>
          </Button>
        </Grid.Column>
      </Grid.Row>
    );
  }

  protected renderHCADatasets() {
    return (
      <Grid.Column width={3}>
        <Grid.Row>
          <img
            src={"assets/icons/hca-logo.png"}
            style={{ width: "150px", height: "250px" }}
            alt={"human cell atlas logo"}
          />
          <Grid.Row>
            <a href={"https://preview.data.humancellatlas.org/"}>
              Search HCA datasets ...
            </a>
          </Grid.Row>
        </Grid.Row>
      </Grid.Column>
    );
  }

  /*
  protected renderSingleUserSharedDatasets(dataset: IDatasetInfo) {
    return (
      <Grid.Row columns={2}>
        <Grid.Column floated={'left'}>
          <Header>{dataset.name}</Header>
          <p>
            {dataset.summary}
            <br />
            <span style={{ fontWeight: 'bold' }}>Authors: </span>
            {dataset.authors.join(', ')}
          </p>
        </Grid.Column>
        <Grid.Column floated={'right'}>
          <Button basic={true} floated={'right'}>
            <Link to={dataset.links.detail}>details</Link>
          </Button>
          <Button basic={true} floated={'right'}>
            <Link to={dataset.links.analysis}>analyze</Link>
          </Button>
        </Grid.Column>
      </Grid.Row>
    );
  }
  */

  protected renderUserSharedDatasets() {
    return (
      <Grid.Column stretched={true} textAlign={"left"} width={8}>
        <Grid.Row textAlign={"center"}>
          <Header as={"h2"} textAlign={"center"}>
            User shared
          </Header>
        </Grid.Row>
        <br />
        <Grid.Row textAlign={"center"}>
          <Header as={"h3"} textAlign={"center"}>
            Coming soon!
          </Header>
        </Grid.Row>
      </Grid.Column>
    );
  }
}
