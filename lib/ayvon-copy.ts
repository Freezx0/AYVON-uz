import {
  type BackendMode,
  type ConciergeGoal,
  type ConciergePriority,
  type Locale,
  type SpaceMood,
  type Studio
} from '@/lib/ayvon-data';

type StudioText = Pick<Studio, 'city' | 'district' | 'tagline' | 'story' | 'host' | 'intensity' | 'amenities'>;

type MoodOption = {
  id: SpaceMood | 'all';
  label: string;
  blurb: string;
};

type SimpleOption<T extends string> = {
  id: T;
  label: string;
};

export type LocaleCopy = ReturnType<typeof getAyvonCopy>;

const studioText: Record<Locale, Record<string, StudioText>> = {
  ru: {
    'mirabad-courtyard': {
      city: 'Ташкент',
      district: 'Мирабад',
      tagline: 'Светлая комната для deep work, интервью и тихих созвонов.',
      story: 'Теплый двор, чайная станция и столы с правильным daylight вместо шума обычного коворкинга.',
      host: 'Daylight desk + чайный бар',
      intensity: 'почти бесшумно',
      amenities: ['Fiber Wi-Fi', '2K monitor', 'Tea station', 'Printer']
    },
    'yunusabad-signal': {
      city: 'Ташкент',
      district: 'Юнусабад',
      tagline: 'Акустическая комната для звонков, интервью и камерной записи.',
      story: 'Пространство собрано вокруг звука: мягкие стены, ring light и стабильный uplink без эха.',
      host: 'Acoustic shell + ring light',
      intensity: 'управляемый фон',
      amenities: ['Podcast kit', 'Ring light', 'Noise gate', 'Fast upload']
    },
    'anhor-team-loft': {
      city: 'Ташкент',
      district: 'Шайхантахур',
      tagline: 'Лофт для продуктовых сессий, ретро и быстрых воркшопов.',
      story: 'Гибкая мебель, большая магнитная стена и набор для быстрых спринтов без аренды на полдня.',
      host: 'Magnetic wall + sprint kit',
      intensity: 'живой темп',
      amenities: ['Workshop wall', 'Projector', 'Coffee bar', 'Standing tables']
    },
    'samarkand-ceramic': {
      city: 'Самарканд',
      district: 'Университетский квартал',
      tagline: 'Мягкое пространство для креативных спринтов, мудбордов и камерного брендинга.',
      story: 'Тактильные материалы, длинный communal table и стена, на которой можно собрать концепт за час.',
      host: 'Material library + sketch wall',
      intensity: 'мягкий шум',
      amenities: ['Mood wall', 'Material library', 'Analog speakers', 'Photo corner']
    },
    'bukhara-garden': {
      city: 'Бухара',
      district: 'Старый город',
      tagline: 'Тихий inner garden для короткой перезагрузки, чтения и личных 1:1.',
      story: 'Не кофейня и не отель: это короткие паузы между делами с воздухом, водой и мягким светом.',
      host: 'Courtyard tea + low seating',
      intensity: 'почти сад',
      amenities: ['Garden tea', 'Reading shelf', 'Charging docks', 'Fresh fruit water']
    }
  },
  uz: {
    'mirabad-courtyard': {
      city: 'Toshkent',
      district: 'Mirobod',
      tagline: 'Deep work, intervyu va sokin qo‘ng‘iroqlar uchun yorug‘ xona.',
      story: 'Issiq hovli, choy stansiyasi va kunduzgi yorug‘lik to‘g‘ri tushadigan stol joylari bilan tinch format.',
      host: 'Daylight desk + choy bari',
      intensity: 'deyarli shovqinsiz',
      amenities: ['Fiber Wi-Fi', '2K monitor', 'Tea station', 'Printer']
    },
    'yunusabad-signal': {
      city: 'Toshkent',
      district: 'Yunusobod',
      tagline: 'Qo‘ng‘iroqlar, intervyular va kichik yozuvlar uchun akustik xona.',
      story: 'Butun xona ovoz uchun yig‘ilgan: yumshoq devorlar, ring light va aks-sadosiz barqaror uplink.',
      host: 'Acoustic shell + ring light',
      intensity: 'nazoratli fon',
      amenities: ['Podcast kit', 'Ring light', 'Noise gate', 'Fast upload']
    },
    'anhor-team-loft': {
      city: 'Toshkent',
      district: 'Shayxontohur',
      tagline: 'Mahsulot sessiyalari, retro va tezkor workshoplar uchun loft.',
      story: 'Moslashuvchan mebel, katta magnit devor va yarim kunlik ijara talab qilmaydigan sprint to‘plami.',
      host: 'Magnetic wall + sprint kit',
      intensity: 'jonli ritm',
      amenities: ['Workshop wall', 'Projector', 'Coffee bar', 'Standing tables']
    },
    'samarkand-ceramic': {
      city: 'Samarqand',
      district: 'Universitet kvartali',
      tagline: 'Kreativ sprintlar, moodboard va kichik branding sessiyalari uchun yumshoq makon.',
      story: 'Taktil materiallar, uzun umumiy stol va bir soatda konsept yig‘ish mumkin bo‘lgan devor.',
      host: 'Material library + sketch wall',
      intensity: 'yumshoq shovqin',
      amenities: ['Mood wall', 'Material library', 'Analog speakers', 'Photo corner']
    },
    'bukhara-garden': {
      city: 'Buxoro',
      district: 'Eski shahar',
      tagline: 'Qisqa reset, o‘qish va shaxsiy 1:1 uchun tinch inner garden.',
      story: 'Bu na kofexona, na mehmonxona: ishlar orasida havo, suv va yumshoq yorug‘lik bilan qisqa pauza.',
      host: 'Courtyard tea + low seating',
      intensity: 'deyarli bog‘',
      amenities: ['Garden tea', 'Reading shelf', 'Charging docks', 'Fresh fruit water']
    }
  }
};

const moodOptionsByLocale: Record<Locale, MoodOption[]> = {
  ru: [
    { id: 'all', label: 'Все сценарии', blurb: 'Полный каталог пространств' },
    { id: 'focus', label: 'Фокус', blurb: 'Тишина, свет и концентрация' },
    { id: 'calls', label: 'Созвоны', blurb: 'Звонки, интервью и запись' },
    { id: 'team', label: 'Команда', blurb: 'Спринты, воркшопы и мини-встречи' },
    { id: 'creative', label: 'Креатив', blurb: 'Мудборды, скетчи и контент' },
    { id: 'reset', label: 'Перезагрузка', blurb: 'Пауза, дыхание и восстановление' }
  ],
  uz: [
    { id: 'all', label: 'Barcha ssenariylar', blurb: 'Barcha makonlar katalogi' },
    { id: 'focus', label: 'Fokus', blurb: 'Sokinlik, yorug‘lik va diqqat' },
    { id: 'calls', label: 'Qo‘ng‘iroqlar', blurb: 'Call, intervyu va yozuv' },
    { id: 'team', label: 'Jamoa', blurb: 'Sprint, workshop va uchrashuvlar' },
    { id: 'creative', label: 'Kreativ', blurb: 'Moodboard, sketch va kontent' },
    { id: 'reset', label: 'Reset', blurb: 'Pauza, nafas va tiklanish' }
  ]
};

const goalOptionsByLocale: Record<Locale, SimpleOption<ConciergeGoal>[]> = {
  ru: [
    { id: 'focus', label: 'Сфокусироваться' },
    { id: 'pitch', label: 'Собрать питч' },
    { id: 'record', label: 'Записать звонок или подкаст' },
    { id: 'create', label: 'Сделать креативную сессию' },
    { id: 'reset', label: 'Перезагрузиться между встречами' }
  ],
  uz: [
    { id: 'focus', label: 'Fokus qilish' },
    { id: 'pitch', label: 'Pitch tayyorlash' },
    { id: 'record', label: 'Qo‘ng‘iroq yoki podkast yozish' },
    { id: 'create', label: 'Kreativ sessiya qilish' },
    { id: 'reset', label: 'Uchrashuvlar orasida reset olish' }
  ]
};

const priorityOptionsByLocale: Record<Locale, SimpleOption<ConciergePriority>[]> = {
  ru: [
    { id: 'privacy', label: 'Нужна приватность' },
    { id: 'budget', label: 'Важен бюджет' },
    { id: 'ambience', label: 'Важна атмосфера' }
  ],
  uz: [
    { id: 'privacy', label: 'Maxfiylik muhim' },
    { id: 'budget', label: 'Byudjet muhim' },
    { id: 'ambience', label: 'Atmosfera muhim' }
  ]
};

const moodLabelsByLocale: Record<Locale, Record<SpaceMood, string>> = {
  ru: {
    focus: 'Deep work',
    calls: 'Созвоны',
    team: 'Командный спринт',
    creative: 'Креатив',
    reset: 'Перезагрузка'
  },
  uz: {
    focus: 'Deep work',
    calls: 'Qo‘ng‘iroqlar',
    team: 'Jamoa sprinti',
    creative: 'Kreativ',
    reset: 'Reset'
  }
};

const demandLabelsByLocale: Record<Locale, Record<'calm' | 'hot' | 'rush', string>> = {
  ru: {
    calm: 'спокойно',
    hot: 'в спросе',
    rush: 'пик'
  },
  uz: {
    calm: 'sokin',
    hot: 'talab yuqori',
    rush: 'pik'
  }
};

const metricLabelsByLocale: Record<Locale, Record<'light' | 'privacy' | 'acoustics' | 'hospitality', string>> = {
  ru: {
    light: 'Свет',
    privacy: 'Приватность',
    acoustics: 'Акустика',
    hospitality: 'Сервис'
  },
  uz: {
    light: 'Yorug‘lik',
    privacy: 'Maxfiylik',
    acoustics: 'Akustika',
    hospitality: 'Servis'
  }
};

const goalBadgeLabelsByLocale: Record<Locale, Record<ConciergeGoal, string>> = {
  ru: {
    focus: 'Фокус',
    pitch: 'Питч',
    record: 'Запись',
    create: 'Креатив',
    reset: 'Reset'
  },
  uz: {
    focus: 'Fokus',
    pitch: 'Pitch',
    record: 'Yozuv',
    create: 'Kreativ',
    reset: 'Reset'
  }
};

const backendLabelsByLocale: Record<Locale, Record<BackendMode, string>> = {
  ru: {
    supabase: 'Supabase live',
    'sqlite': 'SQLite база',
    cache: 'Кэш браузера'
  },
  uz: {
    supabase: 'Supabase live',
    'sqlite': 'SQLite bazasi',
    cache: 'Brauzer keshi'
  }
};

export function localizeStudios(studios: Studio[], locale: Locale) {
  const translation = studioText[locale];

  return studios.map((studio) => ({
    ...studio,
    ...translation[studio.id]
  }));
}

export function getMoodOptions(locale: Locale) {
  return moodOptionsByLocale[locale];
}

export function getGoalOptions(locale: Locale) {
  return goalOptionsByLocale[locale];
}

export function getPriorityOptions(locale: Locale) {
  return priorityOptionsByLocale[locale];
}

export function getMoodLabels(locale: Locale) {
  return moodLabelsByLocale[locale];
}

export function getDemandLabels(locale: Locale) {
  return demandLabelsByLocale[locale];
}

export function getMetricLabels(locale: Locale) {
  return metricLabelsByLocale[locale];
}

export function getGoalBadgeLabels(locale: Locale) {
  return goalBadgeLabelsByLocale[locale];
}

export function getBackendLabel(locale: Locale, backend: BackendMode) {
  return backendLabelsByLocale[locale][backend];
}

export function getAllCitiesLabel(locale: Locale) {
  return locale === 'uz' ? 'Barcha shaharlar' : 'Все города';
}

export function formatCurrency(value: number, locale: Locale) {
  const formattedValue = new Intl.NumberFormat(locale === 'uz' ? 'uz-UZ' : 'ru-RU', {
    maximumFractionDigits: 0
  }).format(value);

  return `${formattedValue}\u00A0${locale === 'uz' ? 'so\'m' : 'сум'}`;
}

export function formatDateLabel(value: string, locale: Locale) {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === 'uz' ? 'uz-UZ' : 'ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tashkent'
  }).format(new Date(parsed));
}

export function translateErrorMessage(message: string, locale: Locale) {
  const lower = message.toLowerCase();

  if (lower.includes('studio and slot are required')) {
    return locale === 'uz' ? 'Xona va slot tanlanishi kerak.' : 'Нужно выбрать комнату и слот.';
  }
  if (lower.includes('seats must be between')) {
    return locale === 'uz' ? 'Ishtirokchilar soni 1 dan 8 gacha bo‘lishi kerak.' : 'Количество гостей должно быть от 1 до 8.';
  }
  if (lower.includes('duration must be between')) {
    return locale === 'uz' ? 'Davomiylik 1 dan 4 soatgacha bo‘lishi kerak.' : 'Длительность должна быть от 1 до 4 часов.';
  }
  if (lower.includes('guest name is too short')) {
    return locale === 'uz' ? 'Mehmon ismi juda qisqa.' : 'Имя для брони слишком короткое.';
  }
  if (lower.includes('brief is too short')) {
    return locale === 'uz' ? 'Vazifa tavsifi juda qisqa.' : 'Описание задачи слишком короткое.';
  }
  if (lower.includes('name is too short')) {
    return locale === 'uz' ? 'Ism juda qisqa.' : 'Имя слишком короткое.';
  }
  if (lower.includes('email is invalid')) {
    return locale === 'uz' ? 'Email noto‘g‘ri kiritildi.' : 'Некорректный email.';
  }
  if (lower.includes('unknown studio')) {
    return locale === 'uz' ? 'Tanlangan xona topilmadi.' : 'Выбранная комната не найдена.';
  }
  if (lower.includes('requested slot was not found')) {
    return locale === 'uz' ? 'Tanlangan slot topilmadi.' : 'Выбранный слот не найден.';
  }
  if (lower.includes('team size exceeds')) {
    return locale === 'uz' ? 'Jamoa hajmi xona sig‘imidan katta.' : 'Размер команды превышает вместимость комнаты.';
  }
  if (lower.includes('not enough seats left')) {
    return locale === 'uz' ? 'Bu slotda yetarli joy qolmagan.' : 'В этом слоте не осталось достаточно мест.';
  }
  if (lower.includes('unable to create booking')) {
    return locale === 'uz' ? 'Bron yaratib bo‘lmadi.' : 'Не удалось создать бронь.';
  }
  if (lower.includes('unable to join waitlist')) {
    return locale === 'uz' ? 'Waitlist ga qo‘shib bo‘lmadi.' : 'Не удалось записать в waitlist.';
  }
  if (lower.includes('hosted deployment requires supabase')) {
    return locale === 'uz'
      ? 'Live deploy uchun Supabase kerak. Vercel env ga NEXT_PUBLIC_SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY qo‘shing.'
      : 'Для live deploy нужен Supabase. Добавьте NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в env Vercel.';
  }
  if (lower.includes('relation') && lower.includes('ayvon_')) {
    return locale === 'uz'
      ? 'Supabase jadvali topilmadi. `supabase/ayvon-schema.sql` ni production bazaga qo‘llang.'
      : 'Таблицы Supabase не найдены. Примените `supabase/ayvon-schema.sql` к production базе.';
  }
  if (lower.includes('supabase query failed')) {
    return locale === 'uz' ? 'Supabase so‘rovi bajarilmadi.' : 'Запрос к Supabase не выполнился.';
  }

  return message;
}

export function getAyvonCopy(locale: Locale) {
  if (locale === 'uz') {
    return {
      locale,
      common: {
        languageLabel: 'Til',
        ru: 'RU',
        uz: 'UZ',
        syncingBackend: 'Backend ulanmoqda...'
      },
      hero: {
        brandSubtitle: 'O‘zbekiston uchun vibe-based micro spaces',
        navHome: 'Bosh sahifa',
        navAbout: 'Sayt haqida',
        navCatalog: 'Katalog',
        navBooking: 'Bron qilish',
        navAnalytics: 'Analitika',
        navLaunch: 'Erta kirish',
        eyebrow: 'Konsept mahsulot',
        title: 'Bu platformada xona faqat fotosiga emas, vazifa ritmiga qarab tanlanadi.',
        description:
          'AYVON O‘zbekiston bozori uchun o‘ylangan servis: deep work, qo‘ng‘iroqlar, mini-jamoa, kreativ sessiya va qisqa reset uchun 60-120 daqiqalik micro-space bronlash platformasi.',
        primaryCta: 'Bron yig‘ish',
        secondaryCta: 'Bron panelini ochish',
        metrics: {
          liveSeats: 'Bo‘sh joylar',
          liveSeatsCaption: 'tarmoq bo‘ylab mavjud joylar',
          occupancy: 'Bandlik',
          occupancyCaption: 'haftalik o‘rtacha yuklama',
          proof: 'Baholash',
          proofCaption: 'atmosfera bo‘yicha o‘rtacha reyting'
        },
        boardTitle: 'Launch paneli',
        ideaLabel: 'Asosiy g‘oya',
        ideaTitle: 'Xona ijara formatiga emas, vibe ga qarab tanlanadi.',
        ideaDescription:
          'Foydalanuvchi ssenariy, jamoa va ustuvor yo‘nalishni tanlaydi. Interfeys esa mos makon va jonli mavjud slotlarni ko‘rsatadi.',
        boardStats: {
          cities: 'Shaharlar',
          bookings: 'Bronlar',
          waitlist: 'Navbat',
          speed: 'Tezlik'
        },
        nextMoveLabel: 'Keyingi yaxshi qadam',
        nextMoveButton: 'Launch bo‘limini ochish'
      },
      about: {
        eyebrow: 'Sayt haqida',
        title: 'AYVON xonani rasmiga emas, ish ssenariysiga qarab bron qilishga yordam beradi.',
        description:
          'Foydalanuvchi oddiy joyni emas, kerakli holatni tanlaydi: deep work uchun sukunat, call uchun akustika, jamoa uchun ritm, kreativ uchun material hissi yoki uchrashuvlar orasida yumshoq reset.',
        metrics: {
          cities: 'Shaharlar',
          liveSeats: 'Bo‘sh joylar',
          occupancy: 'Bandlik'
        },
        howItWorks: 'Qanday ishlaydi',
        steps: [
          {
            title: 'Ssenariyni tanlaysiz',
            description: 'Deep work, calls, jamoa, kreativ yoki reset.'
          },
          {
            title: 'Jonli mavjudlikni ko‘rasiz',
            description: 'Slot, narx, jamoa va makon mosligi bitta panelda.'
          },
          {
            title: 'Darhol bron qilasiz',
            description: 'Mavjud joylar shu zahoti kamayadi, yozuv esa live feed ga tushadi.'
          }
        ],
        insideEyebrow: 'Mahsulot ichida',
        insideTitle: 'Katalog, booking cockpit, matchmaker va talab analitikasi bir joyda.',
        cta: 'Bron qilish',
        chips: ['Jonli slotlar', 'Xona profili', 'A\'zo narxi', 'Talab signallari', 'Navbat', 'Backend sinxroni']
      },
      catalog: {
        eyebrow: 'Katalog',
        title: 'Holat va vazifaga qarab yig‘ilgan makonlar.',
        cardsFound: (count: number) => `${count} ta xona filtrdan o‘tdi`,
        noCards: 'Filtrlar juda qattiq',
        searchLabel: 'Shahar, ssenariy yoki tavsif bo‘yicha qidirish',
        searchPlaceholder: 'Masalan: sokin, Samarqand, podkast',
        cityLabel: 'Shahar',
        budgetLabel: 'Soatlik byudjet',
        reset: 'Tozalash',
        emptyTitle: 'Hech narsa topilmadi',
        emptyDescription: 'Byudjetni oshirib ko‘ring, qidiruvni tozalang yoki boshqa ssenariyni tanlang.',
        emptyCta: 'Butun katalogni qaytarish',
        priceFrom: 'Dan',
        rating: 'Reyting',
        available: 'Slotlar bo‘yicha bo‘sh joy'
      },
      booking: {
        eyebrow: 'Bron paneli',
        scenario: 'Ssenariy',
        intensity: 'Ritm',
        roomParamsEyebrow: 'Xona parametrlari',
        roomParamsTitle: 'Bron qilishdan oldin tezkor room profile.',
        upToGuests: (count: number) => `${count} tagacha mehmon`,
        hostFormat: 'Host format',
        response: 'Javob',
        roomMood: 'Xona kayfiyati',
        amenities: 'Qulayliklar',
        slots: 'Slotlar',
        seatsNeeded: (count: number) => `Kerakli joylar: ${count}`,
        duration: 'Davomiylik',
        durationValue: (count: number) => `${count} soat`,
        team: 'Jamoa',
        teamValue: (count: number) => `${count} kishi`,
        membership: 'A\'zolik',
        membershipDescription: 'Member narxi va ustuvor taklif oynasini beradi.',
        perHour: 'Soatiga',
        saving: 'Tejash',
        guestLabel: 'Bron uchun ism',
        guestPlaceholder: 'Masalan, Kamila',
        briefLabel: 'Bu slotda nima qilasiz',
        briefPlaceholder: 'Intervyu, mini-sprint, podkast yozuvi yoki uchrashuvlar orasidagi reset...',
        total: 'Jami',
        reserve: 'Hozir bron qilish',
        reserveBusy: 'Bron saqlanmoqda...',
        backendNote: (slot: string) => `Bron backend orqali o‘tadi: ${slot} slotidagi joylar darhol kamayadi va yozuv live feed ga chiqadi.`,
        validateReservation: 'Ismni, vazifani va yetarli o‘rni bor slotni to‘ldiring.',
        successTitle: 'Bron qilindi',
        successDescription: (room: string, slot: string) => `${room} uchun ${slot} slot band qilindi.`,
        successHint: 'Slot yangilandi va bron live feed ga chiqdi.'
      },
      concierge: {
        eyebrow: 'Mos tanlov',
        title: 'Vazifa, jamoa hajmi va atmosferaga qarab tezkor tavsiya.',
        whatMatters: 'Hozir eng muhim narsa nima',
        priority: 'Asosiy ustuvorlik',
        teamSize: 'Necha kishi keladi',
        topRecommendation: 'Eng yaxshi tavsiya',
        matchScore: 'Moslik balli',
        bestFor: 'Eng yaxshi ishlatish',
        atmosphere: 'Atmosfera',
        openStudio: 'Bu space ni cockpit da ochish'
      },
      signals: {
        eyebrow: 'Signallar',
        title: 'Tanlangan makon bo‘yicha talab analitikasi.',
        description: 'Rejimlarni almashtiring va qaysi nuqtada talab kuchayishini ko‘ring: bandlik, waitlist va haftalik tushum faol kartaga bog‘langan.',
        occupancy: 'Bandlik',
        revenue: 'Tushum',
        selected: 'Tanlangan',
        satisfaction: 'Qoniqish',
        satisfactionCaption: 'tashrifdan keyingi o‘rtacha his',
        peakWaitlist: 'Waitlist piki',
        peakWaitlistCaption: 'navbatdagi maksimal talab',
        strengths: 'Kuchli tomonlar',
        whyProduct: 'Nega bu allaqachon mahsulot, oddiy maket emas',
        reasons: [
          'Filtrlar katalog va faol kartani real o‘zgartiradi.',
          'Bron slot mavjudligini kamaytiradi va live feed ga yoziladi.',
          'Matchmaker maqsad, jamoa hajmi va ustuvorlik bo‘yicha tavsiya beradi.',
          'State lokal saqlanadi, shuning uchun demo qayta yuklanganda ham saqlanadi.'
        ],
        revenueTooltipLabel: 'Tushum',
        revenueTooltipValue: (value: number) => `${value.toFixed(1)} mln so‘m`
      },
      launch: {
        liveFeedEyebrow: 'Jonli oqim',
        liveFeedTitle: 'So‘nggi bronlar va launch faolligi.',
        emptyTitle: 'Hali bo‘sh',
        emptyDescription: 'Cockpit ichida birinchi bronni yarating. U shu yerda kod, vazifa va umumiy summa bilan paydo bo‘ladi.',
        bookedBy: 'Bron qilgan',
        prelaunchEyebrow: 'Erta kirish',
        prelaunchTitle: 'Erta kirishga qo‘shiling va member pricing oling.',
        prelaunchDescription: 'Bu forma ham ishlaydi: arizalar backend store ga tushadi va yuqoridagi launch board da hisobga olinadi.',
        backendMode: 'Backend rejimi',
        nameLabel: 'Ism',
        namePlaceholder: 'Masalan, Aziza',
        emailLabel: 'Email',
        joinWaitlist: 'Navbatga yozilish',
        joinWaitlistBusy: 'Ariza saqlanmoqda...',
        currentQueue: 'Joriy navbat',
        bestCity: 'Asosiy shahar',
        bullets: [
          'Slotlar ochilishidan 24 soat oldin priority booking oynasi.',
          'Member pricing iqtisodni cockpit ichida avtomatik hisoblaydi.',
          'Production uchun keyingi qadam: auth, online payment va kalendar bildirishnomalari.'
        ],
        recentWaitlist: 'Navbatdagi so‘nggi arizalar',
        waitlistAdded: (name: string, backend: string) => `${name} navbatga qo‘shildi. Saqlandi: ${backend}.`,
        bookingCreated: (id: string, slot: string, backend: string) => `Bron ${id} yaratildi. Slot ${slot} saqlandi: ${backend}.`,
        waitlistValidation: 'Waitlist uchun ism va to‘g‘ri email kiriting.',
        syncError: (message: string) => `Backend bilan sinxronlashmadi: ${message}`,
        syncErrorShort: 'Backend bilan sinxronlashmadi.'
      }
    };
  }

  return {
    locale,
    common: {
      languageLabel: 'Язык',
      ru: 'RU',
      uz: 'UZ',
      syncingBackend: 'Синхронизируем backend...'
    },
    hero: {
      brandSubtitle: 'Vibe-based micro spaces для Узбекистана',
      navHome: 'Главная',
      navAbout: 'О сайте',
      navCatalog: 'Каталог',
      navBooking: 'Забронировать',
      navAnalytics: 'Аналитика',
      navLaunch: 'Ранний доступ',
      eyebrow: 'Концепт продукта',
      title: 'Платформа, где комнату выбирают по ритму задачи, а не только по фото.',
      description:
        'AYVON это сервис для рынка Узбекистана: платформа бронирования micro-spaces на 60-120 минут под deep work, звонки, мини-команды, креативные сессии и короткие reset-паузы.',
      primaryCta: 'Собрать бронь',
      secondaryCta: 'Открыть бронь',
      metrics: {
        liveSeats: 'Свободные места',
        liveSeatsCaption: 'мест в сети прямо сейчас',
        occupancy: 'Загрузка',
        occupancyCaption: 'средняя недельная загрузка',
        proof: 'Рейтинг',
        proofCaption: 'средняя оценка атмосферы'
      },
      boardTitle: 'Панель запуска',
      ideaLabel: 'Главная идея',
      ideaTitle: 'Комнату выбирают по атмосфере, а не по долгой аренде.',
      ideaDescription:
        'Пользователь задает сценарий, команду и приоритет. Интерфейс сам показывает лучший space и живую доступность слотов.',
      boardStats: {
        cities: 'Города',
        bookings: 'Брони',
        waitlist: 'Очередь',
        speed: 'Скорость'
      },
      nextMoveLabel: 'Следующий лучший шаг',
      nextMoveButton: 'Открыть launch-блок'
    },
    about: {
      eyebrow: 'О сайте',
      title: 'AYVON помогает бронировать комнату по рабочему сценарию, а не по случайной картинке.',
      description:
        'Пользователь выбирает не просто помещение, а нужную атмосферу: тишину для deep work, акустику для calls, темп для команды, тактильную среду для creative или мягкий reset между встречами.',
      metrics: {
        cities: 'Города',
        liveSeats: 'Свободные места',
        occupancy: 'Загрузка'
      },
      howItWorks: 'Как это работает',
      steps: [
        {
          title: 'Выбираешь сценарий',
          description: 'Deep work, calls, team, creative или reset.'
        },
        {
          title: 'Смотришь live availability',
          description: 'Слот, цена, команда и fit пространства уже на одной панели.'
        },
        {
          title: 'Бронируешь сразу',
          description: 'Доступность уменьшается мгновенно, запись появляется в live feed.'
        }
      ],
      insideEyebrow: 'Что внутри продукта',
      insideTitle: 'Каталог, booking cockpit, matchmaker и аналитика спроса в одном интерфейсе.',
      cta: 'Забронировать',
      chips: ['Живые слоты', 'Профиль комнаты', 'Цена для участников', 'Сигналы спроса', 'Очередь', 'Синхронизация']
    },
    catalog: {
      eyebrow: 'Каталог',
      title: 'Пространства, собранные под конкретное состояние и задачу.',
      cardsFound: (count: number) => `${count} карточек проходят по фильтрам`,
      noCards: 'Фильтры слишком жесткие',
      searchLabel: 'Поиск по городу, сценарию или описанию',
      searchPlaceholder: 'Например: тихо, Самарканд, подкаст',
      cityLabel: 'Город',
      budgetLabel: 'Бюджет в час',
      reset: 'Сбросить',
      emptyTitle: 'Ничего не найдено',
      emptyDescription: 'Попробуйте поднять бюджет, очистить поиск или выбрать другой сценарий.',
      emptyCta: 'Вернуть весь каталог',
      priceFrom: 'От',
      rating: 'Рейтинг',
      available: 'Свободно по слотам'
    },
    booking: {
      eyebrow: 'Панель брони',
      scenario: 'Сценарий',
      intensity: 'Интенсивность',
      roomParamsEyebrow: 'Параметры комнаты',
      roomParamsTitle: 'Быстрый room profile перед бронированием.',
      upToGuests: (count: number) => `До ${count} гостей`,
      hostFormat: 'Формат хоста',
      response: 'Ответ',
      roomMood: 'Атмосфера комнаты',
      amenities: 'Удобства',
      slots: 'Слоты',
      seatsNeeded: (count: number) => `Нужно мест: ${count}`,
      duration: 'Длительность',
      durationValue: (count: number) => `${count} ч.`,
      team: 'Команда',
      teamValue: (count: number) => `${count} человек`,
      membership: 'Участие',
      membershipDescription: 'Даёт member price и приоритетное окно бронирования.',
      perHour: 'В час',
      saving: 'Экономия',
      guestLabel: 'Имя для брони',
      guestPlaceholder: 'Например, Kamila',
      briefLabel: 'Что вы делаете в этом слоте',
      briefPlaceholder: 'Собеседование, мини-спринт, запись подкаста или reset между встречами...',
      total: 'Итого',
      reserve: 'Забронировать сейчас',
      reserveBusy: 'Сохраняем бронь...',
      backendNote: (slot: string) => `Бронь идет через backend: слот ${slot} уменьшается сразу, а запись появляется в live feed.`,
      validateReservation: 'Заполните имя, задачу и выберите слот с достаточной вместимостью.',
      successTitle: 'Бронь оформлена',
      successDescription: (room: string, slot: string) => `${room} забронирован на слот ${slot}.`,
      successHint: 'Слот обновлён, а запись уже появилась в live feed.'
    },
    concierge: {
      eyebrow: 'Подборщик',
      title: 'Быстрый подбор пространства под задачу, размер команды и характер атмосферы.',
      whatMatters: 'Что сейчас важнее всего',
      priority: 'Какой главный приоритет',
      teamSize: 'Сколько людей придёт',
      topRecommendation: 'Лучшая рекомендация',
      matchScore: 'Индекс совпадения',
      bestFor: 'Лучше всего для',
      atmosphere: 'Атмосфера',
      openStudio: 'Открыть этот space в cockpit'
    },
    signals: {
      eyebrow: 'Сигналы',
      title: 'Аналитика спроса для выбранного пространства.',
      description: 'Переключайте режимы и смотрите, где формируется спрос: загрузка, очередь и недельная выручка уже привязаны к активной карточке.',
      occupancy: 'Загрузка',
      revenue: 'Выручка',
      selected: 'Выбрано',
      satisfaction: 'Удовлетворенность',
      satisfactionCaption: 'средняя эмоция после визита',
      peakWaitlist: 'Пиковая очередь',
      peakWaitlistCaption: 'максимум запросов в waitlist',
      strengths: 'Сильные стороны',
      whyProduct: 'Почему это уже продукт, а не макет',
      reasons: [
        'Фильтры реально меняют каталог и активную карточку.',
        'Бронирование уменьшает доступность слота и записывается в live feed.',
        'Подборщик советует пространство по цели, размеру команды и приоритету.',
        'Весь state сохраняется локально, поэтому демо не разваливается после перезагрузки.'
      ],
      revenueTooltipLabel: 'Выручка',
      revenueTooltipValue: (value: number) => `${value.toFixed(1)} млн сум`
    },
    launch: {
      liveFeedEyebrow: 'Живой поток',
      liveFeedTitle: 'Последние бронирования и активность запуска.',
      emptyTitle: 'Пока пусто',
      emptyDescription: 'Создайте первую бронь в cockpit. Она сразу появится здесь с кодом, задачей и итоговой суммой.',
      bookedBy: 'Забронировал',
      prelaunchEyebrow: 'Ранний доступ',
      prelaunchTitle: 'Войти в ранний доступ и получить member pricing.',
      prelaunchDescription: 'Эта форма тоже рабочая: заявки попадают в backend store и учитываются в верхнем launch board.',
      backendMode: 'Backend mode',
      nameLabel: 'Имя',
      namePlaceholder: 'Например, Aziza',
      emailLabel: 'Email',
      joinWaitlist: 'Встать в очередь',
      joinWaitlistBusy: 'Сохраняем заявку...',
      currentQueue: 'Текущая очередь',
      bestCity: 'Главный город',
      bullets: [
        'Priority booking windows за 24 часа до открытия слотов.',
        'Member pricing автоматически считает экономию прямо в cockpit.',
        'Следующий шаг для продакшена: auth, online payment и календарные уведомления.'
      ],
      recentWaitlist: 'Последние в очереди',
      waitlistAdded: (name: string, backend: string) => `Очередь обновлена: ${name} добавлен через ${backend}.`,
      bookingCreated: (id: string, slot: string, backend: string) => `Бронь ${id} создана. Слот ${slot} сохранён в ${backend}.`,
      waitlistValidation: 'Для waitlist укажите имя и корректный email.',
      syncError: (message: string) => `Не удалось синхронизировать backend: ${message}`,
      syncErrorShort: 'Не удалось синхронизировать backend.'
    }
  };
}

