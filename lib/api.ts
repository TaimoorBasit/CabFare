import { apiConfig } from './config';

export async function fetchHello() {
  const res = await fetch(`${apiConfig.baseUrl}/api/hello`);
  if (!res.ok) {
    throw new Error('Failed to fetch hello API');
  }
  return res.json();
}
