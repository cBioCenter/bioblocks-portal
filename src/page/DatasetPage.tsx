import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Grid, Message } from 'semantic-ui-react';

import {
  AnatomogramContainer,
  EMPTY_FUNCTION,
  ISpringGraphData,
  SPECIES_TYPE,
  SpringContainer,
  TensorTContainer,
} from 'bioblocks-viz';
import { RouterState } from 'connected-react-router';
import { connect } from 'react-redux';
import { IVignette, IVisualization } from '~bioblocks-portal~/data';

export interface IDatasetPageProps extends Partial<RouteComponentProps> {
  dispatchSpringFetch(fetchFn: () => Promise<ISpringGraphData>, namespace?: string): void;
  setSpecies(species: SPECIES_TYPE): void;
}

export interface IDatasetPageState {
  vignette?: IVignette;
  visualizations: IVisualization[];
  datasetLocation: string;
}

export class DatasetPage extends React.Component<IDatasetPageProps, IDatasetPageState> {
  public static defaultProps = {
    dispatchSpringFetch: () => {
      return;
    },
    setSpecies: () => {
      return;
    },
  };

  constructor(props: IDatasetPageProps) {
    super(props);
    this.state = {
      datasetLocation: 'hpc_sf2/full',
      visualizations: [],
    };
  }

  public async componentDidMount() {
    const { location, setSpecies } = this.props;
    const { datasetLocation } = this.state;
    if (location) {
      await this.setupSearchParameters(location.search);
    }
    setSpecies(datasetLocation.includes('hpc') ? 'homo_sapiens' : 'mus_musculus');
  }

  public async componentDidUpdate(prevProps: IDatasetPageProps, prevState: IDatasetPageState) {
    console.log(prevProps);
    console.log(this.props);
    const { location, setSpecies } = this.props;
    const { datasetLocation } = this.state;
    if (location && location !== prevProps.location) {
      await this.setupSearchParameters(location.search);
    }
    setSpecies(datasetLocation.includes('hpc') ? 'homo_sapiens' : 'mus_musculus');
  }

  public render() {
    const { visualizations, datasetLocation } = this.state;
    console.log(visualizations);

    return (
      <div style={{ padding: '20px' }}>
        <Grid centered={true} stackable={true} stretched={false} padded={true} columns={2}>
          {datasetLocation.length >= 1 &&
            visualizations.map((visualization, index) => (
              <Grid.Column key={`dataset-visualization-${index}`} style={{ width: 'auto' }}>
                {this.renderVisualization(visualization, datasetLocation)}
              </Grid.Column>
            ))}
        </Grid>
      </div>
    );
  }

  protected async setupSearchParameters(query: string) {
    const params = new URLSearchParams(query);
    // tslint:disable-next-line:no-backbone-get-set-outside-model
    const vignetteLocation = params.get('id');

    const fetchResult = await fetch(`http://localhost:8080/vignette/${vignetteLocation}`);
    if (!fetchResult.ok) {
      console.log(`Error fetching vignette ${vignetteLocation}`);
    } else {
      const vignette = (await fetchResult.json()) as IVignette;
      const visualizations = await Promise.all(
        vignette.visualizations.map(async vizId => {
          const vizResponse = await fetch(`http://localhost:8080/visualization/${vizId}`);

          return (await vizResponse.json()) as IVisualization;
        }),
      );

      this.setState({
        vignette,
        visualizations,
      });
    }
  }

  protected renderVisualization(viz: IVisualization, datasetLocation: string) {
    const isFullPage = this.state.visualizations.length === 1;
    switch (viz.name.toLocaleLowerCase()) {
      case 'spring':
        return <SpringContainer datasetLocation={datasetLocation} isFullPage={isFullPage} />;
      case 'tfjs-tsne':
        return (
          <TensorTContainer
            datasetLocation={datasetLocation}
            isFullPage={isFullPage}
            setCurrentCells={EMPTY_FUNCTION}
          />
        );
      case 'anatomogram':
        return <AnatomogramContainer species={'homo_sapiens'} />;
      default:
        return <Message error={true}>{`Currently unsupported visualization '${viz}'`}</Message>;
    }
  }
}

const mapStateToProps = (state: { router: RouterState }) => ({
  hash: state.router.location.hash,
  pathname: state.router.location.pathname,
  search: state.router.location.search,
});

export const ConnectedDatasetPage = connect(mapStateToProps)(DatasetPage);
