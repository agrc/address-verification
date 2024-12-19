import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@ugrc/utah-design-system';
import ky from 'ky';
import config from '../config';
import type { Location } from '../shared.types';
import CopyToClipboard from './CopyToClipboard';

type Value = null | string | number;
type Attributes = {
  [key: string]: Value;
};
type SearchResponse = {
  result: {
    attributes: Attributes;
  }[];
  status: number;
  message?: string;
};

async function makeRequest(location: Location, table: string, field: string): Promise<Value | null> {
  const responseJson = await ky<SearchResponse>(`${config.searchApiUrl}/${table}/${field}`, {
    searchParams: new URLSearchParams({
      geometry: `point:${JSON.stringify(location)}`,
      apiKey: import.meta.env.VITE_WEB_API,
    }),
  }).json();

  if (responseJson.status !== 200) {
    throw new Error(`Search API request failed. Status: ${responseJson.status} - ${responseJson.message}`);
  }

  if (!responseJson.result || responseJson.result.length === 0) {
    return null;
  }

  return responseJson.result[0]?.attributes[field] ?? null;
}

type SearchApiQueryProps = {
  label: string;
  location: Location;
  table: string;
  field: string;
};
export default function SearchApiQuery({ label, location, table, field }: SearchApiQueryProps) {
  const results = useQuery({
    queryKey: ['search', location, table, field],
    queryFn: () => makeRequest(location, table, field),
  });

  return (
    <div>
      <h6>{label}</h6>
      {results.isLoading ? <Spinner /> : <CopyToClipboard text={results?.data?.toString() ?? 'no data'} />}
    </div>
  );
}
