import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, Grid, Header } from 'semantic-ui-react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { IAnalysis, IDataset, IVisualization } from '~bioblocks-portal~/data';

export interface IDatasetsPageProps extends Partial<RouteComponentProps> {
  datasets: IDataset[];
  visualizations: IVisualization[];
}

export class UnconnectedDatasetsPage extends React.Component<IDatasetsPageProps, any> {
  public static defaultProps = {
    datasets: [],
    visualizations: [],
  };

  constructor(props: IDatasetsPageProps) {
    super(props);
  }

  public render() {
    const { datasets } = this.props;

    return (
      <Grid centered={true} padded={true} relaxed={true}>
        {datasets
          .sort((a, b) => b.analyses.length - a.analyses.length)
          .map((dataset, index) => (
            <React.Fragment key={`vignette-${index}`}>{this.renderSingleDatasetEntry(dataset)}</React.Fragment>
          ))}
      </Grid>
    );
  }

  protected getValidVizIds = (analyses: IAnalysis[]) => {
    let result = '';

    for (const analysis of analyses) {
      if (analysis.processType === 'SPRING') {
        result += '&viz=bbfacade-0000-0000-0001-a1234567890b';
      } else if (analysis.processType === 'TSNE') {
        result += '&viz=bbfacade-0000-0000-0003-a1234567890b';
      } else {
        console.log(`Process ${analysis._id} has unhandled process of type '${analysis.processType}'.`);
      }
    }

    return result;
  };

  protected renderSingleDatasetEntry(dataset: IDataset) {
    return (
      <Grid.Row columns={3}>
        {this.renderSingleDatasetEntryHeader(dataset)}
        {this.renderSingleDatasetEntryContent(dataset)}
      </Grid.Row>
    );
  }

  protected renderSingleDatasetEntryContent(dataset: IDataset) {
    return (
      <Grid.Column>
        {dataset.analyses.length >= 1 && (
          <Button basic={true}>
            <Link to={`/dynamics?id=${dataset._id}${this.getValidVizIds(dataset.analyses)}`}>launch</Link>
          </Button>
        )}
      </Grid.Column>
    );
  }

  protected renderSingleDatasetEntryHeader(dataset: IDataset) {
    return (
      <Grid.Column textAlign={'left'}>
        <Header>{dataset.name}</Header>
        <p>
          <span style={{ fontWeight: 'bold' }}>{`Analyses: ${dataset.analyses.length}`}</span>
        </p>
        <p>
          <span style={{ fontWeight: 'bold' }}>
            {'Derived from: '}
            {dataset.derivedFrom.length >= 1 ? (
              <Link to={`/dynamics?id=${dataset.derivedFrom[0]}`}>{dataset.derivedFrom[0]}</Link>
            ) : (
              'Nothing'
            )}
          </span>
        </p>
        <br />
      </Grid.Column>
    );
  }
}

export const DatasetsPage = connect(undefined)(UnconnectedDatasetsPage);
