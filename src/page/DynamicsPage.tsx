import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Grid, Message } from 'semantic-ui-react';

import {
  AnatomogramContainer,
  EMPTY_FUNCTION,
  fetchDataset,
  SPECIES_TYPE,
  SpringContainer,
  TensorTContainer,
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
  datasetVisualizations: IVisualization[];
  datasetLocation: string;
}

export class UnconnectedDynamicsPage extends React.Component<IDynamicsPageProps, IDynamicsPageState> {
  public static defaultProps = {
    dataset: null,
    dispatchDatasetFetch: EMPTY_FUNCTION,
    pathname: '',
    search: '',
    vignettes: new Array<IVignette>(),
    visualizations: new Array<IVisualization>(),
  };

  constructor(props: IDynamicsPageProps) {
    super(props);
    this.state = {
      datasetLocation: 'hpc_sf2/full',
      datasetVisualizations: [],
    };
  }

  public componentDidMount() {
    const { search } = this.props;
    if (search) {
      this.setupSearchParameters(search);
    }
  }

  public componentDidUpdate(prevProps: IDynamicsPageProps) {
    const { search, vignettes, visualizations } = this.props;
    if (
      (search && search !== prevProps.search) ||
      vignettes !== prevProps.vignettes ||
      visualizations !== prevProps.visualizations
    ) {
      this.setupSearchParameters(search);
    }
  }

  public render() {
    const { datasetVisualizations, datasetLocation } = this.state;

    return (
      <div style={{ padding: '20px' }}>
        <Grid centered={true} stackable={true} stretched={false} padded={true} columns={2}>
          {datasetVisualizations.length >= 1 ? (
            datasetLocation.length >= 1 &&
            datasetVisualizations.map((visualization, index) => (
              <Grid.Column key={`dataset-visualization-${index}`} style={{ width: 'auto' }}>
                {this.renderVisualization(visualization, datasetLocation)}
              </Grid.Column>
            ))
          ) : (
            <Grid.Column>No visualizations!</Grid.Column>
          )}
        </Grid>
      </div>
    );
  }

  protected setupSearchParameters(query: string) {
    const { dispatchDatasetFetch, vignettes, visualizations } = this.props;

    let datasetLocation = this.state.datasetLocation;
    const datasetVisualizations = new Array<IVisualization>();
    if (vignettes) {
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
      dispatchDatasetFetch('dataset', async () => {
        const datasetFetchResult = await fetch(`${process.env.API_URL}/dataset/${datasetId}?embedded={"analyses":1}`);
        if (!datasetFetchResult.ok) {
          return null;
        } else {
          return (await datasetFetchResult.json()) as IDataset;
        }
      });
      this.setState({
        datasetLocation,
        datasetVisualizations,
      });
    }
  }

  protected renderVisualization(viz: IVisualization, datasetLocation: string) {
    const isFullPage = this.state.datasetVisualizations.length === 1;
    const iconSrc = `${process.env.API_URL}${viz.icon}`;
    let analysisLocation = '';
    switch (viz.name.toLocaleLowerCase()) {
      case 'spring':
        if (this.props.dataset) {
          const analsyis = this.props.dataset.analyses.find(anAnalsyis => anAnalsyis.processType === 'SPRING');
          if (analsyis) {
            analysisLocation = analsyis._id;
          }
        }

        const datasetName = this.props.dataset ? this.props.dataset.name : '';

        return (
          <SpringContainer
            datasetLocation={`${datasetLocation}/analyses/${analysisLocation}/${datasetName}`}
            datasetsURI={`${process.env.API_URL}/datasets`}
            isFullPage={isFullPage}
            springSrc={`${process.env.API_URL}/${viz.location}`}
            iconSrc={iconSrc}
          />
        );
      case 'tfjs-tsne':
        if (this.props.dataset) {
          const tsneAnalysis = this.props.dataset.analyses.find(analsyis => analsyis.processType === 'TSNE');
          if (tsneAnalysis) {
            analysisLocation = tsneAnalysis._id;
          }
        }

        return (
          <TensorTContainer
            datasetLocation={`${process.env.API_URL}/datasets/${datasetLocation}/analyses/${analysisLocation}`}
            iconSrc={iconSrc}
          />
        );
      case 'anatomogram':
        const species: SPECIES_TYPE =
          this.props.dataset && this.props.dataset.species === 'mus_musculus' ? 'mus_musculus' : 'homo_sapiens';

        return <AnatomogramContainer species={species} iconSrc={iconSrc} />;
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
      dispatchDatasetFetch: fetchDataset as ((dataset: string, fetchFn: () => Promise<IDataset | null>) => void),
    },
    dispatch,
  );

export const DynamicsPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedDynamicsPage);