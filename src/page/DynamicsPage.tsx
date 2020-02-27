// ~bioblocks-portal~
// Dynamics Page
// Page responsible for rendering one or more visualizations.
// ~bioblocks-portal~

import * as pako from 'pako';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Grid, Message } from 'semantic-ui-react';

import {
  AnatomogramContainer,
  EMPTY_FUNCTION,
  fetchDataset,
  fetchJSONFile,
  fetchMatrixData,
  ICategoricalAnnotation,
  SPECIES_TYPE,
  SpringContainer,
  TensorTContainer,
  UMAPTranscriptionalContainer,
} from 'bioblocks-viz';

import { IDataset, IVignette, IVisualization } from '~bioblocks-portal~/data';
import { IPortalReducerState } from '~bioblocks-portal~/reducer';
import { selectVignettes, selectVisualizations } from '~bioblocks-portal~/selector';

export interface IDynamicsPageProps {
  dataset: IDataset | null;
  pathname: string;
  search: string;
  vignettes: IVignette[];
  visualizations: IVisualization[];
  dispatchDatasetFetch(dataset: string, fetchFn: () => Promise<IDataset | null>): void;
}

export interface IDynamicsPageState {
  analysisId: string;
  datasetVisualizations: IVisualization[];
  datasetLocation: string;
  isFetching: boolean;
  scRNAseqCategorySelected: string;
  scRNAseqCategoricalData: ICategoricalAnnotation;
  scRNAseqMatrix: number[][];
}

export class UnconnectedDynamicsPage extends React.Component<IDynamicsPageProps, IDynamicsPageState> {
  public static defaultProps = {
    dataset: null as IDataset | null,
    dispatchDatasetFetch: EMPTY_FUNCTION,
    pathname: '',
    search: '',
    vignettes: new Array<IVignette>(),
    visualizations: new Array<IVisualization>(),
  };

  constructor(props: IDynamicsPageProps) {
    super(props);
    this.state = {
      analysisId: '',
      datasetLocation: 'hpc_sf2/full',
      datasetVisualizations: [],
      isFetching: false,
      scRNAseqCategoricalData: {},
      scRNAseqCategorySelected: 'Sample',
      scRNAseqMatrix: new Array(new Array<number>()),
    };
  }

  public componentDidMount() {
    const { search } = this.props;
    if (search.localeCompare('') !== 0) {
      this.setupSearchParameters(search);
    }
  }

  public async componentDidUpdate(prevProps: IDynamicsPageProps, prevState: IDynamicsPageState) {
    const { dataset, search, vignettes, visualizations } = this.props;
    const { datasetLocation, isFetching } = this.state;

    const isNewDataset =
      dataset !== null && JSON.stringify(dataset).localeCompare(JSON.stringify(prevProps.dataset)) !== 0;
    if (
      !isFetching &&
      ((search && search.localeCompare(prevProps.search) !== 0) ||
        prevState.isFetching === true ||
        isNewDataset ||
        vignettes !== prevProps.vignettes ||
        visualizations !== prevProps.visualizations)
    ) {
      this.setupSearchParameters(search);
      if (dataset && datasetLocation !== prevState.datasetLocation) {
        await this.fetchUMapData(dataset);
      }
    }

    if (!isFetching && dataset && isNewDataset) {
      await this.fetchUMapData(dataset);
    }
  }

  public render() {
    const { datasetVisualizations, datasetLocation, isFetching } = this.state;

    return (
      <div style={{ padding: '20px' }}>
        <Grid centered={true} stackable={true} stretched={false} padded={true} columns={2}>
          {isFetching ? (
            <Grid.Column>{'Loading...'}</Grid.Column>
          ) : datasetVisualizations.length >= 1 ? (
            datasetLocation.length >= 1 &&
            datasetVisualizations.map((visualization, index) => (
              <Grid.Column key={`dataset-visualization-${index}`} style={{ width: 'auto' }}>
                {this.renderVisualization(visualization, datasetLocation)}
              </Grid.Column>
            ))
          ) : (
            <Grid.Column>{'No visualizations!'}</Grid.Column>
          )}
        </Grid>
      </div>
    );
  }

  protected fetchUMapData = async (dataset: IDataset) => {
    this.setState({
      isFetching: true,
    });
    const { analysisId, datasetLocation } = this.state;
    let { scRNAseqCategoricalData, scRNAseqMatrix, scRNAseqCategorySelected } = this.state;

    const springAnalysis = dataset.analyses.find(anAnalysis => anAnalysis.processType === 'SPRING');
    if (springAnalysis) {
      const springLocation = `${process.env.API_URL}/datasets/${datasetLocation}/analyses/${analysisId}`;
      scRNAseqCategoricalData = (await fetchJSONFile(
        `${springLocation}/${dataset.name}/categorical_coloring_data.json`,
      )) as ICategoricalAnnotation;

      scRNAseqMatrix = await fetchMatrixData(`${springLocation}/${dataset.name}/pca.csv`);

      scRNAseqCategorySelected =
        Object.keys(scRNAseqCategoricalData).length >= 1
          ? Object.keys(scRNAseqCategoricalData)[0]
          : scRNAseqCategorySelected;
    }

    this.setState({
      isFetching: false,
      scRNAseqCategoricalData,
      scRNAseqCategorySelected,
      scRNAseqMatrix,
    });
  };

  protected setupSearchParameters(query: string) {
    const { dispatchDatasetFetch, visualizations } = this.props;

    let datasetLocation = this.state.datasetLocation;
    const datasetVisualizations = new Array<IVisualization>();
    const vignetteParams = new URLSearchParams(query);
    // tslint:disable-next-line:no-backbone-get-set-outside-model
    const datasetId = vignetteParams.get('id');

    datasetLocation = datasetId ? datasetId : datasetLocation;
    const vizIds = vignetteParams.getAll('viz');

    vizIds.forEach(vizId => {
      const viz = visualizations.find(aViz => vizId === aViz._id);
      if (viz) {
        datasetVisualizations.push(viz);
      }
    });

    // tslint:disable-next-line:no-backbone-get-set-outside-model
    const analysisId = vignetteParams.get('analysis');

    this.setState({
      analysisId: analysisId ? analysisId : '',
      datasetLocation,
      datasetVisualizations,
    });

    dispatchDatasetFetch('dataset', async () => {
      const datasetFetchResult = await fetch(`${process.env.API_URL}/dataset/${datasetId}?embedded={"analyses":1}`);
      if (datasetFetchResult.ok) {
        return (await datasetFetchResult.json()) as IDataset;
      } else {
        return null;
      }
    });
  }

  protected renderSpringVisualization(
    viz: IVisualization,
    isFullPage: boolean,
    datasetLocation: string,
    iconSrc: string,
  ) {
    const { analysisId } = this.state;
    const datasetName = this.props.dataset ? this.props.dataset.name : '';

    return (
      <SpringContainer
        datasetLocation={`datasets/${datasetLocation}/analyses/${analysisId}/${datasetName}`}
        datasetsURI={`${process.env.API_URL}/datasets`}
        isFullPage={isFullPage}
        springSrc={`${process.env.API_URL}/${viz.location}`}
        iconSrc={iconSrc}
      />
    );
  }

  protected renderUMAPVisualization() {
    const { scRNAseqCategoricalData, scRNAseqMatrix, scRNAseqCategorySelected } = this.state;

    // umap.js throws an error when trying to create a tree without any data.
    if (this.props.dataset && scRNAseqMatrix.length >= 1 && scRNAseqMatrix[0].length >= 1) {
      return (
        <UMAPTranscriptionalContainer
          categoricalAnnotations={scRNAseqCategoricalData}
          dataMatrix={scRNAseqMatrix}
          labelCategory={scRNAseqCategorySelected}
          numIterationsBeforeReRender={1}
          numSamplesToShow={scRNAseqMatrix.length}
          sampleNames={undefined}
        />
      );
    } else {
      return <Grid.Column>{'Loading...'}</Grid.Column>;
    }
  }

  protected renderVisualization(viz: IVisualization, datasetLocation: string) {
    const isFullPage = this.state.datasetVisualizations.length === 1;
    const iconSrc = `${process.env.API_URL}${viz.icon}`;
    const { analysisId } = this.state;

    switch (viz.name.toLocaleLowerCase()) {
      case 'spring':
        return this.renderSpringVisualization(viz, isFullPage, datasetLocation, iconSrc);
      case 'tfjs-tsne':
        return (
          <TensorTContainer
            datasetLocation={`${process.env.API_URL}/datasets/${datasetLocation}/analyses/${analysisId}`}
            iconSrc={iconSrc}
          />
        );
      case 'anatomogram':
        console.log(this.props.dataset);
        const species: SPECIES_TYPE =
          this.props.dataset && this.props.dataset.species ? this.props.dataset.species : 'homo_sapiens';

        return <AnatomogramContainer species={species} iconSrc={iconSrc} />;
      case 'umap':
        return this.renderUMAPVisualization();

      default:
        return <Message error={true}>{`Currently unsupported visualization '${viz}'`}</Message>;
    }
  }
}

const mapStateToProps = (state: IPortalReducerState) => ({
  dataset: state.dataset,
  pathname: state.router.location.pathname,
  search: state.router.location.search,
  vignettes: selectVignettes(state),
  visualizations: selectVisualizations(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      dispatchDatasetFetch: fetchDataset as (dataset: string, fetchFn: () => Promise<IDataset | null>) => void,
    },
    dispatch,
  );

export const DynamicsPage = connect(mapStateToProps, mapDispatchToProps)(UnconnectedDynamicsPage);
