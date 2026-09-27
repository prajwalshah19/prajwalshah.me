import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowUpRight } from 'lucide-react';
import 'github-markdown-css';
import '../styles/markdown-overrides.css';

interface MarkdownRendererProps {
  markdown: string;
}

const components: Components = {
  a: ({ href, children, ...props }) => {
    const external = href?.startsWith('http');
    return (
      <a
        href={href}
        {...props}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="inline-flex items-center gap-1"
      >
        {children}
        {external && (
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        )}
      </a>
    );
  },
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
