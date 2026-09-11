import manifest from './media.json';

export const story = {
  herName: 'Adya',
  relationshipStartDate: '2022-02-21',
  journeyDistance: 1200,
  origin: 'Coimbatore',
  destination: 'Hyderabad',
  landmark: 'Charminar',
  giftName: 'Lac bangle',
  train: {
    number: '07098',
    name: 'MAQ HYB Special',
    departure: '04 SEP 2026',
    route: 'Coimbatore → Hyderabad',
    duration: '22+ hours',
    distance: '~1,200 km',
  },
  keyDates: [
    {
      date: '03.06.2017',
      title: 'The first time I saw you.',
      subtitle: '5th standard.',
    },
    {
      date: '02.12.2021',
      title: 'The day I finally told you.',
      subtitle: '9th standard.',
    },
    {
      date: '21.02.2022',
      title: 'The day you said yes.',
      subtitle: 'The beginning of us.',
    },
    {
      date: 'TODAY',
      title: 'Still choosing you.',
      subtitle: 'Every single day.',
    },
  ],
  birthdayWish: [
    'I wanted your gift to arrive with a story of its own.',
    'Not something picked from a catalogue in ten seconds, but something that took miles, hours, quiet platforms in the dark, and an entire journey across states just to reach your hands.',
    'I hope this year treats your heart with kindness. I hope your days are filled with genuine laughter, quiet certainty, and little moments of wonder.',
    'And whenever you wear this bangle, I hope you never just see a piece of jewellery—I hope you feel the miles travelled, the care chosen with every breath, and how endlessly you are loved.',
    'Happy Birthday, Adya. Always.',
  ],
};

export type Category =
  | 'hero'
  | 'train_start'
  | 'journey_proof'
  | 'train_story'
  | 'hyderabad'
  | 'charminar'
  | 'charminar_portraits'
  | 'bangle_reveal'
  | 'couple'
  | 'bloopers'
  | 'photobooth';

export type Media = {
  category: Category;
  file: string;
  caption: string;
  alt: string;
  date?: string;
  priority?: boolean;
  orientation?: 'portrait' | 'landscape' | 'square';
  width: number;
  height: number;
  blurDataURL?: string;
  type?: 'image' | 'video';
  poster?: string;
  focalPoint?: string;
};

export const media = manifest as Media[];
