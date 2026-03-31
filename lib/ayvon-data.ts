export type Locale = 'ru' | 'uz';
export type SpaceMood = 'focus' | 'calls' | 'team' | 'creative' | 'reset';
export type ConciergeGoal = 'focus' | 'pitch' | 'record' | 'create' | 'reset';
export type ConciergePriority = 'privacy' | 'budget' | 'ambience';

export type SpaceSlot = {
  label: string;
  left: number;
  demand: 'calm' | 'hot' | 'rush';
};

export type TrendPoint = {
  label: string;
  occupancy: number;
  waitlist: number;
  revenue: number;
  satisfaction: number;
};

export type Studio = {
  id: string;
  name: string;
  city: string;
  district: string;
  tagline: string;
  story: string;
  mood: SpaceMood;
  accent: string;
  accentSoft: string;
  pricePerHour: number;
  memberPrice: number;
  seats: number;
  responseMinutes: number;
  rating: number;
  host: string;
  intensity: string;
  amenities: string[];
  metrics: {
    light: number;
    privacy: number;
    acoustics: number;
    hospitality: number;
  };
  availability: SpaceSlot[];
  trend: TrendPoint[];
};

export type Booking = {
  id: string;
  studioId: string;
  studioName: string;
  city: string;
  slot: string;
  seats: number;
  duration: number;
  total: number;
  guest: string;
  brief: string;
  createdAt: string;
};

export type WaitlistEntry = {
  id: string;
  name: string;
  email: string;
  goal: ConciergeGoal;
  city: string;
  createdAt: string;
};

export type BackendMode = 'supabase' | 'sqlite' | 'cache';

export type LaunchState = {
  bookings: Booking[];
  waitlist: WaitlistEntry[];
  backend: BackendMode;
};

export type CreateBookingInput = {
  studioId: string;
  slot: string;
  seats: number;
  duration: number;
  membership: boolean;
  guest: string;
  brief: string;
};

export type JoinWaitlistInput = {
  name: string;
  email: string;
  goal: ConciergeGoal;
  city: string;
};

export const moodOptions: Array<{ id: SpaceMood | 'all'; label: string; blurb: string }> = [
  { id: 'all', label: 'Все сценарии', blurb: 'Полный каталог пространств' },
  { id: 'focus', label: 'Deep work', blurb: 'Тишина, свет и концентрация' },
  { id: 'calls', label: 'Calls', blurb: 'Созвоны, интервью, запись' },
  { id: 'team', label: 'Team', blurb: 'Спринты, воркшопы и мини-встречи' },
  { id: 'creative', label: 'Creative', blurb: 'Мудборды, скетчи и контент' },
  { id: 'reset', label: 'Reset', blurb: 'Пауза, дыхание и восстановление' }
];

export const goalOptions: Array<{ id: ConciergeGoal; label: string }> = [
  { id: 'focus', label: 'Сфокусироваться' },
  { id: 'pitch', label: 'Собрать питч' },
  { id: 'record', label: 'Записать звонок или подкаст' },
  { id: 'create', label: 'Сделать креативную сессию' },
  { id: 'reset', label: 'Перезагрузиться между встречами' }
];

export const priorityOptions: Array<{ id: ConciergePriority; label: string }> = [
  { id: 'privacy', label: 'Нужна приватность' },
  { id: 'budget', label: 'Важен бюджет' },
  { id: 'ambience', label: 'Важна атмосфера' }
];

export const initialStudios: Studio[] = [
  {
    id: 'mirabad-courtyard',
    name: 'Ayvon Courtyard 01',
    city: 'Ташкент',
    district: 'Мирабад',
    tagline: 'Светлый кабинет для deep work, интервью и тихих созвонов.',
    story: 'Теплый двор, чайная станция и столы с правильным daylight вместо коворкинг-шума.',
    mood: 'focus',
    accent: '#0f9d8a',
    accentSoft: '#d9f6ee',
    pricePerHour: 120000,
    memberPrice: 98000,
    seats: 6,
    responseMinutes: 8,
    rating: 4.9,
    host: 'daylight desk + чайный бар',
    intensity: 'почти бесшумно',
    amenities: ['Fiber Wi-Fi', '2K monitor', 'Tea station', 'Printer'],
    metrics: {
      light: 96,
      privacy: 91,
      acoustics: 88,
      hospitality: 94
    },
    availability: [
      { label: '09:00', left: 4, demand: 'calm' },
      { label: '11:00', left: 3, demand: 'hot' },
      { label: '13:00', left: 2, demand: 'rush' },
      { label: '15:00', left: 3, demand: 'hot' },
      { label: '17:00', left: 4, demand: 'calm' },
      { label: '19:00', left: 5, demand: 'calm' }
    ],
    trend: [
      { label: 'Mon', occupancy: 66, waitlist: 4, revenue: 1.9, satisfaction: 96 },
      { label: 'Tue', occupancy: 71, waitlist: 5, revenue: 2.2, satisfaction: 95 },
      { label: 'Wed', occupancy: 83, waitlist: 8, revenue: 2.6, satisfaction: 97 },
      { label: 'Thu', occupancy: 88, waitlist: 10, revenue: 2.8, satisfaction: 97 },
      { label: 'Fri', occupancy: 76, waitlist: 7, revenue: 2.3, satisfaction: 94 },
      { label: 'Sat', occupancy: 58, waitlist: 2, revenue: 1.4, satisfaction: 98 },
      { label: 'Sun', occupancy: 44, waitlist: 1, revenue: 0.9, satisfaction: 99 }
    ]
  },
  {
    id: 'yunusabad-signal',
    name: 'Signal Booth Atelier',
    city: 'Ташкент',
    district: 'Юнусабад',
    tagline: 'Акустическая комната для звонков, кастдевов и камерных записей.',
    story: 'Пространство собрано вокруг звука: мягкие стены, ring light и стабильный uplink без эха.',
    mood: 'calls',
    accent: '#1b4fd6',
    accentSoft: '#dbe8ff',
    pricePerHour: 155000,
    memberPrice: 129000,
    seats: 4,
    responseMinutes: 6,
    rating: 4.8,
    host: 'acoustic shell + ring light',
    intensity: 'управляемый фон',
    amenities: ['Podcast kit', 'Ring light', 'Noise gate', 'Fast upload'],
    metrics: {
      light: 82,
      privacy: 95,
      acoustics: 98,
      hospitality: 88
    },
    availability: [
      { label: '09:30', left: 2, demand: 'hot' },
      { label: '11:30', left: 1, demand: 'rush' },
      { label: '13:30', left: 2, demand: 'hot' },
      { label: '15:30', left: 3, demand: 'calm' },
      { label: '17:30', left: 2, demand: 'hot' },
      { label: '19:30', left: 4, demand: 'calm' }
    ],
    trend: [
      { label: 'Mon', occupancy: 58, waitlist: 3, revenue: 1.6, satisfaction: 95 },
      { label: 'Tue', occupancy: 74, waitlist: 5, revenue: 2.1, satisfaction: 96 },
      { label: 'Wed', occupancy: 81, waitlist: 6, revenue: 2.5, satisfaction: 95 },
      { label: 'Thu', occupancy: 86, waitlist: 8, revenue: 2.7, satisfaction: 96 },
      { label: 'Fri', occupancy: 90, waitlist: 11, revenue: 3.1, satisfaction: 94 },
      { label: 'Sat', occupancy: 62, waitlist: 4, revenue: 1.8, satisfaction: 97 },
      { label: 'Sun', occupancy: 48, waitlist: 2, revenue: 1.1, satisfaction: 98 }
    ]
  },
  {
    id: 'anhor-team-loft',
    name: 'Anhor Sprint Loft',
    city: 'Ташкент',
    district: 'Шайхантахур',
    tagline: 'Лофт для продуктовых сессий, командных ретро и быстрых воркшопов.',
    story: 'Гибкая мебель, большая магнитная стена и набор для быстрых спринтов без аренды на полдня.',
    mood: 'team',
    accent: '#f97316',
    accentSoft: '#ffe8d8',
    pricePerHour: 210000,
    memberPrice: 178000,
    seats: 10,
    responseMinutes: 11,
    rating: 4.9,
    host: 'magnetic wall + sprint kit',
    intensity: 'живой темп',
    amenities: ['Workshop wall', 'Projector', 'Coffee bar', 'Standing tables'],
    metrics: {
      light: 87,
      privacy: 84,
      acoustics: 79,
      hospitality: 93
    },
    availability: [
      { label: '10:00', left: 8, demand: 'calm' },
      { label: '12:00', left: 6, demand: 'hot' },
      { label: '14:00', left: 4, demand: 'rush' },
      { label: '16:00', left: 5, demand: 'hot' },
      { label: '18:00', left: 7, demand: 'calm' },
      { label: '20:00', left: 9, demand: 'calm' }
    ],
    trend: [
      { label: 'Mon', occupancy: 62, waitlist: 2, revenue: 2.4, satisfaction: 94 },
      { label: 'Tue', occupancy: 69, waitlist: 4, revenue: 2.8, satisfaction: 95 },
      { label: 'Wed', occupancy: 78, waitlist: 6, revenue: 3.2, satisfaction: 96 },
      { label: 'Thu', occupancy: 84, waitlist: 7, revenue: 3.5, satisfaction: 95 },
      { label: 'Fri', occupancy: 92, waitlist: 12, revenue: 4.1, satisfaction: 93 },
      { label: 'Sat', occupancy: 74, waitlist: 5, revenue: 2.9, satisfaction: 97 },
      { label: 'Sun', occupancy: 41, waitlist: 1, revenue: 1.0, satisfaction: 98 }
    ]
  },
  {
    id: 'samarkand-ceramic',
    name: 'Ceramic Mood Lab',
    city: 'Самарканд',
    district: 'Университетский квартал',
    tagline: 'Мягкое пространство для креативных спринтов, мудбордов и камерного брендинга.',
    story: 'Тактильные материалы, длинный communal table и стена, на которой можно собрать концепт за час.',
    mood: 'creative',
    accent: '#a85528',
    accentSoft: '#f3dfd3',
    pricePerHour: 138000,
    memberPrice: 112000,
    seats: 7,
    responseMinutes: 13,
    rating: 4.7,
    host: 'material library + sketch wall',
    intensity: 'мягкий шум',
    amenities: ['Mood wall', 'Material library', 'Analog speakers', 'Photo corner'],
    metrics: {
      light: 90,
      privacy: 78,
      acoustics: 81,
      hospitality: 92
    },
    availability: [
      { label: '10:30', left: 5, demand: 'calm' },
      { label: '12:30', left: 4, demand: 'hot' },
      { label: '14:30', left: 3, demand: 'hot' },
      { label: '16:30', left: 4, demand: 'calm' },
      { label: '18:30', left: 5, demand: 'calm' },
      { label: '20:30', left: 6, demand: 'calm' }
    ],
    trend: [
      { label: 'Mon', occupancy: 52, waitlist: 1, revenue: 1.3, satisfaction: 96 },
      { label: 'Tue', occupancy: 61, waitlist: 3, revenue: 1.7, satisfaction: 97 },
      { label: 'Wed', occupancy: 66, waitlist: 3, revenue: 1.9, satisfaction: 98 },
      { label: 'Thu', occupancy: 72, waitlist: 4, revenue: 2.1, satisfaction: 97 },
      { label: 'Fri', occupancy: 79, waitlist: 7, revenue: 2.4, satisfaction: 95 },
      { label: 'Sat', occupancy: 84, waitlist: 8, revenue: 2.6, satisfaction: 98 },
      { label: 'Sun', occupancy: 68, waitlist: 4, revenue: 1.8, satisfaction: 99 }
    ]
  },
  {
    id: 'bukhara-garden',
    name: 'Garden Reset House',
    city: 'Бухара',
    district: 'Старый город',
    tagline: 'Тихий inner garden для короткой перезагрузки, чтения и личных 1:1.',
    story: 'Не кофейня и не отель: это короткие паузы между делами с воздухом, шорохом воды и мягким светом.',
    mood: 'reset',
    accent: '#b45309',
    accentSoft: '#fde8c8',
    pricePerHour: 98000,
    memberPrice: 79000,
    seats: 5,
    responseMinutes: 9,
    rating: 4.9,
    host: 'courtyard tea + low seating',
    intensity: 'почти сад',
    amenities: ['Garden tea', 'Reading shelf', 'Charging docks', 'Fresh fruit water'],
    metrics: {
      light: 89,
      privacy: 86,
      acoustics: 84,
      hospitality: 97
    },
    availability: [
      { label: '09:00', left: 5, demand: 'calm' },
      { label: '11:00', left: 4, demand: 'calm' },
      { label: '13:00', left: 2, demand: 'hot' },
      { label: '15:00', left: 2, demand: 'rush' },
      { label: '17:00', left: 3, demand: 'hot' },
      { label: '19:00', left: 5, demand: 'calm' }
    ],
    trend: [
      { label: 'Mon', occupancy: 47, waitlist: 1, revenue: 0.8, satisfaction: 98 },
      { label: 'Tue', occupancy: 53, waitlist: 1, revenue: 1.0, satisfaction: 99 },
      { label: 'Wed', occupancy: 58, waitlist: 2, revenue: 1.2, satisfaction: 98 },
      { label: 'Thu', occupancy: 61, waitlist: 3, revenue: 1.3, satisfaction: 99 },
      { label: 'Fri', occupancy: 69, waitlist: 4, revenue: 1.6, satisfaction: 97 },
      { label: 'Sat', occupancy: 82, waitlist: 6, revenue: 2.0, satisfaction: 99 },
      { label: 'Sun', occupancy: 88, waitlist: 7, revenue: 2.2, satisfaction: 100 }
    ]
  }
];

const goalToMood: Record<ConciergeGoal, SpaceMood> = {
  focus: 'focus',
  pitch: 'team',
  record: 'calls',
  create: 'creative',
  reset: 'reset'
};

export function getRecommendation(
  studios: Studio[],
  goal: ConciergeGoal,
  teamSize: number,
  priority: ConciergePriority,
  locale: Locale = 'ru'
) {
  const scored = studios
    .map((studio) => {
      let score = 0;

      if (studio.mood === goalToMood[goal]) {
        score += 34;
      } else if (goal === 'pitch' && studio.mood === 'creative') {
        score += 12;
      } else if (goal === 'focus' && studio.mood === 'calls') {
        score += 8;
      }

      if (studio.seats >= teamSize) {
        score += Math.max(10, 28 - (studio.seats - teamSize) * 2);
      } else {
        score -= 20;
      }

      if (priority === 'privacy') {
        score += studio.metrics.privacy / 2;
      }

      if (priority === 'budget') {
        score += Math.max(8, 42 - studio.pricePerHour / 5000);
      }

      if (priority === 'ambience') {
        score += (studio.metrics.light + studio.metrics.hospitality) / 3;
      }

      score += studio.rating * 6;
      score += Math.max(4, 18 - studio.responseMinutes);

      return { studio, score: Math.round(score) };
    })
    .sort((left, right) => right.score - left.score);

  const winner = scored[0];
  const reason =
    priority === 'privacy'
      ? locale === 'uz'
        ? `Maxfiylik darajasi ${winner.studio.metrics.privacy}/100 va host javobi ${winner.studio.responseMinutes} daqiqa ichida.`
        : `Высокая приватность ${winner.studio.metrics.privacy}/100 и быстрый ответ хоста за ${winner.studio.responseMinutes} минут.`
      : priority === 'budget'
        ? locale === 'uz'
          ? `Narx bo‘yicha kuchli variant: ishtirokchilar uchun ${winner.studio.memberPrice.toLocaleString('uz-UZ')} so‘m member tarifi.`
          : `Одна из самых сильных ставок по цене: ${winner.studio.memberPrice.toLocaleString('ru-RU')} сум для участников.`
        : locale === 'uz'
          ? `Atmosfera kuchli: yorug‘lik ${winner.studio.metrics.light}/100 va servis ${winner.studio.metrics.hospitality}/100.`
          : `Сильная атмосфера: свет ${winner.studio.metrics.light}/100 и сервис ${winner.studio.metrics.hospitality}/100.`;

  return {
    studio: winner.studio,
    score: winner.score,
    reason
  };
}

export function getStudioById(studioId: string) {
  return initialStudios.find((studio) => studio.id === studioId) ?? null;
}

export function calculateBookingTotal(
  studio: Studio,
  duration: number,
  seats: number,
  membership: boolean
) {
  const perHour = membership ? studio.memberPrice : studio.pricePerHour;
  const seatCharge = Math.max(0, seats - 1) * 18000;
  const total = perHour * duration + seatCharge;

  return {
    perHour,
    seatCharge,
    total
  };
}

export function buildLiveStudios(bookings: Booking[]) {
  const bookedSeats = new Map<string, number>();

  for (const booking of bookings) {
    const key = `${booking.studioId}:${booking.slot}`;
    bookedSeats.set(key, (bookedSeats.get(key) ?? 0) + booking.seats);
  }

  return initialStudios.map((studio) => ({
    ...studio,
    availability: studio.availability.map((slot) => ({
      ...slot,
      left: Math.max(0, slot.left - (bookedSeats.get(`${studio.id}:${slot.label}`) ?? 0))
    }))
  }));
}

