import type { AvailablePuppy, Dog, Litter, Photo, PlannedLitter, PuppyHome } from './types';

export const SITE_NAME = "Stella Maris Kennel";
export const CONTACT_EMAIL = "hello@stellamaris.dog";
export const CONTACT_PHONE = "+359 897 014 015";
export const CONTACT_WHATSAPP = `https://wa.me/${CONTACT_PHONE.replace(/\D/g, '')}`;
export const SOCIAL_FACEBOOK = "https://www.facebook.com/portuguesewaterdogbulgaria/";
export const SOCIAL_INSTAGRAM = "https://www.instagram.com/pwdbulgaria";

/** "Life at Stella Maris" carousel on the About page. Alt texts: about.gallery.* in utils/i18n/{en,bg}.ts. */
export const ABOUT_GALLERY: Photo[] = [
  { src: '/images/gallery-story/portuguese-water-dog-family-pisa.jpg', altKey: 'about.gallery.pisa' },
  { src: '/images/gallery-story/portuguese-water-dog-beach-walk.jpg', altKey: 'about.gallery.beach_walk' },
  { src: '/images/gallery-story/portuguese-water-dogs-mountain-town.jpg', altKey: 'about.gallery.mountain_town' },
  { src: '/images/gallery-story/portuguese-water-dogs-seaside-wall.jpg', altKey: 'about.gallery.seaside_wall' },
  { src: '/images/gallery-story/portuguese-water-dogs-forest-walk.jpg', altKey: 'about.gallery.forest_walk' },
  { src: '/images/gallery-story/portuguese-water-dog-sofa.jpg', altKey: 'about.gallery.sofa' },
  { src: '/images/gallery-story/portuguese-water-dogs-with-child.jpg', altKey: 'about.gallery.with_child' },
  { src: '/images/gallery-story/portuguese-water-dog-kayak.jpg', altKey: 'about.gallery.kayak' },
  { src: '/images/gallery-story/portuguese-water-dog-paddleboard.jpg', altKey: 'about.gallery.paddleboard' },
  { src: '/images/gallery-story/portuguese-water-dog-beach.jpg', altKey: 'about.gallery.beach' },
  { src: '/images/gallery-story/portuguese-water-dog-show-podium.jpg', altKey: 'about.gallery.show_podium' },
  { src: '/images/gallery-story/portuguese-water-dogs-water-rescue-training.jpg', altKey: 'about.gallery.water_rescue' }
];

/** Home page hero (the LCP image). routes.ts preloads it with the same srcset/sizes. */
export const HOME_HERO_IMAGE = {
  src: '/images/puppies.jpg',
  // The hero is 85vh tall with object-cover, so on tall (portrait) screens the 3:2 photo is
  // rendered wider than the viewport: 85vh * 1.5 ≈ 128vh.
  sizes: '(max-aspect-ratio: 5/4) 128vh, 100vw',
};

/** Photo column on Our Dogs: full width on phones/tablets, half of the max-w-7xl container from lg up.
 * routes.ts preloads the first dog's photo (the page's LCP image) with these sizes. */
export const DOG_PHOTO_SIZES = '(min-width: 1280px) 576px, (min-width: 1024px) 45vw, 100vw';

/** Decorative background of the testimonials section (small blurred copy, see scripts/encode-images.mjs). */
export const TESTIMONIALS_BACKGROUND_IMAGE = '/images/steliandpuppy.jpg';

/**
 * Facts about the kennel used across the site, the structured data (JSON-LD) and /llms.txt.
 * Only add facts that can be backed up; see the comments for the source of each.
 */
export const KENNEL = {
  /** Kennel registration number as shown on the site since launch. */
  registrationNumber: '166/2024',
  /** Founders as they present themselves on the site (first names only). */
  founders: ['Steli', 'Mitko'],
  /** Cyrillic spelling of the brand, used by Bulgarian visitors who heard the name on TV or Facebook. */
  nameBg: 'Стела Марис',
  /**
   * Independent press coverage. Source: AGRO TV, 31 March 2026, "Домът на Португалското водно куче:
   * Когато страстта се превърне в съдба" (fetched 3 Oct 2026). The article calls Steli and Mitko
   * "създателите на първия развъдник за Португалско водно куче в България".
   */
  press: [
    {
      id: 'agrotv-2026',
      publisher: 'AGRO TV',
      url: 'https://agrotv.bg/2026/03/31/%D0%B4%D0%BE%D0%BC%D1%8A%D1%82-%D0%BD%D0%B0-%D0%BF%D0%BE%D1%80%D1%82%D1%83%D0%B3%D0%B0%D0%BB%D1%81%D0%BA%D0%BE%D1%82%D0%BE-%D0%B2%D0%BE%D0%B4%D0%BD%D0%BE-%D0%BA%D1%83%D1%87%D0%B5-%D0%BA%D0%BE%D0%B3/',
      headline: 'Домът на Португалското водно куче: Когато страстта се превърне в съдба',
      datePublished: '2026-03-31',
      inLanguage: 'bg',
    },
  ],
} as const;

/**
 * Date the litter/puppy information (LITTERS, PLANNED_LITTERS, AVAILABLE_PUPPIES, PUPPY_HOMES)
 * was last checked. Shown as "Last updated" on the Puppies page and used in the structured data.
 * Update it whenever you change any of those lists.
 */
export const LITTERS_UPDATED = '2026-10-03';

/** Date the FAQ answers (utils/faq.ts) were last reviewed. Shown on the FAQ page. */
export const FAQ_UPDATED = '2026-10-04';

/** Date the privacy policy (utils/privacyPolicy.ts) was last changed. Shown on the Privacy page. */
export const PRIVACY_UPDATED = '2026-10-04';

export const DOGS: Dog[] = [
  {
    id: 'arthur',
    name: 'Arthur',
    registeredName: 'Arthur Rubinstein Do Veleiro Nagual',
    breed: 'Portuguese Water Dog',
    gender: 'Male',
    // dob: removed. The old value ('2020-05-15') contradicted the bio and the old site ('2019');
    // add the date from Arthur's pedigree before showing it anywhere.
    image: '/images/arthy.jpg',
    healthResults: [
      { test: 'hips', status: 'graded', value: 'A' },
      { test: 'eyes', status: 'clear' },
      { test: 'gm1', status: 'clear', value: 'N/N' },
      // Recorded as 'N/Pra': one copy of the prcd-PRA variant (carrier, not affected).
      { test: 'prcd_pra', status: 'carrier', value: 'N/PRA' },
      { test: 'improper_coat', status: 'clear', value: 'N/N' },
      { test: 'cjm', status: 'clear', value: 'N/N' },
      { test: 'cddy_ivdd', status: 'clear', value: 'N/N' },
    ],
  },
  {
    id: 'riva',
    name: 'Riva Rosa',
    registeredName: 'Riva Rosa Do Lusiadas',
    breed: 'Portuguese Water Dog',
    gender: 'Female',
    // dob: removed. The old value ('2021-02-10') does not fit her junior (2023) and intermediate
    // class (2024) results; add the date from Riva's pedigree before showing it anywhere.
    image: '/images/riva.jpg',
    healthResults: [
      { test: 'gm1', status: 'clear', value: 'N/N' },
      // Recorded as 'N/N (A)': clear.
      { test: 'prcd_pra', status: 'clear', value: 'N/N' },
      { test: 'eo_pra', status: 'clear', value: 'N/N' },
      { test: 'improper_coat', status: 'clear', value: 'N/N' },
      { test: 'cdpa', status: 'clear', value: 'N/N' },
      { test: 'cddy_ivdd', status: 'clear', value: 'N/N' },
      { test: 'rbp4', status: 'clear', value: 'N/N' },
    ],
  },
];

export const LITTERS: Litter[] = [
  {
    id: 'litter-2025-december',
    translationKey: 'kings',
    sire: 'Arthur Rubinstein',
    dam: 'Riva Rosa',
    whelpDate: '2025-12-25',
    goHomeDate: '2026-03-01',
    status: 'Sold Out',
    puppiesCount: 9,
    image: { src: '/images/gallery-kings/kings-litter-brown-puppy.jpg', altKey: 'puppies.litters.kings.photo_brown_puppy' },
    gallery: [
      { src: '/images/gallery-kings/kings-litter-newborn-puppy.jpg', altKey: 'puppies.litters.kings.photo_newborn' },
      { src: '/images/gallery-kings/kings-litter-brown-puppy.jpg', altKey: 'puppies.litters.kings.photo_brown_puppy' }
    ]
  }
];

/**
 * Litters we are planning. The announcement bar, the Puppies page, the FAQ and /llms.txt all
 * read from here; an entry disappears from the site automatically once its month has passed.
 * Add sire/dam only once the pairing is confirmed.
 */
export const PLANNED_LITTERS: PlannedLitter[] = [
  { id: 'litter-2027-january', expectedMonth: '2027-01' }
];

/**
 * Where some of our puppies live today (the map on the Puppies page). This is not a complete
 * list of every puppy we have bred, and the page says so.
 */
export const PUPPY_HOMES: PuppyHome[] = [
  { id: 'portugal', countryKey: 'portugal', count: 2, lat: 39.3999, lng: -8.2245 },
  { id: 'spain', countryKey: 'spain', count: 1, lat: 40.4637, lng: -3.7492 },
  { id: 'uk', countryKey: 'uk', cityKey: 'london', count: 1, lat: 51.5074, lng: -0.1278 },
  { id: 'bulgaria', countryKey: 'bulgaria', cityKey: 'sofia', count: 4, lat: 42.6977, lng: 23.3219 },
];

export const AVAILABLE_PUPPIES: AvailablePuppy[] = [];
