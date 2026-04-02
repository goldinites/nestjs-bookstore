export function parseTtlToSeconds(value: string | undefined): number {
  const defaultTtl: number = 7 * 24 * 60 * 60;

  if (!value) return defaultTtl;

  const match = value.match(/^(\d+)([smhd])$/);

  if (!match) return defaultTtl;

  const amount = Number(match[1]);
  const unit = match[2] as 's' | 'm' | 'h' | 'd';

  const multipliers = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
  } as const;

  return amount * multipliers[unit];
}
