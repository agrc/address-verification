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
  return (
    <>
      <div className="mb-4 w-full rounded-md border border-slate-300 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <h4>Match Address</h4>
          <span>score: {props.score}</span>
        </div>
        <p>{props.matchAddress}</p>
        <div>
          <h6>Locator</h6>
          <span>{props.locator}</span>
        </div>
        <div>
          <h6>Coordinates ({props.location.spatialReference.wkid})</h6>
          <span>
            ({props.location.x}, {props.location.y})
          </span>
        </div>
        <div>
          <h6>Address Grid</h6>
          <span>{props.addressGrid}</span>
        </div>
      </div>
    </>
  );
}
