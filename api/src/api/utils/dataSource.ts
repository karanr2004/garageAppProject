import { DataSource } from 'typeorm';

let dataSource: DataSource | undefined;

export function setDataSource(ds: DataSource): void {
  dataSource = ds;
}

export function getDataSource(): DataSource {
  if (!dataSource) {
    throw new Error('DataSource has not been initialized');
  }
  return dataSource;
}
