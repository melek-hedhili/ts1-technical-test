// Extract filename from file path
export function extractFilename(path: string): string {
  return path.split('/').pop() || 'Unknown File';
}
