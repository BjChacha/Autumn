import { readFile } from 'node:fs/promises';

export async function fetchData() {
  const file = await readFile('mock/text00.html');
  return file;
}
