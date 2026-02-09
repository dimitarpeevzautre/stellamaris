
import { Dog, Litter } from './types';

export const SITE_NAME = "Stella Maris Kennel";
export const TAGLINE = "Breeding quality PWD (Portuguese Water Dog) dogs since 2005.";
export const CONTACT_EMAIL = "hello@stellamaris.dog";
export const CONTACT_PHONE = "+359 897 014 015";
export const SOCIAL_FACEBOOK = "https://www.facebook.com/portuguesewaterdogbulgaria/";
export const SOCIAL_INSTAGRAM = "https://www.instagram.com/pwdbulgaria";

export const ABOUT_TEXT = `We are Steli and Mitko, and welcome to our family! Stella Maris is our labor of love, a home filled with the laughter of our three daughters and the wagging tails of our Portuguese Water Dogs. To us, these dogs aren't just pets; they are family members who share every part of our lives.

We believe that a dog’s place is in the heart of the home. Our dogs live inside with us, enjoying the comfort of our sofas and the warmth of our daily routine. It is this close bond that nurtures their happy, affectionate, and well-balanced temperaments.

We are a family of adventurers at heart. Our favorite times are spent traveling together in our camper, discovering new horizons with the whole pack. Whether on the road or at home, life is simply better when we are all together.`;

export const FEATURES = [
  {
    title: "Years of Experience",
    description: "We've seen it all and learned from the best, refining our breeding practices and canine care expertise over the years..."
  },
  {
    title: "Daily Puppy Handling",
    description: "We believe that early socialization is crucial for happy, well-adjusted dogs. That's why we handle our puppies daily..."
  },
  {
    title: "Passion + Integrity",
    description: "Our love for dogs is at the heart of everything we do. We're committed to ethical breeding practices, prioritizing the health and well-being of our dogs above all else."
  },
  {
    title: "It's Not Just A Hobby",
    description: "Raising and caring for dogs is more than just a job for us – it's our passion and our life's work."
  }
];

export const TESTIMONIALS = [
  {
    text: "Stella Maris are an example of dedication, full care and true love for all their small and large dogs. Thank you, Steli and Mitko, for the wonderful puppy, for the ongoing support and for all the advice.",
    author: "Aria Nereya's Family"
  },
  {
    text: "Stella Maris made the whole process so easy, and we felt confident bringing our new puppy home, even though she had a long plane trip.",
    author: "Amaya's Family in London"
  },
  {
    text: "Alma Sol is a bundle of joy, I can't imagine my life without this little cuteness. Thank you Steli for your care and bringing her to me!",
    author: "Rozalina Dudekova"
  }
];

export const ABOUT_GALLERY = [
    "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000&auto=format&fit=crop"
];

export const DOGS: Dog[] = [
  {
    id: 'sire-1',
    name: 'Arthur',
    registeredName: 'Arthur Rubinstein Do Veleiro Nagual',
    breed: 'Portuguese Water Dog',
    gender: 'Male',
    dob: '2020-05-15',
    image: '/images/arthy.jpg',
    description: 'Arthy has been a part of our family since 2018. We traveled through Europe, where Arthur won every podium we managed to get him on. He is a lovely companion to our kids. He possesses a strong, spirited temperament and a classic wavy coat. Arthur is known for his incredible focus and drive, making him not only a beautiful representation of the breed but a highly capable working dog. He loves the water and has an natural affinity for retrieving.',
    healthClearances: [
      'GM1 - Genotype N/N (clear)',
      'prcd-PRA - Genotype N/Pra',
      'HIPS: A',
      'Eyes: Clear',
      'Improper Coat: Genotype N/N',
      'CJM - Genotype N/N',
      'CDDY and IVDD risk - Genotype N/N'
    ],
    prizes: ['Spanish Champion - World Dog Show 2022', 'Second Place - Geneva Grand Prix 2023', 'International multi Champion and Grand Champion of - Spain, Greece, Bulgaria, Romania, Turkey, Serbia']
  },
  {
    id: 'dam-1',
    name: 'Riva Rosa',
    registeredName: 'Riva Rosa Do Lusiadas',
    breed: 'Portuguese Water Dog',
    gender: 'Female',
    dob: '2021-02-10',
    image: '/images/riva.jpg',
    description: `We first met Riva in Florence in 2023, and she has been the heart of our kennel ever since. Playful and incredibly intelligent, she embodies everything we love about the Portuguese Water Dog. Beyond her spirited personality, Riva comes from a distinguished champion lineage, inheriting the grace and excellence of her ancestors.

She possesses the most gentle soul and has proven to be a wonderful, intuitive mother. Her striking brown wavy coat is amazing to the touch, and she is never one to shy away from affection, often insisting on cuddles and hugs. While she is a soft-hearted companion, she is also a fierce protector of both her puppies and our children.

Riva is a true advocate for her breed, balancing her life at home with a meaningful career at local kindergartens. There, she helps children feel calm and confident, using her steady temperament to build their trust in dogs. She is truly a special girl who represents the very best of her heritage.`,
    healthClearances: [
      'prcd-PRA - Genotype N/N (A)',
      'GM1 - Genotype N/N',
      'eo-PRA - Genotype N/N',
      'Improper Coat - Genotype N/N',
      'CDPA - Genotype N/N',
      'CDDY and IVDD Risk - Genotype N/N',
      'RBP4 - Genotype N/N'
    ],
    prizes: [
      'Junior Winner of Geneva Grand Prix 2023',
      'Intermediate Class Winner of World Dog Show 2024',
      'Junior Champion of Turkey',
      'Champion of Bulgaria'
    ]
  }
];

export const LITTERS: Litter[] = [
  {
    id: 'litter-2025-december',
    sire: 'Arthur Rubinstein',
    dam: 'Riva Rosa',
    whelpDate: '2025-12-25',
    goHomeDate: '2026-03-01',
    status: 'Available',
    puppiesCount: 9,
    description: 'The Kings litter. Riva gave birth on the 25th of December of 9 healthy strong boys. 8 of them are brown, what are the chances?',
    image: '/images/kings.png',
    gallery: [
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1000&auto=format&fit=crop'
    ]
  }
];
