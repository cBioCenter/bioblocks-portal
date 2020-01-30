import { RouterState } from 'connected-react-router';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Accordion, Button, Container, Divider, Grid, Header, Icon, List } from 'semantic-ui-react';

import { getFormattedAuthors, IVignette, IVisualization } from '~bioblocks-portal~/data';

export interface IVizOverviewPageProps extends Partial<RouteComponentProps> {
  vignettes: IVignette[];
  visualizations: IVisualization[];
}

export interface IVizOverviewPageState {
  currentViz: IVisualization | null;
}

export class UnconnectedVizOverviewPage extends React.Component<IVizOverviewPageProps, IVizOverviewPageState> {
  public static defaultProps = {
    vignettes: [],
    visualizations: [],
  };

  constructor(props: IVizOverviewPageProps) {
    super(props);
    this.state = {
      currentViz: null,
    };
  }

  public componentWillMount() {
    const { location, visualizations } = this.props;
    if (location) {
      const params = new URLSearchParams(location.search);
      // tslint:disable-next-line:no-backbone-get-set-outside-model
      const vizId = params.get('id');

      const currentViz = visualizations.find(viz => viz._id === vizId);
      this.setState({ currentViz: currentViz ? currentViz : null });
    }
  }

  public componentDidUpdate(prevProps: IVizOverviewPageProps, prevState: IVizOverviewPageState) {
    const { location, visualizations } = this.props;

    if (location && location !== prevProps.location) {
      const params = new URLSearchParams(location.search);
      // tslint:disable-next-line:no-backbone-get-set-outside-model
      const vizId = params.get('id');

      if (prevState.currentViz === null || prevState.currentViz._id !== vizId) {
        const currentViz = visualizations.find(viz => viz._id === vizId);
        this.setState({ currentViz: currentViz ? currentViz : null });
      }
    }
  }

  public render() {
    const { vignettes, visualizations } = this.props;
    const { currentViz } = this.state;

    const examples = new Array<IVignette>();

    for (const vignette of vignettes) {
      for (const vizId of vignette.visualizations) {
        if (visualizations.find(viz => viz._id === vizId) && !examples.includes(vignette)) {
          examples.push(vignette);
        }
      }
    }

    return (
      currentViz && (
        <Container>
          {this.renderOverview(currentViz)}
          {this.renderExamples(examples)}
        </Container>
      )
    );
  }

  protected renderCitations(viz: IVisualization) {
    return (
      <>
        citation(s):{' '}
        {viz.citations.map((citation, index) => (
          <React.Fragment key={`${viz.name.toLocaleLowerCase()}-citation-${index}`}>
            {citation.fullCitation} ({<a href={citation.link}>link</a>})
          </React.Fragment>
        ))}
      </>
    );
  }

  protected renderExamples(examples: IVignette[]) {
    const panels = [
      {
        content: {
          content: (
            <>
              <Divider />
              <Grid centered={true} columns={1} container={true} divided={'vertically'} style={{ padding: '10px 0' }}>
                {examples.map((example, index) => (
                  <Grid.Row columns={2} key={`viz-example-${index}`}>
                    {this.renderExampleEntry(example)}
                  </Grid.Row>
                ))}
              </Grid>
            </>
          ),
        },
        key: 'examples',
        title: 'example vignettes',
      },
      {
        content: 'Coming soon!',
        key: 'learn',
        title: 'learn',
      },
    ];

    return <Accordion panels={panels} defaultActiveIndex={0} />;
  }

  protected renderExampleEntry(example: IVignette) {
    return (
      <>
        <Grid.Column width={2}>
          <img
            src={`${process.env.API_URL}${example.icon}`}
            alt={`${example.name} icon`}
            style={{ height: '75px', width: '75px' }}
          />
        </Grid.Column>
        <Grid.Column textAlign={'left'} width={8}>
          <Header>{example.name}</Header>
          <p>{example.summary}</p>
        </Grid.Column>
        <Grid.Column floated={'right'}>
          <Button basic={true} icon={true} labelPosition={'right'}>
            {
              <Link to={`/dynamics?id=${example.dataset}${example.visualizations.map(viz => `&viz=${viz}`).join('')}`}>
                launch example
              </Link>
            }
            {/* Power Gap */}
            <Icon name={'external alternate'} />
          </Button>
        </Grid.Column>
      </>
    );
  }

  protected renderLink(viz: IVisualization) {
    return (
      <Grid.Column floated={'right'}>
        <Button basic={true} icon={true} labelPosition={'right'}>
          <Link to={{ pathname: '/dynamics', search: `?id=${viz.exampleDataset}&viz=${viz._id}` }}>
            {`launch ${viz.name}`}
          </Link>
          {/* Power Gap */}
          <Icon name={'external alternate'} />
        </Button>
      </Grid.Column>
    );
  }

  protected renderOverview(viz: IVisualization) {
    return (
      <Grid centered={true} columns={2}>
        <Grid.Column width={2}>
          <img
            alt={`icon for ${viz.name}`}
            src={`${process.env.API_URL}${viz.icon}`}
            style={{ height: '150px', padding: '20px' }}
          />
        </Grid.Column>
        <Grid.Column textAlign={'left'}>
          <Header as={'h1'}>
            {viz.name}
            <Header.Subheader>{getFormattedAuthors(viz)}</Header.Subheader>
          </Header>
          {this.renderSummary(viz)}
        </Grid.Column>
      </Grid>
    );
  }

  protected renderSummary(viz: IVisualization) {
    return (
      <>
        <p>{viz.summary}</p>
        <List>
          <List.Item>compatible with: {viz.compatibleData.join(', ')}</List.Item>
          <List.Item>{this.renderCitations(viz)}</List.Item>
          <List.Item>
            version: {viz.repo.version} (last updated {viz.repo.lastUpdate}),
            {<a href={viz.repo.link}> github link</a>}
          </List.Item>
          <List.Item>{this.renderLink(viz)}</List.Item>
        </List>
      </>
    );
  }
}

const mapStateToProps = (state: { router: RouterState }) => ({
  hash: state.router.location.hash,
  pathname: state.router.location.pathname,
  search: state.router.location.search,
});

export const VizOverviewPage = connect(mapStateToProps)(UnconnectedVizOverviewPage);
