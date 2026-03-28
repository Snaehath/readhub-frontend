export class FetchError extends Error {
  info: Record<string, unknown>;
  status: number;

  constructor(message: string, info: Record<string, unknown>, status: number) {
    super(message);
    this.name = "FetchError";
    this.info = info;
    this.status = status;
  }
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const info = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    throw new FetchError(
      "An error occurred while fetching the data.",
      info,
      res.status
    );
  }

  return res.json();
};
