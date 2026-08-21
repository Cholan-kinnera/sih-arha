import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import type { SourceCitation as CitationType } from '../../types/scheme.types';

export interface SourceCitationProps {
  source: CitationType;
  className?: string;
}

export const SourceCitation: React.FC<SourceCitationProps> = ({ source, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-300 font-mono-code ${className}`}>
      <FileText className="w-3.5 h-3.5 text-blue-400" />
      <span className="truncate max-w-[200px]">{source.title}</span>
      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="text-zinc-500 hover:text-blue-400 transition-colors"
          title={`Official Source: ${source.publisher}`}
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};
