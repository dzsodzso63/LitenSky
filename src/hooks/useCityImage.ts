import { useQuery } from '@tanstack/react-query';

const fetchWikipediaThumbnail = async (city: string): Promise<string | null> => {
  try {
    const url = new URL('https://en.wikipedia.org/w/api.php');
    url.search = new URLSearchParams({
      action: 'query',
      titles: city,
      prop: 'pageimages',
      format: 'json',
      pithumbsize: '1600',
      origin: '*',
      redirects: '1',
    }).toString();

    const res = await fetch(url.toString());
    if (!res.ok) return null;

    const json: any = await res.json();
    const pages = json?.query?.pages;
    if (!pages) return null;

    const page = Object.values(pages)[0] as any;
    const thumb = page?.thumbnail?.source;
    return thumb ?? null;
  } catch {
    return null;
  }
};

const fetchWikidataImage = async (city: string): Promise<string | null> => {
  try {
    const url = new URL('https://www.wikidata.org/w/api.php');
    url.search = new URLSearchParams({
      action: 'wbgetentities',
      sites: 'enwiki',
      titles: city,
      props: 'claims',
      format: 'json',
      origin: '*',
      redirects: 'yes',
    }).toString();

    const res = await fetch(url.toString());
    if (!res.ok) return null;

    const json: any = await res.json();
    const entities = json?.entities;
    if (!entities) return null;

    const firstEntity = entities[Object.keys(entities)[0]];
    const p18 = firstEntity?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
    if (typeof p18 !== 'string') return null;

    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(p18)}?width=1600`;
  } catch {
    return null;
  }
};

export function useCityImage(city?: string | null) {
  return useQuery<string | null>({
    queryKey: ['cityImage', city?.trim().toLowerCase()],
    queryFn: async () => {
      const name = city?.trim();
      if (!name) return null;

      const wikipediaThumb = await fetchWikipediaThumbnail(name);
      if (wikipediaThumb) return wikipediaThumb;

      return await fetchWikidataImage(name);
    },
    enabled: Boolean(city && city.trim()),
    staleTime: Infinity,
  });
}
