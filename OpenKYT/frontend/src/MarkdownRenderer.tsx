import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none 
      prose-p:leading-relaxed prose-p:text-zinc-800 dark:prose-p:text-zinc-200
      prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-strong:font-semibold
      prose-ul:list-disc prose-ol:list-decimal prose-li:my-1
      prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100
      prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <div className="w-full overflow-x-auto my-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-sm text-left m-0" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-4 py-3 font-medium" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 bg-white dark:bg-black/20" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 even:bg-zinc-50/30 dark:even:bg-zinc-900/10" {...props} />
          ),
          pre: ({ node, children, ...props }) => {
            return <>{children}</>; // We handle the wrapper in the code component to get the language
          },
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !className?.includes('language-');
            const language = match ? match[1] : 'text';
            const codeString = String(children).replace(/\n$/, '');

            if (isInline) {
              return (
                <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md font-mono text-sm text-zinc-900 dark:text-zinc-100" {...props}>
                  {children}
                </code>
              );
            }

            return <CodeBlock language={language} code={codeString} />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="!m-0 !p-0 bg-transparent">
          <code className="font-mono text-sm text-zinc-800 dark:text-zinc-200">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
