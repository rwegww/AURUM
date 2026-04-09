import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const TheoryRenderer = ({ modules }) => {
  if (!modules || !Array.isArray(modules)) return null;

  const markdownPlugins = [remarkGfm, remarkMath];
  const rehypePlugins = [rehypeKatex];

  // Helper to fix literal \n strings in content
  const formatContent = (text) => {
    if (typeof text !== 'string') return text;
    return text.replace(/\\n/g, '\n');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {modules.map((module, index) => {
        const { type, content } = module;

        switch (type) {
          case 'heading':
            const HeadingTag = content.level || 'h2';
            return (
              <HeadingTag 
                key={index} 
                className={`text-viet-green font-black tracking-tight mt-12 first:mt-0 ${
                  content.level === 'h1' ? 'text-4xl border-b-2 border-viet-green/10 pb-4 mb-8' : 
                  content.level === 'h3' ? 'text-2xl mt-8' : 'text-3xl mb-6'
                }`}
              >
                <ReactMarkdown 
                  remarkPlugins={markdownPlugins}
                  rehypePlugins={rehypePlugins}
                >
                  {formatContent(content.text)}
                </ReactMarkdown>
              </HeadingTag>
            );

          case 'paragraph':
            return (
              <div key={index} className="text-viet-text leading-[1.8] text-[17px] font-medium opacity-90">
                <ReactMarkdown 
                  remarkPlugins={markdownPlugins}
                  rehypePlugins={rehypePlugins}
                >
                  {formatContent(content.text)}
                </ReactMarkdown>
              </div>
            );

          case 'list':
            return (
              <ul key={index} className="space-y-4 list-none pl-2">
                {content.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-viet-text text-[17px] font-medium leading-relaxed">
                    <span className="mt-2.5 w-2 h-2 rounded-full bg-viet-green shrink-0 shadow-[0_0_8px_rgba(118,192,52,0.4)]" />
                    <ReactMarkdown 
                      remarkPlugins={markdownPlugins}
                      rehypePlugins={rehypePlugins}
                    >
                      {formatContent(item)}
                    </ReactMarkdown>
                  </li>
                ))}
              </ul>
            );

          case 'infoBox':
            return (
              <div 
                key={index} 
                className="bg-blue-50/50 border-l-8 border-blue-500 p-8 rounded-2xl my-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-black text-blue-700 text-lg uppercase tracking-wider">
                    <ReactMarkdown 
                      remarkPlugins={markdownPlugins}
                      rehypePlugins={rehypePlugins}
                    >
                      {formatContent(content.title)}
                    </ReactMarkdown>
                  </h4>
                </div>
                <div className="text-viet-text font-medium leading-relaxed prose max-w-none prose-p:text-viet-text">
                  <ReactMarkdown 
                    remarkPlugins={markdownPlugins}
                    rehypePlugins={rehypePlugins}
                  >
                    {formatContent(content.content)}
                  </ReactMarkdown>
                </div>
              </div>
            );

          case 'warningBox':
            return (
              <div 
                key={index} 
                className="bg-orange-50 border-l-8 border-orange-500 p-8 rounded-2xl my-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h4 className="font-black text-orange-700 text-lg uppercase tracking-wider">
                    <ReactMarkdown 
                      remarkPlugins={markdownPlugins}
                      rehypePlugins={rehypePlugins}
                    >
                      {formatContent(content.title)}
                    </ReactMarkdown>
                  </h4>
                </div>
                <div className="text-viet-text font-medium leading-relaxed prose max-w-none prose-p:text-viet-text">
                  <ReactMarkdown 
                    remarkPlugins={markdownPlugins}
                    rehypePlugins={rehypePlugins}
                  >
                    {formatContent(content.content)}
                  </ReactMarkdown>
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default TheoryRenderer;
