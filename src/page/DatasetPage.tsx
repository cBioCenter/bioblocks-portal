import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { Grid, Message } from "semantic-ui-react";

import {
  AnatomogramContainer,
  EMPTY_FUNCTION,
  fetchDataset,
  SpringContainer,
  TensorTContainer
} from "bioblocks-viz";
import { IDataset, IVignette, IVisualization } from "~bioblocks-portal~/data";
import { IPortalReducerState } from "~bioblocks-portal~/reducer";
import {
  selectVignettes,
  selectVisualizations
} from "~bioblocks-portal~/selector";

export interface IDatasetPageProps {
  dataset: IDataset | null;
  pathname: string;
  search: string;
  vignettes: IVignette[];
  visualizations: IVisualization[];
  dispatchDatasetFetch(
    dataset: string,
    fetchFn: () => Promise<IDataset | null>
  ): void;
}

export interface IDatasetPageState {
  datasetVisualizations: IVisualization[];
  datasetLocation: string;
}

export class UnconnectedDatasetPage extends React.Component<
  IDatasetPageProps,
  IDatasetPageState
> {
  public static defaultProps = {
    dataset: null,
    dispatchDatasetFetch: EMPTY_FUNCTION,
    pathname: "",
    search: "",
    vignettes: new Array<IVignette>(),
    visualizations: new Array<IVisualization>()
  };

  constructor(props: IDatasetPageProps) {
    super(props);
    this.state = {
      datasetLocation: "hpc_sf2/full",
      datasetVisualizations: []
    };
  }

  public componentDidMount() {
    const { search } = this.props;
    if (search) {
      this.setupSearchParameters(search);
    }
  }

  public componentDidUpdate(prevProps: IDatasetPageProps) {
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
      <div style={{ padding: "20px" }}>
        <Grid
          centered={true}
          stackable={true}
          stretched={false}
          padded={true}
          columns={2}
        >
          {datasetLocation.length >= 1 &&
            datasetVisualizations.map((visualization, index) => (
              <Grid.Column
                key={`dataset-visualization-${index}`}
                style={{ width: "auto" }}
              >
                {this.renderVisualization(visualization, datasetLocation)}
              </Grid.Column>
            ))}
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
      const datasetId = vignetteParams.get("id");

      datasetLocation = datasetId ? datasetId : datasetLocation;
      const vizIds = vignetteParams.getAll("viz");
      vizIds.forEach(vizId => {
        const viz = visualizations.find(aViz => vizId === aViz._id);
        if (viz) {
          datasetVisualizations.push(viz);
        }
      });
      dispatchDatasetFetch("dataset", async () => {
        const datasetFetchResult = await fetch(
          `${process.env.API_URL}/dataset/${datasetId}`
        );
        if (!datasetFetchResult.ok) {
          return null;
        } else {
          return (await datasetFetchResult.json()) as IDataset;
        }
      });
      this.setState({
        datasetLocation,
        datasetVisualizations
      });
    }
  }

  protected renderVisualization(viz: IVisualization, datasetLocation: string) {
    const isFullPage = this.state.datasetVisualizations.length === 1;
    const iconSrc = `${process.env.API_URL}${viz.icon}`;
    switch (viz.name.toLocaleLowerCase()) {
      case "spring":
        return (
          <SpringContainer
            datasetLocation={datasetLocation}
            datasetsURI={`${process.env.API_URL}/datasets`}
            isFullPage={isFullPage}
            springSrc={`${process.env.API_URL}/${viz.location}`}
            iconSrc={iconSrc}
          />
        );
      case "tfjs-tsne":
        return (
          <TensorTContainer
            datasetLocation={`${
              process.env.API_URL
            }/datasets/${datasetLocation}`}
            iconSrc={iconSrc}
          />
        );
      case "anatomogram":
        return (
          <AnatomogramContainer species={"homo_sapiens"} iconSrc={iconSrc} />
        );
      default:
        return (
          <Message
            error={true}
          >{`Currently unsupported visualization '${viz}'`}</Message>
        );
    }
  }
}

const mapStateToProps = (state: IPortalReducerState) => ({
  dataset: state.dataset,
  pathname: state.router.location.pathname,
  search: state.router.location.search,
  vignettes: selectVignettes(state),
  visualizations: selectVisualizations(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      dispatchDatasetFetch: fetchDataset as ((
        dataset: string,
        fetchFn: () => Promise<IDataset | null>
      ) => void)
    },
    dispatch
  );

export const DatasetPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedDatasetPage);
