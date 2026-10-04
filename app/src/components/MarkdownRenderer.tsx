import React, { useEffect, useRef } from 'react';
import ReactMarkdown, { type Components, type ExtraProps } from 'react-markdown';
import { Link, useLocation } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import { ArrowUpRight } from 'lucide-react';
import 'github-markdown-css';
import '../styles/markdown-overrides.css';

interface MarkdownRendererProps {
  markdown: string;
}

interface MarkdownNode {
  type: string;
  value?: string;
  alt?: string;
  children?: MarkdownNode[];
  data?: { hProperties?: Record<string, unknown> };
}

function headingText(node: MarkdownNode): string {
  return node.value ?? node.alt ?? node.children?.map(headingText).join('') ?? '';
}

function remarkHeadingIds() {
  return (tree: MarkdownNode) => {
    const used = new Set<string>();
    function visit(node: MarkdownNode) {
      if (node.type === 'heading') {
        const base = headingText(node).toLowerCase().trim()
          .replace(/[^\p{L}\p{N}\p{M}_\s-]/gu, '')
          .replace(/\s+/g, '-') || 'heading';
        let id = base;
        let suffix = 0;
        while (used.has(id)) id = `${base}-${++suffix}`;
        used.add(id);
        node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}

function MarkdownLink({ href, children, node, ...props }: React.ComponentProps<'a'> & ExtraProps) {
  // react-markdown's AST node is not a DOM attribute.
  void node;
  const { pathname, search } = useLocation();
  const className = 'inline-flex items-center gap-1';
  if (href?.startsWith('#')) {
    return <Link {...props} to={{ pathname, search, hash: href }} className={className}>{children}</Link>;
  }
  const external = href?.startsWith('http');
  return (
    <a
      {...props}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={className}
    >
      {children}
      {external && (
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      )}
    </a>
  );
}

const components: Components = { a: MarkdownLink };

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const location = useLocation();
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!location.hash) return;
    let id: string;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    // Compare IDs directly: encoded fragments need not be valid CSS selectors.
    const target = Array.from(container.current?.querySelectorAll('[id]') ?? [])
      .find(element => element.id === id);
    target?.scrollIntoView();
    // Location includes the navigation key, so clicking the same fragment scrolls again.
  }, [location, markdown]);

  return (
    <div ref={container} className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkHeadingIds]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
