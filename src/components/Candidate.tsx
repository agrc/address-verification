import type { Location } from '../shared.types';
import CopyToClipboard from './CopyToClipboard';
import SearchApiQuery from './SearchApiQuery';

export type CandidateProps = {
  addressGrid: string;
  locator: string;
  matchAddress: string;
  score: number;
  standardizedAddress: string;
  location: Location;
};

export default function Candidate(props: CandidateProps) {
  return (
    <>
      <div className="mb-4 w-full rounded-md border border-slate-300 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">
            <CopyToClipboard text={props.matchAddress} />
          </span>
          <span>score: {props.score}</span>
        </div>
        <div>
          <h6>Locator</h6>
          <CopyToClipboard text={props.locator} />
        </div>
        <div>
          <h6>Coordinates ({props.location.spatialReference.wkid})</h6>
          <CopyToClipboard text={`${props.location.x}, ${props.location.y}`} />
        </div>
        <div>
          <h6>Address Grid</h6>
          <CopyToClipboard text={props.addressGrid} />
        </div>
        <SearchApiQuery label="Zip Code" location={props.location} table="boundaries.zip_code_areas" field="zip5" />
        <SearchApiQuery
          label="Municipality"
          location={props.location}
          table="boundaries.municipal_boundaries"
          field="name"
        />
        <SearchApiQuery label="County" location={props.location} table="boundaries.county_boundaries" field="name" />
      </div>
    </>
  );
}
