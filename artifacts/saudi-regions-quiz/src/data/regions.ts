export type Question = {
  prompt: string;
  options: [string, string];
  answer: 0 | 1;
};

export type Region = {
  id: string;
  name: string;
  short: string;
  color: string;
  questions: Question[];
};

const q = (prompt: string, first: string, second: string, answer: 0 | 1): Question => ({
  prompt,
  options: [first, second],
  answer,
});

export const regions: Region[] = [
  { id: 'riyadh', name: 'Riyadh', short: 'The heart of the kingdom', color: '#dba957', questions: [
    q('Which dish represents Riyadh Region?', 'Marqooq', 'Saleeg', 0),
    q('Which dance is famous in Riyadh?', 'Saudi Ardah', 'Al-Samah Dance', 0),
    q('Which landmark is found in Riyadh?', 'Al-Balad Historic District', 'Kingdom Centre Tower', 1),
  ]},
  { id: 'makkah', name: 'Makkah', short: 'A city of gathering', color: '#ad7563', questions: [
    q('Which dish represents Makkah Region?', 'Saleeg', 'Hassawi Rice', 0),
    q('Which famous city is in Makkah?', 'Jeddah', 'Abha', 0),
    q('When is newborn celebration held?', 'On the tenth day', 'On the seventh day', 1),
  ]},
  { id: 'madinah', name: 'Madinah', short: 'Oasis of welcome', color: '#7fa76d', questions: [
    q('Which famous mosque is in Madinah?', 'Al-Masjid an-Nabawi', 'The Grand Mosque', 0),
    q('Which rice dish represents Madinah?', 'Hasawi Rice', 'Madini Rice', 1),
    q('Which fruit represents Madinah agriculture?', 'Dates', 'Mangoes', 0),
  ]},
  { id: 'eastern', name: 'Eastern Province', short: 'Where the coast meets the oasis', color: '#3b9a99', questions: [
    q('What is Al-Ahsa famous for?', 'Its vast oasis and date palms', 'Its forests', 0),
    q('Which rice dish represents Eastern Province?', 'Hasawi Rice', 'Madini Rice', 0),
    q('Which resource shaped Eastern Province?', 'Oil', 'Gold', 0),
  ]},
  { id: 'qassim', name: 'Al-Qassim', short: 'Orchards, stories, and sweets', color: '#c98554', questions: [
    q('Which sweet represents Al-Qassim?', 'Kleija', 'Maqshush', 0),
    q('What does Al-Qassim produce?', 'Dates', 'Seafood', 0),
    q('Which city is Al-Qassim’s capital?', 'Buraidah', 'Taif', 0),
  ]},
  { id: 'asir', name: 'Asir', short: 'Green peaks in the south', color: '#5f976f', questions: [
    q('Which dish represents Asir Region?', 'Haneeth', 'Sayadiyah', 0),
    q('Which city is Asir’s capital?', 'Abha', 'Dammam', 0),
    q('What makes Asir unique?', 'Its mountains and green landscapes', 'Its vast coastal islands', 0),
  ]},
  { id: 'tabuk', name: 'Tabuk', short: 'Northwest horizons', color: '#7c9c9f', questions: [
    q('Which dish represents Tabuk Region?', 'Sayadiyah', 'Haneeth', 0),
    q('Where is Tabuk located?', 'Northwest', 'Southeast', 0),
    q('Which landscape characterizes Tabuk?', 'Mountains and deserts', 'Tropical rainforests', 0),
  ]},
  { id: 'hail', name: 'Hail', short: 'Poetry beneath wide skies', color: '#9f7a61', questions: [
    q('Which proverb comes from Hail?', '“Like the Tayma Hadaj, generous to his guests.”', '“The rooster crows while still in the egg.”', 0),
    q('What traditional culture is Hail famous for?', 'Poetry and storytelling', 'Pearl diving', 0),
    q('Which poet is associated with Hail?', 'Antarah ibn Shaddad', 'Al-Khansa', 0),
  ]},
  { id: 'jazan', name: 'Jazan', short: 'Tropical shores and spice', color: '#d28c5e', questions: [
    q('Which dish represents Jazan Region?', 'Maghsh', 'Marqooq', 0),
    q('Which proverb comes from Jazan?', '“The rooster crows while still in the egg.”', 'Someone who shows intelligence from a young age', 0),
    q('Which tropical fruit grows in Jazan?', 'Mangoes', 'Apples', 0),
  ]},
  { id: 'najran', name: 'Najran', short: 'Southern heritage, carved in stone', color: '#ae725b', questions: [
    q('Which dish represents Najran Region?', 'Ar-Ruqsh', 'Kubaibat Hail', 0),
    q('Which traditional item represents southern heritage?', 'Janbiya dagger', 'Pearl necklace', 0),
    q('Which country borders Najran south?', 'Yemen', 'Jordan', 0),
  ]},
  { id: 'bahah', name: 'Al-Bahah', short: 'Mountains, forests, and song', color: '#668f7a', questions: [
    q('What is Al-Bahah known for?', 'Mountains and forests', 'Vast oil fields', 0),
    q('Which bread represents Al-Bahah?', 'Muqana Bread', 'Tamees Bread', 0),
    q('Which dance is performed in Al-Bahah?', 'Southern Ardah', 'Al-Mizmar', 0),
  ]},
  { id: 'northern-borders', name: 'Northern Borders', short: 'Winter warmth and folk strings', color: '#788d98', questions: [
    q('Which dish represents Northern Borders?', 'Mulayhiya', 'Saleeg', 0),
    q('Which season influences traditional dishes?', 'Winter', 'Summer', 0),
    q('Which instrument is linked to Northern folk?', 'Rababah', 'Mizmar', 0),
  ]},
  { id: 'jouf', name: 'Al-Jouf', short: 'Olive groves in the north', color: '#78965e', questions: [
    q('What is Al-Jouf famous for?', 'Olive cultivation', 'Coffee plantations', 0),
    q('Which proverb represents Al-Jouf culture?', '“He eats with his hands and feet.”', '“The rooster crows while still in the egg.”', 0),
    q('Which ancient site is in Al-Jouf?', 'Dumat Al-Jandal', 'Diriyah', 0),
  ]},
];

export const totalQuestions = regions.length * 3;