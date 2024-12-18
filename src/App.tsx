import { useQuery } from '@tanstack/react-query';
import { Footer, Header, TextField, UgrcLogo, useFirebaseAnalytics, useFirebaseApp } from '@ugrc/utah-design-system';
import { useDebounce } from '@uidotdev/usehooks';
import ky from 'ky';
import { useEffect, useState } from 'react';
import Candidate, { type CandidateProps } from './components/Candidate';
import config from './config';

// const apiKey = import.meta.env.VITE_WEB_API;
const version = import.meta.env.PACKAGE_VERSION;

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

// esriConfig.assetsPath = './assets';
const links = [
  {
    key: 'UGRC Homepage',
    action: { url: 'https://gis.utah.gov' },
  },
  {
    key: 'GitHub Repository',
    action: { url: 'https://github.com/agrc/address-verification' },
  },
  {
    key: `Version ${version} changelog`,
    action: { url: `https://github.com/agrc/address-verification/releases/v${version}` },
  },
];

type MasqueradeResponse = {
  candidates: {
    address: string;
    attributes: {
      Status: string;
      addressGrid: string;
      locator: string;
      matchAddress: string;
      score: number;
      standardizedAddress: string;
    };
    location: {
      x: number;
      y: number;
    };
    score: number;
  }[];
  spatialReference: {
    wkid: number;
    latestWkid: number;
  };
  status: number;
  error?: {
    code: number;
    message: string;
  };
};

async function search(address: string): Promise<CandidateProps[]> {
  const responseJson = await ky<MasqueradeResponse>(config.masqueradeUrl, {
    searchParams: new URLSearchParams({
      SingleLine: address.trim(),
      f: 'json',
      outFields: '*',
      maxLocations: '5',
    }),
  }).json();

  if (responseJson.error) {
    throw new Error(responseJson.error.message);
  }

  return responseJson.candidates.map((candidate) => ({
    addressGrid: candidate.attributes.addressGrid,
    locator: candidate.attributes.locator,
    matchAddress: candidate.attributes.matchAddress,
    score: candidate.attributes.score,
    standardizedAddress: candidate.attributes.standardizedAddress,
    location: {
      x: candidate.location.x,
      y: candidate.location.y,
      spatialReference: {
        wkid: responseJson.spatialReference.wkid,
      },
    },
  }));
}

export default function App() {
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 1000);
  const app = useFirebaseApp();
  const logEvent = useFirebaseAnalytics();

  useEffect(() => {
    async function initPerformance() {
      const { getPerformance } = await import('firebase/performance');

      return getPerformance(app);
    }
    initPerformance();
  }, [app]);

  useEffect(() => {
    if (debouncedSearchValue?.length) {
      logEvent('search', { searchValue: debouncedSearchValue });
    }
  }, [debouncedSearchValue, logEvent]);

  const {
    data: candidates,
    error,
    isLoading,
  } = useQuery<CandidateProps[]>({
    queryKey: ['address', debouncedSearchValue],
    queryFn: () => search(debouncedSearchValue),
  });

  return (
    <>
      <Header links={links}>
        <div className="flex h-full grow items-center gap-3">
          <UgrcLogo />
          <h2 className="font-heading text-3xl font-black text-zinc-600 sm:text-5xl dark:text-zinc-100">
            Utah Address Verification
          </h2>
        </div>
      </Header>
      <main>
        <div className="m-20">
          <span>
            Enter a street address and a city or zip code. E.g. "123 South Main Street, 84115" or "123 S Main St, Salt
            Lake City"
          </span>
          <TextField
            aria-label="enter street address"
            inputMode="search"
            type="search"
            value={searchValue}
            onChange={setSearchValue}
          />
          {isLoading && <div>Loading...</div>}
          {error && <ErrorFallback error={error} />}
          {candidates && candidates.length > 0 && candidates.map((props, i) => <Candidate key={i} {...props} />)}
        </div>
      </main>
      <Footer />
    </>
  );
}
