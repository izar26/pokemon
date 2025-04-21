import { getOrCreateDeviceId } from '@/utils/deviceId';

console.log("Pokémon fetched:", data)

export async function fetchWithDeviceId(url, options = {}) {
  const deviceId = getOrCreateDeviceId();
  const headers = {
    ...options.headers,
    'x-user-id': deviceId,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed: ${response.status}`);
  }

  return response.json();
}
