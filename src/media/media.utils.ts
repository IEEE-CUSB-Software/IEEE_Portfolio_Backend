export function resolveMediaFolder(envKey: string, fallback: string): string {
  const resolved = process.env[envKey]?.trim();

  return resolved && resolved.length > 0 ? resolved : fallback;
}
