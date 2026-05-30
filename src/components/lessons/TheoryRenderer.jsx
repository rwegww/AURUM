import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const KATEX_CSS_ID = 'aurum-katex-css';
const KATEX_CSS_URL = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';

const ensureKatexStylesheet = () => {
  if (document.getElementById(KATEX_CSS_ID)) return;
  const link = document.createElement('link');
  link.id = KATEX_CSS_ID;
  link.rel = 'stylesheet';
  link.href = KATEX_CSS_URL;
  document.head.appendChild(link);
};

const TheoryRenderer = ({ modules }) => {
  useEffect(() => {
    ensureKatexStylesheet();
  }, []);

  if (!modules || !Array.isArray(modules)) return null;

  const markdownPlugins = [remarkGfm, remarkMath];
  const rehypePlugins = [rehypeKatex];

  // Helper to fix literal \n strings in content and provide hard breaks
  const formatContent = (text) => {
    if (typeof text !== 'string') return text;
    // Replace \n with two spaces and a newline for markdown hard break
    // Also remove any stray trailing backslashes that might have been added
    return text.replace(/\\n/g, '  \n').replace(/\\\s*$/gm, '');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {modules.map((module, index) => {
        const { type, content } = module;

        switch (type) {
          case 'heading': {
            const HeadingTag = content.level || 'h2';
            // Strip leading numbers like "1. ", "2. ", "II. "
            let headingText = formatContent(content.text);
            headingText = headingText.replace(/^(?:\d+|[IVXLCDM]+)[\.\)]\s*/i, '');
            
            return (
              <HeadingTag 
                key={index} 
                className={`text-viet-green font-black tracking-tight mt-12 first:mt-0 ${
                  content.level === 'h1' ? 'text-4xl border-b-2 border-viet-green/10 pb-4 mb-8' : 
                  content.level === 'h3' ? 'text-2xl mt-8' : 'text-[28px] mb-6'
                }`}
              >
                <ReactMarkdown 
                  remarkPlugins={markdownPlugins}
                  rehypePlugins={rehypePlugins}
                >
                  {headingText}
                </ReactMarkdown>
              </HeadingTag>
            );
          }

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
                className="bg-slate-50 border-l-[6px] border-blue-500 p-6 rounded-2xl my-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
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
                className="bg-orange-50 border-l-[6px] border-orange-500 p-6 rounded-2xl my-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center shrink-0">
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

          case 'markdown':
            return (
              <div key={index} className="prose max-w-none prose-slate prose-headings:text-viet-green prose-headings:font-black prose-p:text-viet-text prose-p:text-[17px] prose-p:font-medium prose-p:leading-[1.8] prose-p:opacity-90 prose-li:text-viet-text prose-li:text-[17px] prose-li:font-medium prose-li:leading-relaxed">
                <ReactMarkdown 
                  remarkPlugins={markdownPlugins}
                  rehypePlugins={rehypePlugins}
                >
                  {formatContent(content.text)}
                </ReactMarkdown>
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
