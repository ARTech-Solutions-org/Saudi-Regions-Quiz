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
    q('Which traditional dish is officially associated with the Riyadh Region?', 'Marqooq', 'Saleeg', 0),
    q('Which traditional dance is strongly associated with Saudi Arabia and is often performed at celebrations in Riyadh?', 'Al-Samah Dance', 'Saudi Ardah', 1),
    q('Which iconic landmark can be found in Riyadh?', 'Al-Balad Historic District', 'Kingdom Centre Tower', 1),
  ]},
  { id: 'makkah', name: 'Makkah', short: 'A city of gathering', color: '#ad7563', questions: [
    q('Which traditional dish is associated with the Makkah Region?', 'Saleeg', 'Hasawi Rice', 0),
    q('Which famous city is located in the Makkah Region?', 'Jeddah', 'Buraidah', 0),
    q('When is the traditional celebration for a newborn held in Makkah?', 'On the tenth day', 'On the seventh day', 1),
  ]},
  { id: 'jeddah', name: 'Jeddah', short: 'Bride of the Red Sea', color: '#4a8594', questions: [
    q('What is Historic Jeddah\'s official UNESCO World Heritage title?', '“Historic Jeddah, the Pearl of the Red Sea”', '“Historic Jeddah, the Gate to Makkah”', 1),
    q('Approximately how high does the water shoot from King Fahd\'s Fountain, one of Jeddah\'s most famous landmarks?', 'About 500 meters', 'About 312 meters', 1),
    q('Jeddah is popularly nicknamed which of the following?', 'Bride of the Red Sea', 'Gateway of the Gulf', 0),
  ]},
  { id: 'madinah', name: 'Madinah', short: 'Oasis of welcome', color: '#7fa76d', questions: [
    q('Which famous mosque is located in Madinah?', 'Al-Masjid an-Nabawi', 'Masjid al-Haram', 0),
    q('Which rice dish was officially selected as the regional dish of Madinah?', 'Hasawi Rice', 'Madini Rice', 1),
    q('What fruit is especially associated with Madinah\'s agricultural heritage?', 'Pomegranates', 'Dates', 1),
  ]},
  { id: 'eastern', name: 'Eastern Province', short: 'Where the coast meets the oasis', color: '#3b9a99', questions: [
    q('What is Al-Ahsa particularly famous for?', 'Its vast oasis and date palms', 'Its snow-capped mountains', 0),
    q('Which rice dish was officially selected as the regional dish of the Eastern Province?', 'Madini Rice', 'Hasawi Rice', 1),
    q('Which natural resource has played a major role in the history and economy of the Eastern Province?', 'Oil', 'Gold', 0),
  ]},
  { id: 'qassim', name: 'Al-Qassim', short: 'Orchards, stories, and sweets', color: '#c98554', questions: [
    q('Which traditional sweet is associated with the Al-Qassim Region?', 'Luqaimat', 'Kleija', 1),
    q('What is Al-Qassim particularly famous for producing?', 'Dates', 'Coffee beans', 0),
    q('Which city is the administrative capital of Al-Qassim?', 'Taif', 'Buraidah', 1),
  ]},
  { id: 'asir', name: 'Asir', short: 'Green peaks in the south', color: '#5f976f', questions: [
    q('Which traditional dish is associated with the Asir Region?', 'Haneeth', 'Sayadiyah', 0),
    q('Which city is known as the main destination and capital of the Asir Region?', 'Dammam', 'Abha', 1),
    q('What makes Asir especially unique compared with much of Saudi Arabia?', 'Its mountains and green landscapes', 'Its extensive sand dune deserts', 0),
  ]},
  { id: 'tabuk', name: 'Tabuk', short: 'Northwest horizons', color: '#7c9c9f', questions: [
    q('Which traditional dish is associated with the Tabuk Region?', 'Kleija', 'Sayadiyah', 1),
    q('Tabuk is located in which part of Saudi Arabia?', 'Northwest', 'Southeast', 0),
    q('Which type of landscape is strongly associated with the Tabuk Region?', 'Tropical rainforests', 'Mountains and deserts', 1),
  ]},
  { id: 'hail', name: 'Hail', short: 'Poetry beneath wide skies', color: '#9f7a61', questions: [
    q('Which of these is a well-known folk proverb from Hail?', '“He eats with his hands and feet.”', '“Like the Tayma Hadaj, generous to his guests.”', 1),
    q('Hail is particularly famous for its connection to which aspect of traditional Arab culture?', 'Poetry and storytelling', 'Pearl diving', 0),
    q('Which famous pre-Islamic poet is strongly associated with the heritage of Hail?', 'Imru\' al-Qais', 'Antarah ibn Shaddad', 1),
  ]},
  { id: 'jazan', name: 'Jazan', short: 'Tropical shores and spice', color: '#d28c5e', questions: [
    q('Which dish was officially selected as the regional dish of Jazan?', 'Maghsh', 'Marqooq', 0),
    q('Which of these is a traditional proverb from Jazan?', '“Like the Tayma Hadaj, generous to his guests.”', '“The rooster crows while still in the egg.”', 1),
    q('Which tropical fruit is commonly associated with Jazan\'s warm climate?', 'Mangoes', 'Dates', 0),
  ]},
  { id: 'najran', name: 'Najran', short: 'Southern heritage, carved in stone', color: '#ae725b', questions: [
    q('Which traditional dish was officially selected as the regional dish of Najran?', 'Ar-Ruqsh', 'Muqana Bread', 0),
    q('Which traditional item is particularly associated with southern Saudi Arabian heritage and can be part of traditional dress and dance?', 'Pearl necklace', 'Janbiya dagger', 1),
    q('Which country shares a border with Najran to the south?', 'Yemen', 'Oman', 0),
  ]},
  { id: 'bahah', name: 'Al-Bahah', short: 'Mountains, forests, and song', color: '#668f7a', questions: [
    q('What is Al-Bahah especially known for?', 'Coastal fishing villages', 'Mountains and forests', 1),
    q('Which traditional bread was officially selected as the regional specialty of Al-Bahah?', 'Muqana Bread', 'Tamees Bread', 0),
    q('Which traditional dance is also performed in Al-Bahah?', 'Al-Samah Dance', 'Southern Ardah', 1),
  ]},
  { id: 'northern-borders', name: 'Northern Borders', short: 'Winter warmth and folk strings', color: '#788d98', questions: [
    q('Which dish was officially selected as the regional dish of the Northern Borders?', 'Mulayhiya', 'Kleija', 0),
    q('Traditional dishes in the Northern Borders are especially influenced by which season?', 'Summer', 'Winter', 1),
    q('Which traditional instrument is historically associated with folk arts in the northern regions of Saudi Arabia?', 'Rababah', 'Oud', 0),
  ]},
  { id: 'jouf', name: 'Al-Jouf', short: 'Olive groves in the north', color: '#78965e', questions: [
    q('What is Al-Jouf particularly famous for?', 'Pearl diving', 'Olive cultivation', 1),
    q('Which proverb is associated with the folk culture of Al-Jouf?', '“He eats with his hands and feet.”', '“The rooster crows while still in the egg.”', 0),
    q('Which ancient historical site is located in Al-Jouf?', 'Mada\'in Salih', 'Dumat Al-Jandal', 1),
  ]},
];

export const totalQuestions = regions.reduce((acc, region) => acc + region.questions.length, 0);