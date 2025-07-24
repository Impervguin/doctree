import { SelectQueryBuilder, ObjectLiteral, EntityTarget } from 'typeorm';
import { IFilter } from './filter.interface';

export class TextFilter<T extends ObjectLiteral, DTO> implements IFilter<T> {
	private searchTerm?: string;
	private fieldName: keyof T;
	private queryParamName: keyof DTO;

	constructor(
		fieldName: keyof T,
		queryParamName: keyof DTO,
	) {
		this.fieldName = fieldName;
		this.queryParamName = queryParamName;
	}

	parse(query: Record<string, any>): void {
		const value = query[String(this.queryParamName)];
		this.searchTerm = typeof value === 'string' && value.trim() ? value.trim() : undefined;
	}

	apply(query: SelectQueryBuilder<T>): void {
		if (!this.searchTerm) return;

		query.andWhere(
			`${query.alias}.${String(this.fieldName)} LIKE LOWER('%${this.searchTerm}%')`,
		);
	}
}
