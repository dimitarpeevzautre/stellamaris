/**
 * A photo from assets-src/images (referenced by its public JPEG URL) and the translation key
 * of its alt text in utils/i18n/{en,bg}.ts. Keeping both together means the order of a
 * gallery and its descriptions can never drift apart.
 */
export interface Photo {
  src: string;
  altKey: string;
}

/** A text in both site languages (for data that lives in constants.ts rather than utils/i18n). */
export interface Localized {
  en: string;
  bg: string;
}

/**
 * Health tests shown on the Our Dogs page. Each key has a name and a plain-language
 * explanation under `health.tests.<key>` in utils/i18n/{en,bg}.ts (both languages).
 */
export type HealthTestKey =
  | 'hips'
  | 'eyes'
  | 'gm1'
  | 'prcd_pra'
  | 'eo_pra'
  | 'improper_coat'
  | 'cddy_ivdd'
  | 'cjm'
  | 'cdpa'
  | 'rbp4';

/**
 * - clear: DNA test with no copy of the variant (N/N), or a clear clinical exam
 * - carrier: one copy of a recessive variant; the dog itself is not affected
 * - graded: a graded result such as a hip score (see `value`)
 */
export type HealthStatus = 'clear' | 'carrier' | 'graded';

export interface HealthResult {
  test: HealthTestKey;
  status: HealthStatus;
  /** The result exactly as recorded (genotype such as 'N/N', or a grade such as 'A'). */
  value?: string;
}

export interface Dog {
  /** Stable id. Description and titles live in utils/i18n/{en,bg}.ts under `dogs.profiles.<id>`. */
  id: string;
  name: string;
  registeredName: string;
  breed: string;
  gender: 'Male' | 'Female';
  /** Date of birth (YYYY-MM-DD) from the pedigree. Leave out until confirmed; never shown when missing. */
  dob?: string;
  image: string;
  healthResults: HealthResult[];
}

export interface Litter {
  id: string;
  /** Key under `puppies.litters.<key>` in utils/i18n/{en,bg}.ts (name, description, photo alts). */
  translationKey: string;
  sire: string;
  dam: string;
  whelpDate: string;
  goHomeDate: string;
  status: 'Planned' | 'Born' | 'Available' | 'Sold Out';
  puppiesCount: number;
  image: Photo;
  gallery?: Photo[];
}

/**
 * A litter we are planning but which has not been born yet. Only facts that are known go
 * here: leave sire/dam out until the pairing is confirmed. The site announces the first
 * planned litter whose expected month has not passed yet, and hides it automatically after.
 */
export interface PlannedLitter {
  id: string;
  /** Expected month of birth, 'YYYY-MM'. */
  expectedMonth: string;
  sire?: string;
  dam?: string;
}

/** A place where puppies from our litters live now (the map on the Puppies page). */
export interface PuppyHome {
  id: string;
  /** Key under `puppies.locations` in utils/i18n/{en,bg}.ts. */
  countryKey: string;
  cityKey?: string;
  count: number;
  lat: number;
  lng: number;
}

export interface AvailablePuppy {
  id: string;
  name: string;
  litterId: string;
  gender: 'Male' | 'Female';
  color: Localized;
  description: Localized;
  images: string[];
}
