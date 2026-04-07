export function ensureNonEmpty(
  value: string | undefined,
  name: string,
): string {
  if (!value || !value.trim()) {
    throw new Error(`${name} is required`);
  }

  return value;
}
