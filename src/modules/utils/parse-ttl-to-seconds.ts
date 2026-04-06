type TtlUnit = 's' | 'm' | 'h' | 'd';

export function parseTtlToSeconds(value?: string): number {
  const defaultTtl: number = 7 * 24 * 60 * 60;

  if (!value) return defaultTtl;

  const multipliers: Record<TtlUnit, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
  };

  const match = value.match(/^(\d+)([smhd])$/);

  if (!match) return defaultTtl;

  const amount = Number(match[1]);
  const unit = match[2] as TtlUnit;

  return amount * multipliers[unit];
}
