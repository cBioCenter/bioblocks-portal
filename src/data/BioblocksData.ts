import { SPECIES_TYPE } from 'bioblocks-viz';

export type BIOBLOCKS_JOB_STATUS_TYPE = 'IN_PROGRESS' | 'ERROR' | 'COMPLETE';
export type BIOBLOCKS_PROCESS_TYPE = 'SPRING' | 'TSNE';

export interface IAnalysis {
  _id: string;
  parameters?: object;
  processType: BIOBLOCKS_PROCESS_TYPE;
}

export interface IMatrixInfo {
  colCount: number;
  rowCount: number;
}

export interface IDataset {
  _id: string;
  analyses: IAnalysis[];
  authors: string[];
  derivedFrom: IDataset[];
  matrixInfo?: IMatrixInfo;
  matrixLocation: string;
  name: string;
  species?: SPECIES_TYPE;
}

export interface IEveLink {
  href: string;
  title: string;
}

export interface IEveResponse<T> {
  _items: T[];
  _links: {
    parent: IEveLink;
    self: IEveLink;
  };
  _meta: {
    max_results: number;
    page: number;
    total: number;
  };
}

export interface IJob {
  _id: string;
  associatedDataset: {
    dataset: IDataset;
    etag: string;
  };
  status: BIOBLOCKS_JOB_STATUS_TYPE;
}

export interface IVignette {
  _id: string;
  authors: string[];
  dataset: string;
  icon: string;
  name: string;
  summary: string;
  visualizations: string[];
}

interface ICitation {
  fullCitation: string;
  link: string;
}

interface IRepo {
  lastUpdate: string;
  link: string;
  version: string;
}

export interface IVisualization {
  _id: string;
  authors: string[];
  citations: ICitation[];
  compatibleData: string[];
  exampleDataset: string;
  icon?: string;
  isOriginal: boolean;
  labels: string[];
  location?: string;
  name: string;
  repo: IRepo;
  summary: string;
  version: string;
}

/**
 * Formats list of authors.
 *
 * - 1 Author shows up as 'Author 1'.
 * - 2 Authors show up as 'Author 1 and Author 2'.
 * - 3 Authors or more show up as 'Author 1, Author 2, Author 3, ..., Author 4'
 */
export const getFormattedAuthors = (entry: IVignette | IVisualization) =>
  entry.authors.length === 2 ? `${entry.authors[0]} and ${entry.authors[1]}` : entry.authors.join(', ');
