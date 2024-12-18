export type CandidateProps = {
  addressGrid: string;
  locator: string;
  matchAddress: string;
  score: number;
  standardizedAddress: string;
  location: {
    x: number;
    y: number;
    spatialReference: {
      wkid: number;
    };
  };
};

export default function Candidate(props: CandidateProps) {
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
}
