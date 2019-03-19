import { SPECIES_TYPE } from 'bioblocks-viz';

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

export interface IDataset {
  _id: string;
  authors: string[];
  name: string;
  species?: SPECIES_TYPE;
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
