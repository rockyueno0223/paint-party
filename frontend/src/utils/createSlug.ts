export const createSlug = (input: string): string => {
  return input
    .trim()
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
}
