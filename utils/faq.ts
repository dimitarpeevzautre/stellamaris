/**
 * Questions and answers for the FAQ page (/faq/, /bg/faq/), its FAQPage structured data and
 * /llms-full.txt. Kept out of the i18n tables so the text only loads with the FAQ page.
 *
 * Answers about this kennel come from the site's own data (constants.ts) and must stay
 * factual. Price, deposit amount, contract and guarantee terms are deliberately NOT published
 * here until the owners provide them: those answers ask visitors to contact us.
 *
 * Sources for the general breed and travel facts (checked 3 October 2026):
 *  - FCI breed standard No. 37, Portuguese Water Dog (size, weight, coat, temperament):
 *    https://www.fci.be/Nomenclature/Standards/037g08-en.pdf
 *  - Portuguese Water Dog Club of Canada (life expectancy 12–15 years, brushing several times a week):
 *    https://pwdcc.org/about-pwds/
 *  - Wikipedia, Portuguese Water Dog (lion and retriever clips; no scientific evidence that
 *    hypoallergenic breeds exist): https://en.wikipedia.org/wiki/Portuguese_Water_Dog
 *  - Your Europe, travelling with pets (microchip, EU pet passport, rabies vaccination from
 *    12 weeks + 21 days; "apply to private journeys which do not involve a change of ownership or sale"):
 *    https://europa.eu/youreurope/citizens/travel/carry/animal-plant/index_en.htm
 *  - European Commission, movement of pets (commercial movements of dogs within the EU, i.e. a sale or
 *    transfer of ownership, are governed by Delegated Regulation (EU) 2020/688; checked 4 October 2026):
 *    https://food.ec.europa.eu/animals/movement-pets_en
 */
import { DOGS, KENNEL, PUPPY_HOMES } from '../constants';
import type { Language, RouteId } from '../routes';
import { getTranslations } from './translations';
import { fill, formatDate, formatMonth, getLastHomedLitter, getUpcomingLitter, weeksBetween } from './litters';

export interface FaqItem {
  id: string;
  question: string;
  /** One or more paragraphs of plain text (also used verbatim in the FAQPage JSON-LD). */
  answer: string[];
  /** Optional link to a page with more detail. */
  link?: { route: RouteId; label: string; search?: string };
}

export interface FaqSection {
  id: string;
  title: string;
  items: FaqItem[];
}

/** countryKey values in PUPPY_HOMES that are EU member states. */
const EU_COUNTRY_KEYS = new Set(['portugal', 'spain', 'bulgaria']);
const HOME_COUNTRY_KEY = 'bulgaria';

const listJoin = (items: string[], lang: Language): string =>
  new Intl.ListFormat(lang === 'bg' ? 'bg-BG' : 'en-GB', { style: 'long', type: 'conjunction' }).format(items);

/** The FAQ in one language. `today` (YYYY-MM-DD) decides whether the planned litter is still upcoming. */
export const getFaq = (lang: Language, today: string): FaqSection[] => {
  const upcoming = getUpcomingLitter(today);
  const nextMonth = upcoming ? formatMonth(upcoming.expectedMonth, lang) : null;
  const lastLitter = getLastHomedLitter();
  const goHome = lastLitter
    ? {
        born: formatDate(lastLitter.whelpDate, lang),
        home: formatDate(lastLitter.goHomeDate, lang),
        weeks: weeksBetween(lastLitter.whelpDate, lastLitter.goHomeDate),
      }
    : null;
  const locations = getTranslations(lang).puppies.locations as Record<string, string>;
  // The EU travel answer names only the other EU countries our puppies live in (not Bulgaria, not the UK).
  const otherEuCountries = PUPPY_HOMES.filter((home) => EU_COUNTRY_KEYS.has(home.countryKey) && home.countryKey !== HOME_COUNTRY_KEY).map(
    (home) => locations[home.countryKey] ?? home.countryKey,
  );
  const ukPuppies = PUPPY_HOMES.filter((home) => home.countryKey === 'uk').reduce((sum, home) => sum + home.count, 0);
  const profiles = getTranslations(lang).dogs.profiles as Record<string, { name: string }>;
  const dogNames = listJoin(
    DOGS.map((dog) => (profiles[dog.id]?.name ?? dog.name).split(' ')[0]),
    lang,
  );
  const reg = KENNEL.registrationNumber;

  if (lang === 'bg') {
    return [
      {
        id: 'breed',
        title: 'Породата',
        items: [
          {
            id: 'temperament',
            question: 'Какво е португалското водно куче като семейно куче?',
            answer: [
              'Португалското водно куче е работна порода със среден размер от Португалия, където е помагало на рибарите да прибират риба и мрежи. Стандартът на породата на FCI (№ 37) го описва като изключително интелигентно, лесно за обучение и издръжливо куче. Ние го обичаме заради интелигентността и жизнерадостния му дух. Подходящо е за активни семейства, които могат да му осигурят ежедневно движение, обучение и компания.',
            ],
          },
          {
            id: 'exercise',
            question: 'Колко движение му е нужно?',
            answer: [
              'Много. Това е енергична работна порода: предвидете ежедневни разходки и активна игра – най-добре с плуване или апортиране – както и обучение или игри, които занимават ума. Отегченото португалско водно куче само си намира занимания.',
            ],
          },
          {
            id: 'allergies',
            question: 'Хипоалергенно ли е португалското водно куче?',
            answer: [
              'Нито едно куче не е напълно безопасно за алергични хора. Португалското водно куче има козина без подкосъм, която почти не пада, затова много хора с лека алергия към кучета се чувстват добре с него. Алергените обаче се съдържат и в слюнката и кожата, а реакциите са индивидуални. Ако някой у дома има алергия, прекарайте време с кучета от породата, преди да решите, и се посъветвайте с лекар.',
            ],
          },
          {
            id: 'grooming',
            question: 'Каква грижа изисква козината?',
            answer: [
              'Козината расте непрекъснато, затова трябва да се разресва няколко пъти седмично, за да не се сплъстява, и редовно да се подстригва. Двете традиционни подстрижки са „лъвска“ (задната част и муцуната са късо подстригани) и „ретривър“ (около 2,5 см по цялото тяло). Стандартът признава два типа козина: дълга вълниста и по-къса къдрава.',
            ],
          },
          {
            id: 'size',
            question: 'Колко голямо става и колко живее?',
            answer: [
              'Според стандарта на FCI мъжките са 50–57 см при холката и 19–25 кг, а женските – 43–52 см и 16–22 кг. По данни на Канадския клуб за португалско водно куче средната продължителност на живота е 12 до 15 години.',
            ],
          },
        ],
      },
      {
        id: 'puppies',
        title: 'Нашите кученца и списъкът с чакащи',
        items: [
          {
            id: 'next-litter',
            question: 'Кога е следващото ви кучило?',
            answer: [
              nextMonth
                ? fill('Следващото ни кучило се очаква през {month}. Запишете се в списъка с чакащи чрез формата за контакт и ще ви държим в течение.', { month: nextMonth })
                : 'В момента нямаме планирано кучило. Запишете се в списъка с чакащи и ще ви уведомим веднага щом планираме следващото.',
            ],
            link: { route: 'contact', label: 'Запишете се в списъка с чакащи', search: '?interest=waitlist' },
          },
          {
            id: 'waitlist',
            question: 'Как работи списъкът с чакащи?',
            answer: [
              'Приемаме запитвания през цялата година – пишете ни чрез формата за контакт, по имейл или в WhatsApp и ни разкажете за семейството си. След като бременността бъде потвърдена, депозит запазва мястото ви в списъка с чакащи за това кучило. Определяме кое кученце в кое семейство да отиде въз основа на тест за темперамент по Волхард на 7-седмична възраст.',
            ],
            link: { route: 'puppies', label: 'Как да вземете кученце от Стела Марис' },
          },
          ...(goHome
            ? [
                {
                  id: 'go-home-age',
                  question: 'На каква възраст кученцата тръгват към новия си дом?',
                  answer: [
                    `Кученцата от последното ни кучило (родени на ${goHome.born}) тръгнаха към новите си домове от ${goHome.home}, на около ${goHome.weeks} седмици. За семейства от чужбина правилата за пътуване може да означават по-късна дата – вижте въпросите за пътуване по-долу.`,
                  ],
                },
              ]
            : []),
          {
            id: 'raising',
            question: 'Как отглеждате кученцата?',
            answer: [
              'Кученцата растат у дома, при нашето семейство. През първите седмици правим ранна неврологична стимулация – кратки ежедневни упражнения (програмата Bio-Sensor), които обикновено се правят между 3-тия и 16-ия ден. Всеки ден ги гушкаме и ги запознаваме с нови хора, звуци и обстановка, а на 7 седмици правим тест за темперамент по Волхард, за да намерим най-подходящото семейство за всяко кученце.',
            ],
          },
          {
            id: 'health-testing',
            question: 'Имат ли родителите здравни изследвания?',
            answer: [
              `Да. ${dogNames} имат ДНК тестове за наследствени заболявания, известни в породата, сред които GM1 ганглиозидоза и prcd-PRA. Всички резултати са публикувани на страницата за нашите кучета, повечето с обяснение на разбираем език.`,
            ],
            link: { route: 'dogs', label: 'Здравните изследвания на нашите кучета' },
          },
          {
            id: 'price-terms',
            question: 'Колко струва кученце? Какво включва, какъв е депозитът и какви са условията?',
            answer: [
              'Моля, свържете се с нас – обясняваме актуалната цена, депозита, какво получавате заедно с кученцето и условията лично, за да можете да зададете всичките си въпроси.',
            ],
            link: { route: 'contact', label: 'Свържете се с нас' },
          },
          {
            id: 'visits',
            question: 'Може ли да ви посетим?',
            answer: [
              'Да, само с предварителна уговорка. Живеем в София, близо до Витоша. Свържете се с нас, за да уговорим посещение.',
            ],
            link: { route: 'contact', label: 'Свържете се с нас' },
          },
          {
            id: 'registration',
            question: 'Регистриран ли е развъдникът?',
            answer: [
              `Да. Стела Марис (Stella Maris) е регистриран във FCI развъдник, № ${reg}. През март 2026 г. АГРО ТВ разказа нашата история и представи Стели и Митко като създателите на първия развъдник за португалско водно куче в България.`,
            ],
            link: { route: 'about', label: 'Нашата история' },
          },
        ],
      },
      {
        id: 'travel',
        title: 'Пътуване в чужбина',
        items: [
          {
            id: 'travel-eu',
            question: 'Може ли да заведем кученце от България в друга държава от ЕС?',
            answer: [
              `Да${otherEuCountries.length ? ` – кученца от нашите кучила вече живеят в ${listJoin(otherEuCountries, lang)}` : ''}. Според правилата на ЕС за пътуване с домашни любимци кучето трябва да има микрочип, европейски паспорт за домашни любимци и валидна ваксина срещу бяс. Първата ваксина срещу бяс се поставя най-рано на 12-седмична възраст и след нея трябва да изминат поне 21 дни преди пътуването, така че на практика кученцето може да пътува на около 15 седмици.`,
              'Тези правила се отнасят само за частни пътувания без продажба или смяна на собственика. Когато купувате кученце от развъдчик в друга държава от ЕС, преместването му е търговско и за него важат отделни изисквания на законодателството на ЕС за здравеопазването на животните (Делегиран регламент (ЕС) 2020/688). Обсъдете с нас документите и сроковете и проверете актуалните правила на вашата държава с ветеринарен лекар, преди да планирате пътуването.',
            ],
          },
          {
            id: 'travel-non-eu',
            question: 'А за Обединеното кралство и държави извън ЕС?',
            answer: [
              `${ukPuppies === 1 ? 'Едно от нашите кученца живее в Обединеното кралство. ' : ukPuppies > 1 ? 'Кученца от нашите кучила живеят и в Обединеното кралство. ' : ''}Правилата за Великобритания и за държави извън ЕС са различни и се променят – някои държави например изискват кръвен тест за антитела срещу бяс. Проверете официалните правила за внос на домашни любимци на съответната държава, преди да планирате, а ние с удоволствие ще обсъдим сроковете с вас.`,
            ],
          },
        ],
      },
    ];
  }

  return [
    {
      id: 'breed',
      title: 'The breed',
      items: [
        {
          id: 'temperament',
          question: 'What is the Portuguese Water Dog like as a family dog?',
          answer: [
            'The Portuguese Water Dog is a medium-sized working breed from Portugal, where it helped fishermen retrieve fish and nets. The FCI breed standard (No. 37) describes it as exceptionally intelligent, easy to train and resistant to fatigue. We love the breed for its intelligence and joyful spirit. It suits active families who can offer daily exercise, training and company.',
          ],
        },
        {
          id: 'exercise',
          question: 'How much exercise does a Portuguese Water Dog need?',
          answer: [
            'A lot. This is an energetic working breed: plan for daily walks and active play, ideally with swimming or retrieving, plus training or games that keep its mind busy. A bored Portuguese Water Dog will find its own entertainment.',
          ],
        },
        {
          id: 'allergies',
          question: 'Are Portuguese Water Dogs hypoallergenic?',
          answer: [
            'No dog is completely allergen-free. Portuguese Water Dogs have a coat with no undercoat that sheds very little, so many people with mild dog allergies cope well with them. Allergens are also found in saliva and skin flakes, though, and reactions differ from person to person. If anyone in your family has allergies, spend time with the breed before you decide and talk to your doctor.',
          ],
        },
        {
          id: 'grooming',
          question: 'How much grooming does the coat need?',
          answer: [
            'The coat keeps growing, so it needs brushing several times a week to prevent mats, and regular clipping. The two traditional clips are the lion clip (hindquarters and muzzle clipped short) and the retriever clip (about 2.5 cm all over). The breed standard recognises two coat types: long and wavy, and shorter and curly.',
          ],
        },
        {
          id: 'size',
          question: 'How big do Portuguese Water Dogs get, and how long do they live?',
          answer: [
            'According to the FCI breed standard, males are 50–57 cm at the withers and weigh 19–25 kg; females are 43–52 cm and 16–22 kg. The Portuguese Water Dog Club of Canada gives an average life expectancy of 12 to 15 years.',
          ],
        },
      ],
    },
    {
      id: 'puppies',
      title: 'Our puppies and the waitlist',
      items: [
        {
          id: 'next-litter',
          question: 'When is your next litter?',
          answer: [
            nextMonth
              ? fill('Our next litter is expected in {month}. Join our waitlist through the contact form and we will keep you updated.', { month: nextMonth })
              : 'We do not have a litter planned at the moment. Join our waitlist and we will let you know as soon as we plan the next one.',
          ],
          link: { route: 'contact', label: 'Join the waitlist', search: '?interest=waitlist' },
        },
        {
          id: 'waitlist',
          question: 'How does your waitlist work?',
          answer: [
            'We accept applications all year round: send us a message through the contact form, by email or on WhatsApp and tell us about your family. Once a pregnancy is confirmed, a deposit holds your place on the waitlist for that litter. We match puppies to families based on a Volhard temperament test at 7 weeks of age.',
          ],
          link: { route: 'puppies', label: 'How to get a Stella Maris puppy' },
        },
        ...(goHome
          ? [
              {
                id: 'go-home-age',
                question: 'At what age do your puppies go home?',
                answer: [
                  `Puppies from our last litter (born ${goHome.born}) went home from ${goHome.home}, at about ${goHome.weeks} weeks old. For families abroad, travel rules can mean a later date: see the travel questions below.`,
                ],
              },
            ]
          : []),
        {
          id: 'raising',
          question: 'How do you raise your puppies?',
          answer: [
            'Our puppies grow up in our home, with our family. In the first weeks we do Early Neurological Stimulation: short daily handling exercises (the Bio-Sensor programme) that are usually done between days 3 and 16. Every day we handle the puppies and introduce them to new people, sounds and surroundings, and at 7 weeks we do a Volhard temperament test to find the right family for each puppy.',
          ],
        },
        {
          id: 'health-testing',
          question: 'Are the parents health tested?',
          answer: [
            `Yes. ${dogNames} are DNA-tested for inherited diseases known in the breed, including GM1 gangliosidosis and prcd-PRA. You will find every result on our dogs page, most with a plain-language explanation.`,
          ],
          link: { route: 'dogs', label: "Our dogs' health results" },
        },
        {
          id: 'price-terms',
          question: 'How much does a puppy cost? What is included, and what are the deposit and terms?',
          answer: [
            'Please contact us. We explain the current price, the deposit, what comes with your puppy and our terms personally, so you can ask all your questions.',
          ],
          link: { route: 'contact', label: 'Contact us' },
        },
        {
          id: 'visits',
          question: 'Can we visit you?',
          answer: [
            'Yes, by appointment only. We live in Sofia, Bulgaria, near Vitosha mountain. Get in touch to arrange a visit.',
          ],
          link: { route: 'contact', label: 'Contact us' },
        },
        {
          id: 'registration',
          question: 'Is Stella Maris a registered kennel?',
          answer: [
            `Yes. Stella Maris is an FCI registered kennel, No. ${reg}. In March 2026 the Bulgarian channel AGRO TV told our story and described Steli and Mitko as the creators of the first Portuguese Water Dog kennel in Bulgaria.`,
          ],
          link: { route: 'about', label: 'Our story' },
        },
      ],
    },
    {
      id: 'travel',
      title: 'Travelling abroad',
      items: [
        {
          id: 'travel-eu',
          question: 'Can I take a puppy from Bulgaria to another EU country?',
          answer: [
            `Yes${otherEuCountries.length ? `: puppies from our litters already live in ${listJoin(otherEuCountries, lang)}` : ''}. Under the EU pet travel rules, a dog travelling between EU countries needs a microchip, an EU pet passport and a valid rabies vaccination. The first rabies vaccination can be given from 12 weeks of age, and you must wait at least 21 days after it before travelling, so in practice a puppy can travel from about 15 weeks old.`,
            'These rules are only for private journeys, without a sale or change of owner. Taking home a puppy you have bought from a breeder in another EU country is a commercial movement, and it has its own requirements under EU animal-health law (Delegated Regulation (EU) 2020/688). Talk to us about the paperwork and the timing, and check the current rules of your country with your vet before you plan the trip.',
          ],
        },
        {
          id: 'travel-non-eu',
          question: 'What about the UK and countries outside the EU?',
          answer: [
            `${ukPuppies === 1 ? 'One of our puppies lives in the United Kingdom. ' : ukPuppies > 1 ? 'Puppies from our litters also live in the United Kingdom. ' : ''}Rules for Great Britain and for countries outside the EU are different and change from time to time; some countries, for example, require a rabies antibody blood test. Check your government's official pet import rules before you plan, and we will gladly talk the timing through with you.`,
          ],
        },
      ],
    },
  ];
};
