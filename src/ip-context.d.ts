export interface IpContext {
  timezone?: string;
  latitude?: number;
  longitude?: number;
  country?: string;
}

export function parseIpContext(responseData: unknown): IpContext | null;

export function getDeviceLocationContext(
  navigatorObject?: Navigator,
): Promise<{ latitude: number; longitude: number } | null>;

export function createIpContextLoader(
  fetcher?: typeof fetch,
  timeoutMs?: number,
): () => Promise<IpContext | null>;

export const getIpContext: () => Promise<IpContext | null>;
