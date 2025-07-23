import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { IFilter } from './filter.interface';

export class DateFilter<T extends ObjectLiteral> implements IFilter<T> {
	private fromDate?: Date;
	private toDate?: Date;
	private fieldName: string;

	constructor(fieldName: string = 'createdAt') {
		this.fieldName = fieldName;
	}

	parse(query: Record<string, any>): void {
		if (query.fromDate) {
			this.fromDate = new Date(query.fromDate);
		}
		if (query.toDate) {
			this.toDate = new Date(query.toDate);
		}
	}

	apply(query: SelectQueryBuilder<T>): void {
		if (this.fromDate) {
			query.andWhere(`${query.alias}.${this.fieldName} >= :fromDate`, { 
			fromDate: this.fromDate 
			});
		}
		if (this.toDate) {
			query.andWhere(`${query.alias}.${this.fieldName} <= :toDate`, { 
			toDate: this.toDate 
			});
		}
	}

	toQueryString(): string {
		const params: string[] = [];
		if (this.fromDate) {
			params.push(`fromDate=${this.fromDate.toISOString()}`);
		}
		if (this.toDate) {
			params.push(`toDate=${this.toDate.toISOString()}`);
		}
		return params.join('&');
	}
}