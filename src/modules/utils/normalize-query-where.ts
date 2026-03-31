import { FindOptionsWhere, In } from 'typeorm';

export function normalizeQueryWhere<T, K>(
  query: T,
  multiValueFields: string[],
): FindOptionsWhere<K> {
  const where = { ...query } as Record<string, unknown>;

  for (const field of multiValueFields) {
    const value: unknown = where[field];

    if (value === undefined) continue;

    const normalized: unknown[] = Array.isArray(value) ? value : [value];

    where[field] = In(normalized);
  }

  return where as FindOptionsWhere<K>;
}
