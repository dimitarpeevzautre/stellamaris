import React from 'react';
import { RefreshCw } from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_PHONE } from '../constants';
import { translate, type Language } from '../context/LanguageContext';
import { isChunkLoadError, reloadOnceForStaleChunk } from '../utils/staleChunkReload';

interface ErrorBoundaryProps {
  language: Language;
  /** When this value changes (e.g. the pathname), a shown error is cleared. */
  resetKey: string;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: unknown;
}

/** Catches render and lazy-chunk errors in the page area and shows a friendly, bilingual message. */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    if (isChunkLoadError(error) && reloadOnceForStaleChunk()) return;
    console.error(error, info.componentStack);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    const t = (key: string) => translate(this.props.language, key);
    return (
      <div role="alert" className="min-h-[70vh] flex items-center justify-center bg-stella-cream px-4 py-16">
        <div className="bg-white border border-gray-100 shadow-xl max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-serif text-stella-dark mb-4">{t('error.title')}</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">{t('error.desc')}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center bg-stella-gold hover:bg-[#b8952b] text-stella-dark font-bold py-3 px-8 uppercase tracking-widest text-xs transition duration-300"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('error.reload')}
          </button>
          <p className="text-sm text-gray-500 mt-8">
            {t('error.contact')}{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-stella-blue hover:text-stella-gold-dark">{CONTACT_EMAIL}</a>
            {' · '}
            <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="text-stella-blue hover:text-stella-gold-dark">{CONTACT_PHONE}</a>
          </p>
        </div>
      </div>
    );
  }
}

/**
 * Last-resort boundary around the whole app (App.tsx), above LanguageProvider, for errors outside the
 * page area (navigation, head tags). The text tables may be missing here, so its text is hardcoded
 * in both languages; without it React would unmount the app and leave a blank page.
 */
export class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    if (isChunkLoadError(error) && reloadOnceForStaleChunk()) return;
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div role="alert" className="min-h-screen flex items-center justify-center bg-stella-cream px-4 py-16">
        <div className="bg-white border border-gray-100 shadow-xl max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-serif text-stella-dark mb-4">
            <span lang="en">Something went wrong</span>
            <span className="block mt-1" lang="bg">Нещо се обърка</span>
          </h1>
          <p className="text-gray-600 mb-2 leading-relaxed" lang="en">
            This page could not be loaded. Please reload the page. If the problem continues, contact us directly.
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed" lang="bg">
            Страницата не можа да се зареди. Моля, презаредете я. Ако проблемът продължава, свържете се директно с нас.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center bg-stella-gold hover:bg-[#b8952b] text-stella-dark font-bold py-3 px-8 uppercase tracking-widest text-xs transition duration-300"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            <span lang="en">Reload page</span>
            <span aria-hidden="true">&nbsp;/&nbsp;</span>
            <span lang="bg">Презареди</span>
          </button>
          <p className="text-sm text-gray-500 mt-8">
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-stella-blue hover:text-stella-gold-dark">{CONTACT_EMAIL}</a>
            {' · '}
            <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="text-stella-blue hover:text-stella-gold-dark">{CONTACT_PHONE}</a>
          </p>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
