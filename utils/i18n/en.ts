/**
 * All English UI text. Every key must exist in both utils/i18n/en.ts and utils/i18n/bg.ts
 * (bg.ts is typed as `Translations`, so a missing or extra key fails the type check).
 * Placeholders like {month} are filled in by the components.
 *
 * Facts in this file (titles, test results, dates, press) must be backed up. Sources:
 * the kennel's own data in constants.ts and the AGRO TV feature of 31 March 2026 (see KENNEL.press).
 *
 * Each language is its own chunk: the browser loads only the table of the page's language
 * (see utils/translations.ts).
 */
const en = {
    nav: {
        home: 'HOME',
        our_story: 'OUR STORY',
        our_dogs: 'OUR DOGS',
        puppies: 'PUPPIES',
        faq: 'FAQ',
        contact: 'CONTACT',
        top_announcement: 'Next litter expected in {month} –',
        join_waitlist: 'Join the waitlist',
        subtitle: 'KENNEL',
        language: 'Language',
        open_menu: 'Open menu',
        close_menu: 'Close menu',
        main_menu: 'Main menu',
        skip_to_content: 'Skip to main content'
    },
    home: {
        hero_title: 'Portuguese Water Dog Kennel\nin Sofia, Bulgaria',
        hero_image_alt: 'A litter of black Portuguese Water Dog puppies and one brown puppy posed against a blue backdrop',
        hero_desc: 'We are Steli and Mitko, a family in Sofia raising Portuguese Water Dogs at home with our three daughters. Our dogs, Arthur and Riva, are health-tested show champions, and we keep a waitlist for each planned litter.',
        puppy_inquiry: 'PUPPY INQUIRY',
        our_story: 'OUR STORY',
        features_title: 'What sets us apart',
        happy_families: 'Happy families',
        fci_registered: 'FCI registered kennel · No. 166/2024',
        feature1: { title: 'Dogs who live with us', desc: 'Arthur and Riva live in the house with our family, and our puppies grow up at home, surrounded by children, everyday sounds and visitors.' },
        feature2: { title: 'Health-tested parents', desc: 'Our breeding dogs are DNA-tested for inherited diseases known in the breed, including GM1 and prcd-PRA. Every result is listed on our dogs page.' },
        feature3: { title: 'A good start for every puppy', desc: 'Early Neurological Stimulation in the first weeks, daily handling and socialisation, and a Volhard temperament test at 7 weeks to find the right family for each puppy.' },
        feature4: { title: 'Support after you go home', desc: 'We choose every family with care and are here with advice whenever you need it, long after your puppy has left us.' },
        meet_dogs_link: "Meet Arthur and Riva and see their health results",
        faq_link: 'Questions about the breed or the waitlist? Read our FAQ',
        testimonial1: { text: 'Stella Maris are an example of dedication, full care and true love for all their small and large dogs. Thank you, Steli and Mitko, for the wonderful puppy, for the ongoing support and for all the advice.', author: "Aria Nereya's family" },
        testimonial2: { text: 'Stella Maris made the whole process so easy, and we felt confident bringing our new puppy home, even though she had a long plane trip.', author: "Amaya's family, London" },
        testimonial3: { text: "Alma Sol is a bundle of joy, I can't imagine my life without this little cuteness. Thank you, Steli, for your care and bringing her to me!", author: 'Rozalina Dudekova' },
        testimonials_more: 'Follow our puppy families on Facebook'
    },
    about: {
        title: 'Our Story: Portuguese Water Dogs at Home in Sofia',
        subtitle: 'FCI registered kennel · No. 166/2024',
        story_p1: `We are Steli and Mitko, and welcome to our family! Stella Maris is our labour of love, a home filled with the laughter of our three daughters and the wagging tails of our Portuguese Water Dogs. To us, these dogs aren't just pets; they are family members who share every part of our lives.`,
        story_p2: `We believe that a dog's place is in the heart of the home. Our dogs live inside with us, enjoying the comfort of our sofas and the warmth of our daily routine. It is this close bond that nurtures their happy, affectionate and well-balanced temperaments.`,
        story_p3: `We are a family of adventurers at heart. Our favourite times are spent travelling together in our camper, discovering new horizons with the whole pack. Whether on the road or at home, life is simply better when we are all together.`,
        journey_title: 'How it started',
        journey: 'Our journey with the breed began almost by chance and took a lot of research and patience. We travelled to Portugal to bring Arthur home as a puppy. After years of waiting and many refusals, established European breeders trusted us with Riva, and that was the start of our breeding programme.',
        name_meaning: '"Stella Maris" is Latin for "Star of the Sea", a fitting name for a kennel devoted to the water dog of the Portuguese fishermen.',
        philosophy: 'We fell in love with the Portuguese Water Dog for its incredible intelligence and joyful spirit. Raising these dogs takes dedication, but the reward is a loyal best friend who wants nothing more than to be by your side. Our home near Vitosha mountain gives our dogs the freedom to run, play and explore the nature they adore.',
        press_title: 'In the press',
        press_text: 'In March 2026 the Bulgarian channel AGRO TV told our story and described Steli and Mitko as the creators of the first Portuguese Water Dog kennel in Bulgaria.',
        press_link: 'Read the AGRO TV article (in Bulgarian)',
        standards_title: 'Our standards',
        standards: [
            'FCI registered kennel (No. 166/2024)',
            'DNA health tests for our breeding dogs',
            'Early Neurological Stimulation',
            'Volhard temperament test at 7 weeks',
            'Puppies raised in our home',
            'Lifetime breeder support'
        ],
        dogs_link: 'Meet our dogs, Arthur and Riva',
        puppies_link: 'See our litters and how the waitlist works',
        gallery_title: 'Life at Stella Maris',
        family_photo_alt: 'Steli and Mitko surrounded by their Portuguese Water Dogs and puppies',
        // Alt texts of the "Life at Stella Maris" photos (ABOUT_GALLERY in constants.ts), describing what each photo shows.
        gallery: {
            pisa: 'Black Portuguese Water Dog travelling with the family at the Leaning Tower of Pisa, Italy',
            beach_walk: 'Woman in a long summer dress walking barefoot on a sandy beach with a black Portuguese Water Dog',
            mountain_town: 'Black and brown Portuguese Water Dogs sitting with a woman inside a large mirrored sculpture in a mountain town',
            seaside_wall: 'Couple sitting on an old stone wall above a bay with a brown and a black Portuguese Water Dog',
            forest_walk: 'Two girls on a forest path with a black and a brown Portuguese Water Dog walking ahead of them',
            sofa: 'Black Portuguese Water Dog resting on the living-room sofa under a world map',
            with_child: 'Little girl on a bed with a black and a brown Portuguese Water Dog',
            kayak: 'Kayaking at sunset with a black Portuguese Water Dog sitting in the kayak',
            paddleboard: 'Black Portuguese Water Dog in a red life vest on a stand-up paddleboard with a woman in clear sea water',
            beach: 'Black Portuguese Water Dog in an orange harness sitting next to a man on a sandy beach',
            show_podium: 'Black Portuguese Water Dog posed by its handler on the second-place podium at a dog show, with a trophy',
            water_rescue: 'Brown and black Portuguese Water Dogs swimming with instructors in wetsuits during water rescue training'
        }
    },
    dogs: {
        title: 'Our Portuguese Water Dogs: Arthur and Riva',
        subtitle: 'Meet the pair at the heart of our breeding programme, chosen for their health, temperament and breed type.',
        male_role: 'The sire',
        female_role: 'The dam',
        sire_alt: 'Portuguese Water Dog sire at Stella Maris Kennel',
        dam_alt: 'Portuguese Water Dog dam at Stella Maris Kennel',
        achievements: 'Show titles and results',
        health: 'Health test results',
        quote: '"Our dogs are our family. We aim to raise healthy, happy dogs that shine in the show ring, in the water and in your heart."',
        philosophy: 'The Stella Maris philosophy',
        puppies_link: "See Arthur and Riva's litters and join the waitlist",
        faq_link: 'Questions about health testing or the breed? Read our FAQ',
        // Keyed by the dog's id in constants.ts (DOGS), so any new dog only needs a new entry here.
        profiles: {
            arthur: {
                name: 'Arthur',
                description: 'Arthy came to us from Portugal as a puppy and is a much-loved companion to our children. He started his show career relatively late and has since won titles at shows across Europe. He has a strong, spirited temperament and a classic wavy coat, and he is known for his focus and drive, which make him both a beautiful representative of the breed and a capable working dog. He loves the water and is a natural retriever.',
                prizes: [
                    'Champion of Spain – World Dog Show 2022, Madrid',
                    'Second place – Geneva Grand Prix 2023',
                    'International multi-champion',
                    'Champion and Grand Champion of Spain, Greece, Bulgaria, Romania, Turkey and Serbia'
                ]
            },
            riva: {
                name: 'Riva Rosa',
                description: `We first met Riva in Florence in 2023, and she has been the heart of our kennel ever since. Playful and very intelligent, she embodies everything we love about the Portuguese Water Dog.

She has the gentlest soul and has proven to be a wonderful, intuitive mother. Her brown wavy coat is lovely to the touch, and she never shies away from affection; she often insists on cuddles. Soft-hearted as she is, she is also a devoted protector of her puppies and of our children.

Riva is a true ambassador for her breed. Alongside her life at home, she works with children at local kindergartens, where she helps them feel calm and confident and builds their trust in dogs. She is truly a special girl.`,
                prizes: [
                    'Junior Winner – Geneva Grand Prix 2023',
                    'Intermediate Class Winner – World Dog Show 2024',
                    'Junior Champion of Turkey',
                    'Champion of Bulgaria'
                ]
            }
        }
    },
    health: {
        test: 'Test',
        result: 'Result',
        status: {
            clear: 'Clear',
            carrier: 'Carrier',
            graded: 'Grade'
        },
        // Plain-language names and explanations. Leave `about` empty when we cannot explain a test accurately.
        tests: {
            hips: { name: 'Hips (hip dysplasia)', about: 'X-ray scoring of the hip joints. A is the best grade on the FCI scale (A to E): no signs of hip dysplasia.' },
            eyes: { name: 'Eye examination', about: 'Veterinary eye examination: no signs of eye disease were found.' },
            gm1: { name: 'GM1 gangliosidosis (DNA)', about: 'A fatal inherited disease of the nervous system known in the breed. N/N means no copy of the gene variant.' },
            prcd_pra: { name: 'prcd-PRA (DNA)', about: 'Progressive rod-cone degeneration, a form of progressive retinal atrophy that causes blindness later in life.' },
            eo_pra: { name: 'Early-onset PRA (DNA)', about: 'An early-onset form of progressive retinal atrophy (inherited blindness) described in the Portuguese Water Dog.' },
            improper_coat: { name: 'Improper coat (DNA)', about: 'A gene variant that gives a smooth coat without the typical furnishings on the face. N/N means the dog does not carry it.' },
            cddy_ivdd: { name: 'CDDY / IVDD risk (DNA)', about: 'A gene variant linked to shorter legs and a higher risk of intervertebral disc disease (IVDD). N/N means no copy.' },
            cjm: { name: 'CJM (DNA)', about: '' },
            cdpa: { name: 'CDPA (DNA)', about: '' },
            rbp4: { name: 'RBP4 (DNA)', about: '' }
        },
        carrier_title: 'What a carrier result means',
        carrier_note: '{carrier} carries one copy of the {test} gene variant and is not affected. {test} is inherited in an autosomal recessive way: a dog is only affected if it inherits the variant from both parents. {clear} is clear (N/N), so puppies of {carrier} and {clear} cannot be affected by {test}. On average about half of them will be carriers.'
    },
    puppies: {
        title: 'Portuguese Water Dog Puppies',
        subtitle: 'We plan every litter carefully, with the health and temperament of the breed in mind. Here you can follow our litters and learn how to welcome a Stella Maris puppy into your home.',
        available_title: 'Available puppies',
        available_subtitle: 'Meet our puppies who are still looking for their forever homes.',
        none_available_title: 'Our next litter is planned for {month}',
        none_available_title_no_litter: 'Be the first to hear about our next litter',
        none_available_desc: 'Our puppies from previous litters have all found their forever homes. Join our waitlist and we will keep you updated as the new litter approaches.',
        none_available_desc_no_litter: 'All of our puppies have found their forever homes. Join our waitlist and we will let you know as soon as our next litter is planned.',
        next_litter_title: 'Next litter',
        next_litter_expected: 'Expected in {month}',
        join_waitlist: 'Join the waitlist',
        map_title: 'Stella Maris around the world',
        map_subtitle: 'Some of the places where puppies from our litters live today.',
        map_label: 'Map of the countries where Stella Maris puppies live',
        map_touch_hint: 'Tap the map to move it',
        expecting: 'Expected',
        arrived: 'Born',
        whelp_date: 'Date of birth',
        go_home_date: 'Went home from',
        litter_size: 'Litter size',
        inquire: 'Inquire about this litter',
        more_from_litter: 'More from this litter',
        past_litters: 'Past litters',
        updated: 'Last updated: {date}',
        no_image: 'No photo yet',
        gender: {
            male: 'Boy',
            female: 'Girl'
        },
        process: {
            title: 'How to get a Stella Maris puppy',
            steps: [
                { title: 'Get in touch', text: 'Send us a message through the contact form, by email or on WhatsApp and tell us about your family. We accept applications all year round.' },
                { title: 'Get to know each other', text: 'We choose families with the same care as we choose our dogs, so we will talk with you about your home, your daily life and what you are looking for in a dog.' },
                { title: 'Deposit and waitlist', text: 'Once a pregnancy is confirmed, a deposit holds your place on the waitlist for that litter.' },
                { title: 'Matching at 7 weeks', text: 'We match each puppy to a family based on a Volhard temperament test at 7 weeks of age.' },
                { title: 'Going home', text: 'Puppies from our last litter went home from {date}, at about {weeks} weeks old. Families abroad should also check the travel rules in our FAQ.' }
            ],
            terms: 'Price, deposit and the other terms: we explain them personally, so please contact us with any questions.',
            faq_link: 'Read the puppy FAQ',
            contact_link: 'Contact us'
        },
        litters: {
            kings: {
                name: 'The Kings litter',
                description: 'Riva gave birth to nine healthy, strong boys on Christmas Day. Eight of them are brown – what are the chances?',
                photo_brown_puppy: 'Brown Portuguese Water Dog puppy from the Kings litter (Arthur Rubinstein x Riva Rosa) sitting on a wooden floor',
                photo_newborn: "Newborn brown puppy from the Kings litter held in a woman's hands"
            }
        },
        status: {
            available: 'Available',
            planned: 'Planned',
            born: 'Born',
            reserved: 'Reserved',
            sold_out: 'All homed'
        },
        locations: {
            portugal: 'Portugal',
            spain: 'Spain',
            uk: 'United Kingdom',
            bulgaria: 'Bulgaria',
            sofia: 'Sofia',
            london: 'London',
            puppy: 'puppy',
            puppies: 'puppies'
        }
    },
    faq: {
        title: 'Portuguese Water Dog FAQ',
        subtitle: 'Straight answers about the breed, our puppies, the waitlist and taking a puppy abroad.',
        updated: 'Last reviewed: {date}',
        more_title: 'Still have a question?',
        more_text: 'Write to us or send us a message on WhatsApp. We are happy to help.',
        contact_link: 'Contact us'
    },
    contact: {
        title: 'Contact Stella Maris Kennel in Sofia',
        subtitle: 'We would love to hear from you.',
        info_title: 'Contact information',
        email: 'Email',
        email_note: 'Please use this address for all inquiries.',
        phone: 'Phone',
        whatsapp_chat: 'Chat with us on WhatsApp',
        location: 'Location',
        location_value: 'Sofia, Bulgaria',
        visits: 'Visits by appointment only.',
        faq_hint: 'Many questions about the breed, the waitlist and travelling abroad are answered in our',
        faq_link: 'FAQ',
        form_title: 'Send us a message',
        first_name: 'First name',
        last_name: 'Last name',
        message: 'Message',
        interest: 'Interest',
        interest_options: {
            general: 'General inquiry',
            waitlist: 'Puppy waitlist',
            stud: 'Stud service'
        },
        optional: 'Optional',
        send: 'Send message',
        sending: 'Sending...',
        success_title: 'Message sent!',
        success_desc: 'Thank you for contacting Stella Maris Kennel. We will read your inquiry and get back to you soon.',
        send_another: 'Send another message',
        error: 'Sorry, your message could not be sent. Please try again, or contact us directly:',
        hours: 'Mon–Fri, 9:00–17:00 Sofia time (EET/EEST)',
        data_notice: 'We use your details only to reply to your inquiry. The form is delivered by Formspree. More in our',
        privacy_link: 'privacy policy',
        honeypot: 'Leave this field empty',
        inquiry_about: 'Your inquiry is about:',
        litter_message: 'Hello! I am interested in the {litter} litter.',
        puppy_message: 'Hello! I am interested in {puppy} from the {litter} litter.',
        errors: {
            required: 'Please fill in this field.',
            email: 'Please enter a valid email address, e.g. name@example.com.'
        }
    },
    footer: {
        brand: 'Stella Maris Kennel',
        rights: 'All rights reserved.',
        legal_label: 'Legal',
        site_label: 'Site',
        privacy: 'Privacy',
        cookie_settings: 'Cookie settings',
        location: 'Sofia, Bulgaria',
        registration: 'FCI registered kennel No. 166/2024',
        description: 'Stella Maris is a family kennel for Portuguese Water Dogs in Sofia, Bulgaria. We raise our puppies at home, health-test our breeding dogs and choose every puppy family with care.'
    },
    consent: {
        label: 'Cookie consent',
        title: 'Cookies',
        desc: 'With your permission, we use Google Ads cookies to see which of our ads bring visitors and inquiries. They are only set if you accept, and the site works the same either way.',
        privacy_link: 'Privacy policy',
        accept: 'Accept',
        reject: 'Reject'
    },
    privacy: {
        title: 'Privacy Policy',
        updated: 'Last updated: {date}',
        intro: 'This policy explains what personal data stellamaris.dog collects, why, and what rights you have. We collect as little as possible: the site has no user accounts, and advertising cookies are only used if you allow them.'
    },
    not_found: {
        title: 'Page not found',
        desc: "Sorry, we couldn't find this page. It may have moved when we rebuilt our website. These pages should help you find what you're looking for:",
        links_label: 'Main pages',
        contact: 'Questions? Contact us:'
    },
    error: {
        title: 'Something went wrong',
        desc: 'This page could not be loaded. Please reload the page. If the problem continues, contact us directly.',
        reload: 'Reload page',
        contact: 'Contact us:'
    },
    carousel: {
        previous: 'Previous photo',
        next: 'Next photo',
        photo: 'Photo',
        of: 'of',
        position: 'Photo {current} of {total}'
    }
};

export type Translations = typeof en;

export default en;
