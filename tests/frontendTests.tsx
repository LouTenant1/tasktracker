class SimpleCache {
  private cache: Record<string, any> = {};

  getData(key: string): any {
    return this.cache[key];
  }

  setData(key: string, data: any): void {
    this.cache[key] = data;
  }

  hasData(key: string): boolean {
    return key in this.cache;
  }
}

const apiCache = new Simple,Cache();

async function fetchData(url: string): Promise<any> {
  if (apiCache.hasData(url)) {
    return Promise.resolve(apiCache.getData(url));
  }

  const response = await fetch(url);
  const data = await response.json();
  apiCache.setData(url, data);
  return data;
}