/**
 * Long-form text of the privacy policy (pages/Privacy.tsx). Kept out of the utils/i18n tables
 * so it ships only in the lazily loaded Privacy chunk instead of the main bundle on every page.
 * The short strings (title, date, intro) are in utils/i18n/{en,bg}.ts under `privacy.*`; the date is PRIVACY_UPDATED in constants.ts.
 *
 * In these strings {email} becomes the contact mailto link and [label](https://...) an
 * external link. Keep both languages in sync.
 */
import type { Language } from '../routes';

export interface PrivacySection {
    heading: string;
    paragraphs: string[];
    items?: string[];
    /** Paragraphs shown after the list. */
    after?: string[];
}

export const PRIVACY_SECTIONS: Record<Language, PrivacySection[]> = {
    en: [
        {
            heading: 'Who is responsible for your data',
            paragraphs: [
                'The controller of your personal data is Stella Maris Kennel, Sofia, Bulgaria. For any question about your data, or to exercise your rights, email us at {email}.'
            ]
        },
        {
            heading: 'Contact form',
            paragraphs: [
                'When you send us a message through the contact form, we receive the details you enter: first and last name, email address, phone number (optional), the topic of your inquiry and your message. The form also sends the language of the page, the page of our site you came from (or, if you arrived from another website, that website’s address) and, if you asked about a specific litter or puppy, which one, so that we can reply in the right language and about the right puppies.',
                'Name, email and message are required so that we can reply; the phone number is optional.',
                'We use this information only to answer your inquiry, including keeping your place on our puppy waitlist if you ask for one. The legal basis is your request to us, as a step before a possible puppy purchase (Art. 6(1)(b) GDPR), and our legitimate interest in answering the messages we receive (Art. 6(1)(f) GDPR).',
                'The form is delivered by [Formspree](https://formspree.io/legal/privacy-policy/) (Formspree, Inc.), which forwards your message to our email inbox and processes it on our behalf on servers in the United States.',
                'If you contact us by email, phone or WhatsApp instead, we use the details you share in the same way. WhatsApp is a Meta service and its own privacy policy applies.'
            ]
        },
        {
            heading: 'Cookies and Google Ads',
            paragraphs: [
                'We advertise with Google Ads. Our site loads the Google tag (gtag.js) only if you click “Accept” in the cookie banner. The tag sets advertising cookies such as _gcl_au (kept for up to 90 days) and sends Google information about your visit: the pages you view, whether you contact us, your IP address and browser details. We use this to see which ads lead to visits and inquiries.',
                'The legal basis is your consent (Art. 6(1)(a) GDPR and the Bulgarian Electronic Communications Act). If you click “Reject”, or make no choice, the Google tag is not loaded and no advertising cookies are set.',
                'You can change your choice at any time with “Cookie settings” at the bottom of every page. Google processes this data under its own [privacy policy](https://policies.google.com/privacy); see also [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).',
                'Strictly necessary storage: your browser keeps your language choice and your cookie choice (localStorage), and a short-lived technical marker (sessionStorage) that helps the site recover after a failed update. These stay on your device, are not sent to us or anyone else, and do not require consent.'
            ]
        },
        {
            heading: 'Map on the Puppies page',
            paragraphs: [
                'The map showing where our puppies live loads map images from the OpenStreetMap tile servers (tile.openstreetmap.org), run by the OpenStreetMap Foundation; map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors. To fetch the images, your browser sends your IP address, the address of the page and standard request details to these servers, and the [OpenStreetMap Foundation privacy policy](https://osmfoundation.org/wiki/Privacy_Policy) applies. We rely on our legitimate interest in showing the map (Art. 6(1)(f) GDPR).'
            ]
        },
        {
            heading: 'Hosting',
            paragraphs: [
                'This website is hosted on GitHub Pages (GitHub, Inc.). When you visit a GitHub Pages site, GitHub logs your IP address for security purposes ([GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#data-collection), [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)). This is necessary to deliver and protect the site (Art. 6(1)(f) GDPR).'
            ]
        },
        {
            heading: 'Transfers outside the EU',
            paragraphs: [
                'Formspree, Google and GitHub may process data in the United States. Such transfers rely on safeguards recognised under the GDPR, such as the European Commission’s standard contractual clauses or the EU–US Data Privacy Framework where the provider takes part in it.'
            ]
        },
        {
            heading: 'How long we keep your data',
            paragraphs: [
                'We keep your messages and contact details for as long as we need them to handle your inquiry and any follow-up, for example while you are on our puppy waitlist. After that we delete them, unless the law requires us to keep them longer. Advertising cookies expire as described above, and you can delete them in your browser at any time.'
            ]
        },
        {
            heading: 'Your rights',
            paragraphs: [
                'Under the GDPR you have the right to:'
            ],
            items: [
                'access your personal data;',
                'have it corrected;',
                'have it erased;',
                'restrict its processing;',
                'object to processing based on our legitimate interest;',
                'receive your data in a portable format;',
                'withdraw your consent at any time, without affecting processing carried out before you withdrew it.'
            ],
            after: [
                'To exercise these rights, email us at {email}. We will reply within one month.',
                'You also have the right to lodge a complaint with the Bulgarian supervisory authority, the Commission for Personal Data Protection (CPDP), 2 Prof. Tsvetan Lazarov Blvd., Sofia 1592, [www.cpdp.bg](https://www.cpdp.bg/), or with the authority in the EU country where you live or work.'
            ]
        },
        {
            heading: 'Changes to this policy',
            paragraphs: [
                'We do not sell your personal data and do not make automated decisions about you. If we change how we handle data, we will update this page and the date at the top.'
            ]
        }
    ],
    bg: [
        {
            heading: 'Кой отговаря за вашите данни',
            paragraphs: [
                'Администратор на личните ви данни е развъдник Стела Марис, София, България. С въпроси относно данните ви или за да упражните правата си, пишете ни на {email}.'
            ]
        },
        {
            heading: 'Форма за контакт',
            paragraphs: [
                'Когато ни изпратите съобщение чрез формата за контакт, получаваме въведените от вас данни: име и фамилия, имейл адрес, телефон (по желание), темата на запитването и самото съобщение. Заедно с тях формата изпраща езика на страницата, страницата от сайта ни, от която идвате (или, ако сте дошли от друг сайт, адреса на този сайт), и – ако питате за конкретно кучило или кученце – за кое, за да ви отговорим на правилния език и по същество.',
                'Името, имейлът и съобщението са задължителни, за да можем да ви отговорим; телефонът не е задължителен.',
                'Използваме тези данни само за да отговорим на запитването ви, включително за да ви запазим място в списъка с чакащи за кученце, ако желаете. Основанието е вашето искане като стъпка преди евентуално закупуване на кученце (чл. 6, пар. 1, буква „б“ от ОРЗД) и законният ни интерес да отговаряме на получените съобщения (чл. 6, пар. 1, буква „е“ от ОРЗД).',
                'Формата се изпраща чрез услугата [Formspree](https://formspree.io/legal/privacy-policy/) (Formspree, Inc.), която препраща съобщението до нашата пощенска кутия и обработва данните от наше име на сървъри в САЩ.',
                'Ако ни пишете по имейл, телефон или WhatsApp, използваме споделените данни по същия начин. WhatsApp е услуга на Meta и за нея важи собствената ѝ политика за поверителност.'
            ]
        },
        {
            heading: 'Бисквитки и Google Ads',
            paragraphs: [
                'Рекламираме се чрез Google Ads. Сайтът зарежда маркера на Google (gtag.js) само ако натиснете „Приемам“ в банера за бисквитки. Маркерът записва рекламни бисквитки, например _gcl_au (със срок до 90 дни), и изпраща на Google информация за посещението ви: кои страници разглеждате, дали се свързвате с нас, IP адреса ви и данни за браузъра. Използваме я, за да разберем кои реклами водят до посещения и запитвания.',
                'Основанието е вашето съгласие (чл. 6, пар. 1, буква „а“ от ОРЗД и Закона за електронните съобщения). Ако натиснете „Отказвам“ или не направите избор, маркерът на Google не се зарежда и не се записват рекламни бисквитки.',
                'Можете да промените избора си по всяко време чрез „Настройки за бисквитки“ в долната част на всяка страница. Google обработва тези данни съгласно своята [политика за поверителност](https://policies.google.com/privacy?hl=bg); вижте също [как Google използва информацията от сайтовете, които ползват услугите му](https://policies.google.com/technologies/partner-sites?hl=bg).',
                'Необходимо съхранение: браузърът ви запазва избрания език и избора ви за бисквитки (localStorage), както и временен технически маркер (sessionStorage), който помага на сайта да се възстанови след неуспешно обновяване. Тези данни остават на устройството ви, не се изпращат до нас или до трети лица и не изискват съгласие.'
            ]
        },
        {
            heading: 'Картата на страницата „Кученца“',
            paragraphs: [
                'Картата, която показва къде живеят нашите кученца, зарежда изображения от сървърите за карти на OpenStreetMap (tile.openstreetmap.org), поддържани от фондация OpenStreetMap, с картни данни © сътрудниците на [OpenStreetMap](https://www.openstreetmap.org/copyright). За да ги получи, браузърът ви изпраща IP адреса ви, адреса на страницата и стандартните данни за заявката до тези сървъри, като се прилага [политиката за поверителност на фондация OpenStreetMap](https://osmfoundation.org/wiki/Privacy_Policy). Основанието е законният ни интерес да покажем картата (чл. 6, пар. 1, буква „е“ от ОРЗД).'
            ]
        },
        {
            heading: 'Хостинг',
            paragraphs: [
                'Сайтът се хоства в GitHub Pages (GitHub, Inc.). При посещение на сайт в GitHub Pages GitHub записва IP адреса на посетителя с цел сигурност ([документация на GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#data-collection), [декларация за поверителност на GitHub](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)). Това е необходимо, за да работи сайтът и да бъде защитен (чл. 6, пар. 1, буква „е“ от ОРЗД).'
            ]
        },
        {
            heading: 'Предаване на данни извън ЕС',
            paragraphs: [
                'Formspree, Google и GitHub може да обработват данни в САЩ. Такова предаване се основава на гаранции, признати от ОРЗД, например стандартните договорни клаузи на Европейската комисия или Рамката за защита на данните между ЕС и САЩ, когато доставчикът участва в нея.'
            ]
        },
        {
            heading: 'Колко дълго пазим данните',
            paragraphs: [
                'Пазим съобщенията и данните ви за контакт, докато са ни нужни, за да обработим запитването ви и последващата кореспонденция – например докато сте в списъка с чакащи за кученце. След това ги изтриваме, освен ако законът не изисква да ги пазим по-дълго. Рекламните бисквитки изтичат, както е описано по-горе, а можете да ги изтриете от браузъра си по всяко време.'
            ]
        },
        {
            heading: 'Вашите права',
            paragraphs: [
                'Съгласно ОРЗД имате право:'
            ],
            items: [
                'на достъп до личните си данни;',
                'да поискате поправянето им;',
                'да поискате изтриването им;',
                'да поискате ограничаване на обработването им;',
                'да възразите срещу обработване, основано на законния ни интерес;',
                'да получите данните си в преносим формат;',
                'да оттеглите съгласието си по всяко време, без това да засяга законосъобразността на обработването преди оттеглянето.'
            ],
            after: [
                'За да упражните правата си, пишете ни на {email}. Ще ви отговорим в срок до един месец.',
                'Имате право и да подадете жалба до Комисията за защита на личните данни (КЗЛД), София 1592, бул. „Проф. Цветан Лазаров“ № 2, [www.cpdp.bg](https://www.cpdp.bg/), или до надзорния орган в държавата от ЕС, в която живеете или работите.'
            ]
        },
        {
            heading: 'Промени в тази политика',
            paragraphs: [
                'Не продаваме личните ви данни и не вземаме автоматизирани решения за вас. Ако променим начина, по който обработваме данни, ще актуализираме тази страница и датата в началото ѝ.'
            ]
        }
    ],
};
