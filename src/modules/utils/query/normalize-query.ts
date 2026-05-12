import { FindOptionsWhere, ILike } from 'typeorm';
import { normalizeQueryIn } from '@/modules/utils/query/normalize-query-in';
import { normalizeQueryBetween } from '@/modules/utils/query/normalize-query-between';
import { Book } from '@/modules/book/entities/book.entity';

type NormalizeQueryOptions = {
  multiFields?: string[];
  rangeFields?: string[];
  searchFieldsValue?: string[];
};

type NormalizeQueryArgs<T> = {
  query: T;
  searchQuery?: string;
  options?: NormalizeQueryOptions;
};

export function normalizeQuery<T, K>(
  args: NormalizeQueryArgs<T>,
): FindOptionsWhere<K> | FindOptionsWhere<K>[] | undefined {
  const { query, options } = args;
  let { searchQuery } = args;

  let where = { ...query } as Record<string, unknown>;

  if (!options) return;

  if (options.multiFields?.length) {
    where = normalizeQueryIn(where, options.multiFields);
  }

  if (options.rangeFields?.length) {
    where = normalizeQueryBetween(where, options.rangeFields);
  }

  if (options.searchFieldsValue?.length) {
    searchQuery = searchQuery?.trim();

    if (!searchQuery) return where as FindOptionsWhere<K>;

    const searchWhere: FindOptionsWhere<Book>[] = [];

    for (const field of options.searchFieldsValue) {
      searchWhere.push({ ...where, [field]: ILike(`%${searchQuery}%`) });
    }

    return searchWhere as FindOptionsWhere<K>[];
  }

  return where as FindOptionsWhere<K>;
}
