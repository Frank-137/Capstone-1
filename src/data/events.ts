
import { HistoricalEvent } from '../lib/types';

// Sample historical events data
export const historicalEvents: HistoricalEvent[] = [
  // World War I Events
  {
    id: 'ww1-1',
    title: 'Assassination of Archduke Franz Ferdinand',
    description: 'Archduke Franz Ferdinand, heir to the Austro-Hungarian throne, was assassinated in Sarajevo by Gavrilo Princip, a Bosnian Serb nationalist. This event is widely considered to be the immediate cause of World War I.',
    date: new Date('1914-06-28'),
    location: { lat: 43.8563, lng: 18.4131 }, // Sarajevo
    type: 'political',
    period: 'ww1',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Assassination_of_Archduke_Franz_Ferdinand_of_Austria.jpg/800px-Assassination_of_Archduke_Franz_Ferdinand_of_Austria.jpg'
  },
  {
    id: 'ww1-2',
    title: 'Battle of the Somme',
    description: 'One of the largest battles of World War I, fought by the British and French against the German Empire. Over 1 million men were wounded or killed, making it one of the bloodiest battles in human history.',
    date: new Date('1916-07-01'),
    location: { lat: 50.0058, lng: 2.6685 }, // Somme River
    type: 'battle',
    period: 'ww1',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Cheshire_Regiment_trench_Somme_1916.jpg/800px-Cheshire_Regiment_trench_Somme_1916.jpg'
  },
  {
    id: 'ww1-3',
    title: 'Treaty of Versailles',
    description: 'The peace treaty that ended World War I. It imposed harsh penalties on Germany, including territorial losses, reparations payments, and limits on its military, creating resentment that would later contribute to the rise of Nazi Germany.',
    date: new Date('1919-06-28'),
    location: { lat: 48.8049, lng: 2.1204 }, // Versailles
    type: 'treaty',
    period: 'ww1',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_Mirrors%2C_Versailles.jpg/800px-William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_Mirrors%2C_Versailles.jpg'
  },
  
  // Interwar Period
  {
    id: 'interwar-1',
    title: 'Wall Street Crash',
    description: 'The most devastating stock market crash in the history of the United States, which signaled the beginning of the 12-year Great Depression. The crash affected all Western industrialized countries.',
    date: new Date('1929-10-29'),
    location: { lat: 40.7069, lng: -74.0113 }, // Wall Street
    type: 'economic',
    period: 'interwar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Crowd_outside_nyse.jpg/800px-Crowd_outside_nyse.jpg'
  },
  
  // World War II Events
  {
    id: 'ww2-1',
    title: 'German Invasion of Poland',
    description: 'Nazi Germany invaded Poland, marking the beginning of World War II in Europe. Britain and France declared war on Germany two days later.',
    date: new Date('1939-09-01'),
    location: { lat: 52.2297, lng: 21.0122 }, // Warsaw
    type: 'battle',
    period: 'ww2',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Bundesarchiv_Bild_183-S55480%2C_Polen%2C_Parade_vor_Adolf_Hitler.jpg/800px-Bundesarchiv_Bild_183-S55480%2C_Polen%2C_Parade_vor_Adolf_Hitler.jpg'
  },
  {
    id: 'ww2-2',
    title: 'Attack on Pearl Harbor',
    description: 'A surprise military strike by the Imperial Japanese Navy Air Service upon the United States naval base at Pearl Harbor, Hawaii. The attack led to the United States\' entry into World War II.',
    date: new Date('1941-12-07'),
    location: { lat: 21.3651, lng: -157.9769 }, // Pearl Harbor
    type: 'battle',
    period: 'ww2',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/The_USS_Arizona_%28BB-39%29_burning_after_the_Japanese_attack_on_Pearl_Harbor_-_NARA_195617_-_Edit.jpg/800px-The_USS_Arizona_%28BB-39%29_burning_after_the_Japanese_attack_on_Pearl_Harbor_-_NARA_195617_-_Edit.jpg'
  },
  {
    id: 'ww2-3',
    title: 'D-Day (Normandy Landings)',
    description: 'The largest seaborne invasion in history, beginning the Allied liberation of Western Europe from Nazi control. The operation began the liberation of German-occupied France from Nazi control.',
    date: new Date('1944-06-06'),
    location: { lat: 49.4144, lng: -0.8322 }, // Normandy beaches
    type: 'battle',
    period: 'ww2',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Into_the_Jaws_of_Death_23-0455M_edit.jpg/800px-Into_the_Jaws_of_Death_23-0455M_edit.jpg'
  },
  {
    id: 'ww2-4',
    title: 'Hiroshima and Nagasaki Atomic Bombings',
    description: 'The United States detonated two nuclear weapons over the Japanese cities of Hiroshima and Nagasaki. The bombings killed between 129,000 and 226,000 people, mostly civilians, and remain the only use of nuclear weapons in armed conflict.',
    date: new Date('1945-08-06'),
    location: { lat: 34.3852, lng: 132.4552 }, // Hiroshima
    type: 'battle',
    period: 'ww2',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Atomic_bombing_of_Japan.jpg/800px-Atomic_bombing_of_Japan.jpg'
  },
  {
    id: 'ww2-5',
    title: 'Surrender of Japan',
    description: 'The surrender of Imperial Japan was announced by Japanese Emperor Hirohito on August 15 and formally signed on September 2, 1945, bringing the hostilities of World War II to a close.',
    date: new Date('1945-09-02'),
    location: { lat: 35.3587, lng: 139.7142 }, // Tokyo Bay (USS Missouri)
    type: 'treaty',
    period: 'ww2',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Surrend_of_Japan_2_September_1945.jpg/800px-Surrend_of_Japan_2_September_1945.jpg'
  },
];

// Helper function to filter events by period
export const getEventsByPeriod = (period: string | null) => {
  if (!period) return historicalEvents;
  return historicalEvents.filter(event => event.period === period);
};

// Helper function to filter events by year
export const getEventsByYear = (year: number) => {
  return historicalEvents.filter(event => event.date.getFullYear() === year);
};

// Helper function to get min and max years from the dataset
export const getYearRange = () => {
  const years = historicalEvents.map(event => event.date.getFullYear());
  return {
    min: Math.min(...years),
    max: Math.max(...years)
  };
};

// Helper function to get event by ID
export const getEventById = (id: string) => {
  return historicalEvents.find(event => event.id === id) || null;
};
