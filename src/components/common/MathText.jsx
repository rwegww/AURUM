import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const markdownPlugins = [remarkMath];
const rehypePlugins = [rehypeKatex];

const MathText = ({ children, className = '' }) => {
  if (children === null || children === undefined) return null;
  if (typeof children !== 'string') return <>{children}</>;

  // If no math indicators, render plain text to optimize performance
  if (!children.includes('$') && !children.includes('\\')) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={`inline-math-container ${className}`}>
      <ReactMarkdown
        remarkPlugins={markdownPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          p: ({ node, ...props }) => <span {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </span>
  );
};

export default MathText;
