import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Button, Grid, Header, List } from "semantic-ui-react";

import { IVisualization } from "~bioblocks-portal~/data";

export interface IVisualizationsPageProps extends Partial<RouteComponentProps> {
  visualizations: IVisualization[];
}

export class VisualizationsPage extends React.Component<
  IVisualizationsPageProps,
  any
> {
  public static defaultProps = {
    visualizations: []
  };

  constructor(props: IVisualizationsPageProps) {
    super(props);
  }

  public render() {
    const { visualizations } = this.props;

    return (
      <List divided={true}>
        {visualizations.map((viz, index) => (
          <List.Item key={`viz-page-li-${index}`}>
            {this.renderVisualizationItem(viz)}
          </List.Item>
        ))}
      </List>
    );
  }

  protected renderVisualizationItem(viz: IVisualization) {
    return (
      <Grid centered={true} columns={3} padded={true} relaxed={true}>
        <Grid.Column>
          <img
            src={`${process.env.API_URL}${viz.icon}`}
            alt={`icon for ${viz.name}`}
            style={{ height: "100px" }}
          />
        </Grid.Column>
        <Grid.Column textAlign={"left"}>
          <Header as={"h2"}>{viz.name}</Header>
          <List>
            <List.Item>{`${
              viz.isOriginal ? "original: " : ""
            }${viz.authors.join(", ")}`}</List.Item>
            <List.Item>{viz.summary}</List.Item>
            <List.Item>{`relevant data: ${viz.compatibleData.join(
              ", "
            )}`}</List.Item>
          </List>
        </Grid.Column>
        <Grid.Column stretched={true}>
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
      </Grid>
    );
  }
}
