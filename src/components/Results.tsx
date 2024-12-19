import { BusyBar } from '@ugrc/utah-design-system';
import Candidate, { type CandidateProps } from './Candidate';

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

type ResultsProps = {
  candidates: CandidateProps[] | undefined;
  error: Error | null;
  isLoading: boolean;
};
export default function Results({ candidates, error, isLoading }: ResultsProps) {
  if (isLoading) {
    return (
      <div className="relative">
        <BusyBar busy={isLoading} />
      </div>
    );
  }

  if (error) {
    return <ErrorFallback error={error} />;
  }

  if (!candidates || candidates.length === 0) {
    return <span>No candidates found</span>;
  }

  return candidates.map((props, i) => <Candidate key={i} {...props} />);
}
