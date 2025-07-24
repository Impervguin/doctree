import { IFilter } from './filter.interface';
import { SelectQueryBuilder, ObjectLiteral, getMetadataArgsStorage, EntityTarget } from 'typeorm';

export class TextOneToManyFilter<T extends ObjectLiteral, R extends ObjectLiteral, DTO> implements IFilter<T> {
    private searchTerm?: string;
	private queryParamName: keyof DTO;
    private relationField: keyof R;
    private aliasCounter = 0;
    private relationName: string;

    constructor(
        relationField: keyof R,
        queryParamName: keyof DTO,
        private rootJoinField: keyof T,
        private relationJoinField: keyof R,
        relation: EntityTarget<R>
    ) {
        this.relationField = relationField;
        this.queryParamName = queryParamName;
        if (typeof relation === 'function') {
            this.relationName = relation.name;
        } else {
            this.relationName = String(relation);
        }
    }

    parse(query: Record<string, any>): void {
        const value = query[String(this.queryParamName)];
        this.searchTerm = typeof value === 'string' && value.trim() ? value.trim() : undefined;
    }

    apply(query: SelectQueryBuilder<T>): void {
        if (!this.searchTerm) return;

        const currAlias = `${this.relationName}_${this.aliasCounter++}`;

        query.leftJoin(this.relationName, currAlias, `${currAlias}.${String(this.relationJoinField)} = ${query.alias}.${String(this.rootJoinField)}`);

        query.andWhere(`${currAlias}.${String(this.relationField)} LIKE LOWER('%${this.searchTerm}%')`);
    }
}
