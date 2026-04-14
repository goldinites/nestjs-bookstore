import { FindOptionsWhere } from 'typeorm';
import { normalizeQueryIn } from '@/modules/utils/query/normalize-query-in';
import { normalizeQueryBetween } from '@/modules/utils/query/normalize-query-between';

type NormalizeQueryOptions = {
  multiFields?: string[];
  rangeFields?: string[];
};

export function normalizeQuery<T, K>(
  query: T,
  options: NormalizeQueryOptions,
): FindOptionsWhere<K> {
  let where = { ...query } as Record<string, unknown>;

  if (options.multiFields?.length) {
    where = normalizeQueryIn(where, options.multiFields);
  }

  if (options.rangeFields?.length) {
    where = normalizeQueryBetween(where, options.rangeFields);
  }

  return where as FindOptionsWhere<K>;
}
