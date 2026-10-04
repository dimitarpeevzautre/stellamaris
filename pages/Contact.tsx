import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { AVAILABLE_PUPPIES, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_WHATSAPP, LITTERS } from '../constants';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { useLanguage } from '../context/LanguageContext';
import { getPreviousPath, trackLead } from '../utils/analytics';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xojnvwjz';

// Submitted values stay in English so inquiries read the same in the inbox in either language.
const INTEREST = {
  general: 'General Inquiry',
  waitlist: 'Puppy Waitlist',
  stud: 'Stud Service',
} as const;

type Status = 'idle' | 'submitting' | 'success' | 'error';

/** What the visitor clicked "Inquire" on (from ?litter=<id>&puppy=<id>, checked against constants.ts). */
interface InquiryContext {
  litter: string;
  puppy?: string;
}

// Visible focus (WCAG 2.4.7) in the brand blue; invalid fields get a red border and background.
const inputClass =
  'w-full px-4 py-3 bg-gray-50 border border-gray-400 transition scroll-mt-32 ' +
  'focus:outline-none focus:border-stella-blue focus:ring-2 focus:ring-stella-blue ' +
  'aria-[invalid=true]:border-red-700 aria-[invalid=true]:bg-red-50';

/** Required fields, checked in this order (the first invalid one gets focus). id = `contact-<id>`. */
const REQUIRED_FIELDS = [
  { name: 'firstName', id: 'first-name' },
  { name: 'lastName', id: 'last-name' },
  { name: 'email', id: 'email' },
  { name: 'message', id: 'message' },
] as const;
type FieldName = (typeof REQUIRED_FIELDS)[number]['name'];
type FieldError = 'required' | 'email';

/** Uses the browser's own constraint checks (required, type="email"), with bilingual messages. */
const validateField = (el: HTMLInputElement | HTMLTextAreaElement): FieldError | undefined => {
  if (el.required && (el.validity.valueMissing || !el.value.trim())) return 'required';
  if (el.validity.typeMismatch) return 'email';
  return undefined;
};
const labelClass = 'block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide';

const Contact: React.FC = () => {
  const { t, language, path } = useLanguage();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>('idle');
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  // Everything derived from the query string starts at the default on both server and
  // client (prerendered HTML never has a query), then follows the URL in an effect.
  const [interest, setInterest] = useState<string>(INTEREST.general);
  const [message, setMessage] = useState('');
  const [inquiry, setInquiry] = useState<InquiryContext | null>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldName, FieldError>>>({});

  const interestParam = searchParams.get('interest');
  const litterParam = searchParams.get('litter');
  const puppyParam = searchParams.get('puppy');

  useEffect(() => {
    const puppy = AVAILABLE_PUPPIES.find((p) => p.id === puppyParam);
    const litter = LITTERS.find((l) => l.id === (puppy?.litterId ?? litterParam));
    const context: InquiryContext | null = litter
      ? { litter: `${litter.sire} x ${litter.dam}`, puppy: puppy?.name }
      : null;
    setInquiry(context);
    setInterest(interestParam === 'waitlist' || context ? INTEREST.waitlist : INTEREST.general);
    if (context) {
      const template = context.puppy
        ? t('contact.puppy_message').replace('{puppy}', context.puppy)
        : t('contact.litter_message');
      // Only prefill an empty message, never overwrite what the visitor typed.
      setMessage((current) => current || template.replace('{litter}', context.litter));
    }
  }, [interestParam, litterParam, puppyParam, t]);

  // Bring the confirmation into view and announce it (the form above it is replaced,
  // which would otherwise leave it off-screen on phones).
  useEffect(() => {
    if (status !== 'success') return;
    const heading = successHeadingRef.current;
    if (!heading) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Validate in the page's language (noValidate turns off the browser's own bubbles, which
    // appear in the browser's language and are not announced consistently).
    const found: Partial<Record<FieldName, FieldError>> = {};
    let firstInvalid: HTMLElement | null = null;
    for (const field of REQUIRED_FIELDS) {
      const el = form.elements.namedItem(field.name);
      if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) continue;
      const error = validateField(el);
      if (error) {
        found[field.name] = error;
        firstInvalid ??= el;
      }
    }
    setErrors(found);
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    setStatus('submitting');

    const formData = new FormData(form);
    // Where the visitor came from: the previous page on this site, else the external referrer.
    const previous = getPreviousPath();
    formData.set('source_page', previous ?? (document.referrer ? `external: ${document.referrer}` : 'direct'));
    // Formspree uses the "subject" field as the notification email's subject line.
    formData.set(
      'subject',
      `[${language.toUpperCase()}] ${interest}${inquiry ? ` – ${inquiry.puppy ? `${inquiry.puppy}, ` : ''}${inquiry.litter}` : ''} – stellamaris.dog`,
    );

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
      setStatus('success');
      trackLead({ interest, language, litter: inquiry?.litter });
    } catch {
      setStatus('error');
    }
  };

  const resetForm = () => {
    setMessage('');
    setErrors({});
    setStatus('idle');
  };

  /** id, validation state and error wiring for a required field. */
  const fieldProps = (name: FieldName) => {
    const id = `contact-${REQUIRED_FIELDS.find((f) => f.name === name)!.id}`;
    const error = errors[name];
    return {
      id,
      name,
      required: true,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `${id}-error` : undefined,
      // Check a field when the visitor leaves it (only once something is typed, so tabbing
      // through an empty form doesn't flag everything), and clear the error as soon as it's fixed.
      onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!e.currentTarget.value && !error) return;
        const next = validateField(e.currentTarget);
        setErrors((current) => ({ ...current, [name]: next }));
      },
      onInput: (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!error) return;
        const next = validateField(e.currentTarget);
        if (!next) setErrors((current) => ({ ...current, [name]: undefined }));
      },
    };
  };

  const fieldError = (name: FieldName) => {
    const error = errors[name];
    if (!error) return null;
    const id = `contact-${REQUIRED_FIELDS.find((f) => f.name === name)!.id}-error`;
    return (
      <p id={id} className="mt-2 flex items-start gap-1.5 text-sm text-red-700">
        <AlertCircle className="flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
        {t(`contact.errors.${error}`)}
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-stella-cream py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-stella-dark mb-4">{t('contact.title')}</h1>
          <p className="text-gray-500 font-light">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-10 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 mb-8">{t('contact.info_title')}</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <Mail className="text-stella-gold mt-1 mr-6 flex-shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="font-serif text-lg text-gray-800">{t('contact.email')}</p>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-gray-600 hover:text-stella-gold-dark transition-colors break-words">{CONTACT_EMAIL}</a>
                    <p className="text-xs text-gray-500">{t('contact.email_note')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="text-stella-gold mt-1 mr-6 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="font-serif text-lg text-gray-800">{t('contact.phone')}</p>
                    <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="text-gray-600 hover:text-stella-gold-dark transition-colors">{CONTACT_PHONE}</a>
                    <p className="text-xs text-gray-500">{t('contact.hours')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <WhatsAppIcon className="w-6 h-6 text-stella-gold mt-1 mr-6 flex-shrink-0" />
                  <div>
                    <p className="font-serif text-lg text-gray-800">WhatsApp</p>
                    <a href={CONTACT_WHATSAPP} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-stella-gold-dark transition-colors">{t('contact.whatsapp_chat')}</a>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="text-stella-gold mt-1 mr-6 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="font-serif text-lg text-gray-800">{t('contact.location')}</p>
                    <p className="text-gray-600">{t('contact.location_value')}</p>
                    <p className="text-xs text-gray-500">{t('contact.visits')}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed px-2">
              {t('contact.faq_hint')}{' '}
              <Link to={path('faq')} className="text-stella-blue underline underline-offset-2 hover:text-stella-gold-dark">
                {t('contact.faq_link')}
              </Link>
              .
            </p>
          </div>

          {/* Form / confirmation */}
          <div className="bg-white p-10 shadow-sm border border-gray-100">
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={32} aria-hidden="true" />
                </div>
                <h2 ref={successHeadingRef} tabIndex={-1} className="text-2xl font-serif text-gray-800 mb-2 focus:outline-none">
                  {t('contact.success_title')}
                </h2>
                <p className="text-gray-600 mb-6">{t('contact.success_desc')}</p>
                <button type="button" onClick={resetForm} className="text-stella-gold-dark font-bold uppercase text-sm tracking-widest hover:underline">
                  {t('contact.send_another')}
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 mb-8">{t('contact.form_title')}</h2>
                {inquiry && (
                  <p className="mb-6 bg-stella-cream border border-stella-sand px-4 py-3 text-sm text-stella-dark">
                    {t('contact.inquiry_about')}{' '}
                    <strong className="font-semibold">{inquiry.puppy ? `${inquiry.puppy} – ${inquiry.litter}` : inquiry.litter}</strong>
                  </p>
                )}
                {/* action/method: without JS (or before hydration) the form still posts to Formspree instead of
                    putting the visitor's details in a GET query string. With JS, handleSubmit sends it via fetch. */}
                <form action={FORMSPREE_ENDPOINT} method="POST" onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Context for the reply (the breeder sees these in the inquiry email). */}
                  <input type="hidden" name="language" value={language} />
                  {inquiry && <input type="hidden" name="litter" value={inquiry.litter} />}
                  {inquiry?.puppy && <input type="hidden" name="puppy" value={inquiry.puppy} />}
                  {/* Formspree honeypot: hidden from people and assistive tech; bots that fill it are dropped. */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="contact-gotcha">{t('contact.honeypot')}</label>
                    <input id="contact-gotcha" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-first-name" className={labelClass}>{t('contact.first_name')}</label>
                      <input type="text" autoComplete="given-name" className={inputClass} {...fieldProps('firstName')} />
                      {fieldError('firstName')}
                    </div>
                    <div>
                      <label htmlFor="contact-last-name" className={labelClass}>{t('contact.last_name')}</label>
                      <input type="text" autoComplete="family-name" className={inputClass} {...fieldProps('lastName')} />
                      {fieldError('lastName')}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-email" className={labelClass}>{t('contact.email')}</label>
                    <input type="email" autoComplete="email" inputMode="email" spellCheck={false} className={inputClass} {...fieldProps('email')} />
                    {fieldError('email')}
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>{t('contact.phone')} <span className="text-gray-500 normal-case font-normal">({t('contact.optional')})</span></label>
                    <input id="contact-phone" type="tel" name="phone" autoComplete="tel" className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="contact-interest" className={labelClass}>{t('contact.interest')}</label>
                    <select id="contact-interest" name="interest" value={interest} onChange={(e) => setInterest(e.target.value)} className={inputClass}>
                      <option value={INTEREST.general}>{t('contact.interest_options.general')}</option>
                      <option value={INTEREST.waitlist}>{t('contact.interest_options.waitlist')}</option>
                      <option value={INTEREST.stud}>{t('contact.interest_options.stud')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className={labelClass}>{t('contact.message')}</label>
                    <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass} {...fieldProps('message')}></textarea>
                    {fieldError('message')}
                  </div>

                  <div role="alert">
                    {status === 'error' && (
                      <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
                        <AlertCircle className="flex-shrink-0 mt-0.5" size={18} aria-hidden="true" />
                        <p>
                          {t('contact.error')}{' '}
                          <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-semibold">{CONTACT_EMAIL}</a>
                          {' · '}
                          <a href={CONTACT_WHATSAPP} target="_blank" rel="noopener noreferrer" className="underline font-semibold">WhatsApp</a>
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-stella-gold hover:bg-[#b8952b] text-stella-dark font-bold py-4 px-6 uppercase tracking-widest text-xs transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        {t('contact.sending')}
                      </>
                    ) : (
                      t('contact.send')
                    )}
                  </button>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    {t('contact.data_notice')}{' '}
                    <Link to={path('privacy')} className="text-stella-blue underline underline-offset-2 hover:text-stella-gold-dark">
                      {t('contact.privacy_link')}
                    </Link>
                    .
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
