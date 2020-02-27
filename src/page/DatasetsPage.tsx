// ~bioblocks-portal~
// Datasets Page
// Page for displaying datasets available on bioblocks-server.
// ~bioblocks-portal~

import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, Divider, Grid, Header } from 'semantic-ui-react';

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
        result += '&viz=bbfacade-0000-0000-0004-a1234567890b';
      } else if (analysis.processType === 'TSNE') {
        // result += '&viz=bbfacade-0000-0000-0003-a1234567890b';
      } else if (analysis.processType === 'UMAP') {
        result += '&viz=bbfacade-0000-0000-0004-a1234567890b';
      } else {
        console.log(`Process ${analysis._id} has unhandled process of type '${analysis.processType}'.`);
      }
    }

    return result;
  };

  protected renderSingleDatasetEntry(dataset: IDataset) {
    return (
      <>
        <Grid.Row columns={3}>{this.renderSingleDatasetEntryHeader(dataset)}</Grid.Row>
        <Divider section={true} />
      </>
    );
  }

  protected renderDatasetAnalysisLink(analysis: IAnalysis, datasetId: string) {
    const linkTo = `/dynamics?id=${datasetId}&analysis=${analysis._id}${this.getValidVizIds([analysis])}`;

    return (
      <Button basic={true} key={`launch-button-for-${analysis._id}`}>
        <Link to={linkTo}>{`Launch '${analysis.name}'`}</Link>
      </Button>
    );
  }

  protected renderSingleDatasetEntryHeader(dataset: IDataset) {
    return (
      <Grid.Column textAlign={'left'}>
        <Header>{dataset.name}</Header>

        <Grid.Row>{dataset.analyses.map(analysis => this.renderDatasetAnalysisLink(analysis, dataset._id))}</Grid.Row>
      </Grid.Column>
    );
  }
}

export const DatasetsPage = connect(undefined)(UnconnectedDatasetsPage);
