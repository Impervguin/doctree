import { SelectQueryBuilder, ObjectLiteral, Like } from 'typeorm';
import { IFilter } from './filter.interface';

export class TextFilter<T extends ObjectLiteral> implements IFilter<T> {
  private searchTerm?: string;
  private fieldName: string;

  constructor(
    fieldName: string,
  ) {
    this.fieldName = fieldName;
  }

  parse(query: Record<string, string>): void {
    const paramName = `${this.fieldName}Search`;
    if (query[paramName]) {
      this.searchTerm = query[paramName];
    }
  }

  apply(query: SelectQueryBuilder<T>): void {
    if (!this.searchTerm) return;

    const paramName = `${this.fieldName}Param`;
    const alias = query.alias;

    query.andWhere(`LOWER(${alias}.${this.fieldName}) LIKE LOWER(:${paramName})`, {
        [paramName]: `%${this.searchTerm}%`
    });
  }

  toQueryString(): string {
    if (!this.searchTerm) return '';
    return `${this.fieldName}Search=${encodeURIComponent(this.searchTerm)}`;
  }
}