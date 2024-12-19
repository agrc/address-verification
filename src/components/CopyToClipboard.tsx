import { CheckIcon, CopyIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CopyToClipboard as CopyToClipboard_lib } from 'react-copy-to-clipboard';

type CopyToClipboardProps = {
  text: string;
};
export default function CopyToClipboard({ text }: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const iconSize = 20;

  return (
    <div className="flex items-center gap-2">
      <span>{text}</span>
      <span title="Copy to Clipboard" className="cursor-pointer hover:text-primary-500">
        <CopyToClipboard_lib text={text} onCopy={() => setCopied(true)}>
          {copied ? (
            <CheckIcon size={iconSize} aria-label="copied" />
          ) : (
            <CopyIcon size={iconSize} aria-label="copy to clipboard" />
          )}
        </CopyToClipboard_lib>
      </span>
    </div>
  );
}
