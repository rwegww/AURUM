import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, FileText, Loader2, TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  getMaterialDocumentSourceUrl,
  getMaterialFileType,
  getMaterialPdfPreviewUrl,
  getMaterialPreviewKind,
} from '../../../shared/materialPreview';

const PreviewError = ({ material, message }) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[500px] w-full flex-col items-center justify-center p-10 text-center">
      <TriangleAlert size={48} className="mb-4 text-amber-500" aria-hidden="true" />
      <p className="max-w-lg font-bold text-viet-text">{message}</p>
      <a
        href={material.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-viet-text px-6 py-3 text-sm font-black uppercase text-white"
      >
        <ExternalLink size={16} aria-hidden="true" />
        {t('material_detail.download_to_view')}
      </a>
    </div>
  );
};

const PreviewLoading = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[500px] w-full flex-col items-center justify-center gap-4 text-viet-text-light">
      <Loader2 size={36} className="animate-spin text-viet-green" aria-hidden="true" />
      <p className="text-sm font-black uppercase tracking-widest">
        {t('material_detail.preview_loading')}
      </p>
    </div>
  );
};

const LegacyDocumentPreview = ({ material }) => {
  const { t } = useTranslation();
  const [state, setState] = useState({ loading: true, text: '', truncated: false, error: '' });

  useEffect(() => {
    const controller = new AbortController();

    const loadPreview = async () => {
      setState({ loading: true, text: '', truncated: false, error: '' });
      try {
        const response = await fetch(`/api/materials/${material.id}/preview`, {
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.message || t('material_detail.preview_error'));
        }
        setState({
          loading: false,
          text: data.text || '',
          truncated: Boolean(data.truncated),
          error: '',
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          setState({
            loading: false,
            text: '',
            truncated: false,
            error: error.message || t('material_detail.preview_error'),
          });
        }
      }
    };

    loadPreview();
    return () => controller.abort();
  }, [material.id, t]);

  if (state.loading) {
    return <PreviewLoading />;
  }

  if (state.error) {
    return <PreviewError material={material} message={state.error} />;
  }

  return (
    <div className="h-[650px] w-full overflow-y-auto rounded-xl bg-white p-6 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-3 border-b border-viet-border pb-4 text-viet-green">
          <FileText size={24} aria-hidden="true" />
          <span className="text-xs font-black uppercase tracking-widest">
            {t('material_detail.document_preview')}
          </span>
        </div>
        <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-viet-text">
          {state.text}
        </pre>
        {state.truncated && (
          <p className="mt-8 rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
            {t('material_detail.preview_truncated')}
          </p>
        )}
      </div>
    </div>
  );
};

const DocxPreview = ({ material }) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let resizeObserver;
    const container = containerRef.current;

    const loadPreview = async () => {
      setState({ loading: true, error: '' });
      if (container) container.replaceChildren();

      try {
        const response = await fetch(getMaterialDocumentSourceUrl(material), {
          signal: controller.signal,
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || t('material_detail.preview_error'));
        }

        const documentBlob = await response.blob();
        const { renderAsync } = await import('docx-preview');
        if (!active || !container) return;

        await renderAsync(documentBlob, container, undefined, {
          className: 'docx',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
          ignoreLastRenderedPageBreak: false,
          experimental: true,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true,
          renderEndnotes: true,
          renderChanges: false,
          renderComments: false,
          renderAltChunks: false,
          useBase64URL: true,
        });

        container.querySelectorAll('script, iframe, object, embed').forEach((node) => node.remove());
        container.querySelectorAll('a[href]').forEach((link) => {
          const href = link.getAttribute('href') || '';
          if (!/^(?:https?:|mailto:|#)/i.test(href)) link.removeAttribute('href');
          else {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
          }
        });

        const fitPagesToContainer = () => {
          const pages = [...container.querySelectorAll('section.docx')];
          if (pages.length === 0) return;

          pages.forEach((page) => { page.style.zoom = '1'; });
          const naturalPageWidth = pages[0].getBoundingClientRect().width;
          const availableWidth = Math.max(280, container.clientWidth - 24);
          const scale = naturalPageWidth > 0
            ? Math.min(1, availableWidth / naturalPageWidth)
            : 1;
          pages.forEach((page) => { page.style.zoom = String(scale); });
        };

        fitPagesToContainer();
        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(fitPagesToContainer);
          resizeObserver.observe(container);
        }

        if (active) setState({ loading: false, error: '' });
      } catch (error) {
        if (active && error.name !== 'AbortError') {
          setState({ loading: false, error: error.message || t('material_detail.preview_error') });
        }
      }
    };

    loadPreview();
    return () => {
      active = false;
      controller.abort();
      resizeObserver?.disconnect();
      if (container) container.replaceChildren();
    };
  }, [material, t]);

  return (
    <div className="relative h-[720px] w-full overflow-auto rounded-xl bg-slate-200">
      {state.loading && <div className="absolute inset-0 z-10 bg-gray-100"><PreviewLoading /></div>}
      {state.error && <div className="absolute inset-0 z-10 bg-gray-100"><PreviewError material={material} message={state.error} /></div>}
      <div
        ref={containerRef}
        className="min-h-full w-full py-6 [&_.docx-wrapper]:bg-transparent [&_section.docx]:shadow-xl"
        aria-label={t('material_detail.document_preview')}
      />
    </div>
  );
};

const MaterialPreview = ({ material }) => {
  const { t } = useTranslation();
  const previewKind = getMaterialPreviewKind(material);

  if (previewKind === 'image') {
    return (
      <img
        src={material.file_url}
        className="max-w-full rounded-xl shadow-lg"
        alt={material.title}
      />
    );
  }

  if (previewKind === 'pdf') {
    return (
      <iframe
        src={getMaterialPdfPreviewUrl(material)}
        className="h-[650px] w-full rounded-xl border-none bg-white"
        title={t('material_detail.pdf_preview_title', { title: material.title })}
      />
    );
  }

  if (previewKind === 'document') {
    return getMaterialFileType(material) === 'docx'
      ? <DocxPreview material={material} />
      : <LegacyDocumentPreview material={material} />;
  }

  return (
    <div className="p-12 text-center">
      <FileText size={56} className="mx-auto mb-4 text-viet-text-light/40" aria-hidden="true" />
      <p className="font-bold text-viet-text-light">
        {t('material_detail.unsupported_format', { type: material.file_type })}
      </p>
      <a
        href={material.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-2xl bg-viet-text px-10 py-4 text-sm font-black uppercase text-white"
      >
        {t('material_detail.download_to_view')}
      </a>
    </div>
  );
};

export default MaterialPreview;
