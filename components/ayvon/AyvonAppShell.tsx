'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useDeferredValue, useEffect, useRef, useState } from 'react';
import { AboutSection } from '@/components/ayvon/AboutSection';
import { BookingSuccessModal } from '@/components/ayvon/BookingSuccessModal';
import { BookingCockpit } from '@/components/ayvon/BookingCockpit';
import { CatalogSection } from '@/components/ayvon/CatalogSection';
import { ConciergeSection } from '@/components/ayvon/ConciergeSection';
import { AyvonTopBar } from '@/components/ayvon/AyvonTopBar';
import { HeroSection } from '@/components/ayvon/HeroSection';
import { LaunchSection } from '@/components/ayvon/LaunchSection';
import { SignalsSection } from '@/components/ayvon/SignalsSection';
import {
  type BackendMode,
  type Booking,
  type ConciergeGoal,
  type ConciergePriority,
  type LaunchState,
  type Locale,
  type SpaceMood,
  type WaitlistEntry,
  buildLiveStudios,
  getRecommendation,
  initialStudios
} from '@/lib/ayvon-data';
import {
  getAllCitiesLabel,
  getAyvonCopy,
  getBackendLabel,
  getGoalOptions,
  getMoodOptions,
  getPriorityOptions,
  localizeStudios,
  translateErrorMessage,
  formatCurrency
} from '@/lib/ayvon-copy';

const storageKey = 'ayvon-launch-cache-v2';
const localeKey = 'ayvon-locale-v1';
const uiStateKey = 'ayvon-ui-state-v1';

type StatusTone = 'success' | 'error' | 'info';
export type AyvonView = 'home' | 'about' | 'catalog' | 'booking' | 'analytics' | 'launch';

async function readResponse(response: Response) {
  const data = (await response.json()) as LaunchState & { error?: string };
  if (!response.ok || data.error) {
    throw new Error(data.error ?? 'Request failed.');
  }

  return data;
}

function isStudioId(value: string) {
  return initialStudios.some((studio) => studio.id === value);
}

export function AyvonAppShell({ view }: { view: AyvonView }) {
  const router = useRouter();

  const [locale, setLocale] = useState<Locale>('ru');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [backendMode, setBackendMode] = useState<BackendMode>('cache');
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [selectedMood, setSelectedMood] = useState<SpaceMood | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState(getAllCitiesLabel('ru'));
  const [budgetLimit, setBudgetLimit] = useState(220000);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const [selectedStudioId, setSelectedStudioId] = useState(initialStudios[0].id);
  const [selectedSlot, setSelectedSlot] = useState(initialStudios[0].availability[0].label);
  const [duration, setDuration] = useState(2);
  const [seats, setSeats] = useState(2);
  const [membership, setMembership] = useState(true);
  const [guest, setGuest] = useState('');
  const [brief, setBrief] = useState('');
  const [chartMode, setChartMode] = useState<'occupancy' | 'revenue'>('occupancy');
  const [plannerGoal, setPlannerGoal] = useState<ConciergeGoal>('focus');
  const [plannerPriority, setPlannerPriority] = useState<ConciergePriority>('ambience');
  const [plannerTeamSize, setPlannerTeamSize] = useState(2);
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusTone, setStatusTone] = useState<StatusTone>('info');
  const [bookingSuccess, setBookingSuccess] = useState<{
    id: string;
    room: string;
    slot: string;
  } | null>(null);

  const copy = getAyvonCopy(locale);
  const allCitiesLabel = getAllCitiesLabel(locale);
  const localeRef = useRef(locale);
  const launchCopyRef = useRef(copy.launch);

  useEffect(() => {
    try {
      const savedLocale = window.localStorage.getItem(localeKey);
      if (savedLocale === 'ru' || savedLocale === 'uz') {
        setLocale(savedLocale);
      }

      const savedUi = window.localStorage.getItem(uiStateKey);
      if (savedUi) {
        const parsed = JSON.parse(savedUi) as Partial<{
          selectedMood: SpaceMood | 'all';
          budgetLimit: number;
          search: string;
          selectedStudioId: string;
          selectedSlot: string;
          duration: number;
          seats: number;
          membership: boolean;
          plannerGoal: ConciergeGoal;
          plannerPriority: ConciergePriority;
          plannerTeamSize: number;
        }>;

        if (parsed.selectedMood) {
          setSelectedMood(parsed.selectedMood);
        }
        if (typeof parsed.budgetLimit === 'number') {
          setBudgetLimit(parsed.budgetLimit);
        }
        if (typeof parsed.search === 'string') {
          setSearch(parsed.search);
        }
        if (parsed.selectedStudioId && isStudioId(parsed.selectedStudioId)) {
          setSelectedStudioId(parsed.selectedStudioId);
        }
        if (typeof parsed.selectedSlot === 'string') {
          setSelectedSlot(parsed.selectedSlot);
        }
        if (typeof parsed.duration === 'number') {
          setDuration(Math.max(1, Math.min(4, parsed.duration)));
        }
        if (typeof parsed.seats === 'number') {
          setSeats(Math.max(1, Math.min(8, parsed.seats)));
        }
        if (typeof parsed.membership === 'boolean') {
          setMembership(parsed.membership);
        }
        if (parsed.plannerGoal) {
          setPlannerGoal(parsed.plannerGoal);
        }
        if (parsed.plannerPriority) {
          setPlannerPriority(parsed.plannerPriority);
        }
        if (typeof parsed.plannerTeamSize === 'number') {
          setPlannerTeamSize(Math.max(1, Math.min(8, parsed.plannerTeamSize)));
        }
      }
    } catch {
      window.localStorage.removeItem(localeKey);
      window.localStorage.removeItem(uiStateKey);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(localeKey, locale);
    setSelectedCity(getAllCitiesLabel(locale));
  }, [locale]);

  useEffect(() => {
    localeRef.current = locale;
    launchCopyRef.current = copy.launch;
  }, [locale, copy.launch]);

  useEffect(() => {
    window.localStorage.setItem(
      uiStateKey,
      JSON.stringify({
        selectedMood,
        budgetLimit,
        search,
        selectedStudioId,
        selectedSlot,
        duration,
        seats,
        membership,
        plannerGoal,
        plannerPriority,
        plannerTeamSize
      })
    );
  }, [
    budgetLimit,
    duration,
    membership,
    plannerGoal,
    plannerPriority,
    plannerTeamSize,
    search,
    seats,
    selectedMood,
    selectedSlot,
    selectedStudioId
  ]);

  useEffect(() => {
    if (!bookingSuccess) {
      return;
    }

    const timer = window.setTimeout(() => setBookingSuccess(null), 3600);
    return () => window.clearTimeout(timer);
  }, [bookingSuccess]);

  useEffect(() => {
    let isActive = true;

    try {
      const cached = window.localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached) as Partial<LaunchState>;
        if (parsed.bookings?.length) {
          setBookings(parsed.bookings);
        }
        if (parsed.waitlist?.length) {
          setWaitlist(parsed.waitlist);
        }
        setBackendMode('cache');
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }

    async function loadState() {
      try {
        const response = await fetch('/api/launch-state', { cache: 'no-store' });
        const data = await readResponse(response);

        if (!isActive) {
          return;
        }

        startTransition(() => {
          setBookings(data.bookings);
          setWaitlist(data.waitlist);
          setBackendMode(data.backend);
        });
      } catch (error) {
        if (isActive) {
          setStatusTone('error');
          setStatusMessage(
            error instanceof Error
              ? launchCopyRef.current.syncError(translateErrorMessage(error.message, localeRef.current))
              : launchCopyRef.current.syncErrorShort
          );
        }
      } finally {
        if (isActive) {
          setIsLoadingState(false);
        }
      }
    }

    void loadState();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        bookings,
        waitlist
      })
    );
  }, [bookings, waitlist]);

  const studios = localizeStudios(buildLiveStudios(bookings), locale);
  const cityOptions = [allCitiesLabel, ...new Set(studios.map((studio) => studio.city))];
  const moodOptions = getMoodOptions(locale);
  const goalOptions = getGoalOptions(locale);
  const priorityOptions = getPriorityOptions(locale);

  const visibleStudios = studios.filter((studio) => {
    const matchesMood = selectedMood === 'all' || studio.mood === selectedMood;
    const matchesCity = selectedCity === allCitiesLabel || studio.city === selectedCity;
    const matchesBudget = studio.pricePerHour <= budgetLimit;
    const haystack = `${studio.name} ${studio.city} ${studio.district} ${studio.tagline} ${studio.story}`.toLowerCase();
    const matchesSearch = deferredSearch.length === 0 || haystack.includes(deferredSearch);
    return matchesMood && matchesCity && matchesBudget && matchesSearch;
  });

  useEffect(() => {
    if (visibleStudios.length === 0) {
      return;
    }

    if (!visibleStudios.some((studio) => studio.id === selectedStudioId)) {
      setSelectedStudioId(visibleStudios[0].id);
    }
  }, [selectedStudioId, visibleStudios]);

  const selectedStudio = studios.find((studio) => studio.id === selectedStudioId) ?? studios[0];

  useEffect(() => {
    const slotIsValid = selectedStudio.availability.some((slot) => slot.label === selectedSlot && slot.left >= seats);
    if (slotIsValid) {
      return;
    }

    const nextSlot = selectedStudio.availability.find((slot) => slot.left >= seats) ?? selectedStudio.availability[0];
    setSelectedSlot(nextSlot.label);
  }, [seats, selectedSlot, selectedStudio]);

  const selectedSlotInfo =
    selectedStudio.availability.find((slot) => slot.label === selectedSlot) ?? selectedStudio.availability[0];
  const recommendation = getRecommendation(studios, plannerGoal, plannerTeamSize, plannerPriority, locale);
  const liveSeats = studios.reduce(
    (sum, studio) => sum + studio.availability.reduce((slotSum, slot) => slotSum + slot.left, 0),
    0
  );
  const averageRating = studios.reduce((sum, studio) => sum + studio.rating, 0) / Math.max(studios.length, 1);
  const averageOccupancy = Math.round(
    studios.reduce(
      (sum, studio) =>
        sum + studio.trend.reduce((trendSum, point) => trendSum + point.occupancy, 0) / studio.trend.length,
      0
    ) / Math.max(studios.length, 1)
  );
  const perHour = membership ? selectedStudio.memberPrice : selectedStudio.pricePerHour;
  const bookingTotal = perHour * duration + Math.max(0, seats - 1) * 18000;
  const savings = Math.max(0, (selectedStudio.pricePerHour - selectedStudio.memberPrice) * duration);
  const canReserve =
    guest.trim().length > 1 &&
    brief.trim().length > 4 &&
    selectedSlotInfo.left >= seats &&
    selectedStudio.seats >= seats;

  function resetFilters() {
    setSelectedMood('all');
    setSelectedCity(allCitiesLabel);
    setBudgetLimit(220000);
    setSearch('');
  }

  async function reserveSelectedStudio() {
    if (isSubmittingBooking) {
      return;
    }

    if (!canReserve) {
      setStatusTone('error');
      setStatusMessage(copy.booking.validateReservation);
      return;
    }

    setIsSubmittingBooking(true);
    setStatusMessage('');
    setBookingSuccess(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studioId: selectedStudio.id,
          slot: selectedSlotInfo.label,
          seats,
          duration,
          membership,
          guest,
          brief
        })
      });
      const data = await readResponse(response);

      startTransition(() => {
        setBookings(data.bookings);
        setWaitlist(data.waitlist);
        setBackendMode(data.backend);
      });

      const createdBooking = data.bookings[0];
      setGuest('');
      setBrief('');
      setStatusTone('success');
      setStatusMessage(copy.launch.bookingCreated(createdBooking.id, createdBooking.slot, getBackendLabel(locale, data.backend)));
      setBookingSuccess({
        id: createdBooking.id,
        room: selectedStudio.name,
        slot: createdBooking.slot
      });
    } catch (error) {
      setStatusTone('error');
      setStatusMessage(error instanceof Error ? translateErrorMessage(error.message, locale) : copy.booking.validateReservation);
    } finally {
      setIsSubmittingBooking(false);
    }
  }

  async function joinWaitlist() {
    if (isSubmittingWaitlist) {
      return;
    }

    if (waitlistName.trim().length < 2 || !/\S+@\S+\.\S+/.test(waitlistEmail)) {
      setStatusTone('error');
      setStatusMessage(copy.launch.waitlistValidation);
      return;
    }

    setIsSubmittingWaitlist(true);
    setStatusMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: waitlistName,
          email: waitlistEmail,
          goal: plannerGoal,
          city: selectedCity === allCitiesLabel ? recommendation.studio.city : selectedCity
        })
      });
      const data = await readResponse(response);

      startTransition(() => {
        setBookings(data.bookings);
        setWaitlist(data.waitlist);
        setBackendMode(data.backend);
      });

      const latestEntry = data.waitlist[0];
      setWaitlistName('');
      setWaitlistEmail('');
      setStatusTone('success');
      setStatusMessage(copy.launch.waitlistAdded(latestEntry.name, getBackendLabel(locale, data.backend)));
    } catch (error) {
      setStatusTone('error');
      setStatusMessage(error instanceof Error ? translateErrorMessage(error.message, locale) : copy.launch.waitlistValidation);
    } finally {
      setIsSubmittingWaitlist(false);
    }
  }

  const backendStatusLabel = isLoadingState ? copy.common.syncingBackend : getBackendLabel(locale, backendMode);

  const routeCards: Array<{ href: Route; title: string; description: string }> =
    locale === 'uz'
      ? [
          { href: '/about', title: 'Sayt haqida', description: 'Servis qanday ishlashini va nega bu format yangi ekanini ko‘ring.' },
          { href: '/catalog', title: 'Katalog', description: 'Barcha xonalarni vibe, shahar va byudjet bo‘yicha ko‘ring.' },
          { href: '/booking', title: 'Bron qilish', description: 'Slot tanlang, narxni hisoblang va real bron yarating.' },
          { href: '/analytics', title: 'Analitika', description: 'Matchmaker va demand signals orqali eng to‘g‘ri joyni toping.' },
          { href: '/launch', title: 'Launch', description: 'Live feed, waitlist va early access oqimini kuzating.' }
        ]
      : [
          { href: '/about', title: 'О сайте', description: 'Посмотреть как работает сервис и в чем ценность формата.' },
          { href: '/catalog', title: 'Каталог', description: 'Открыть все комнаты по vibe, городу и бюджету.' },
          { href: '/booking', title: 'Бронирование', description: 'Выбрать слот, посчитать цену и создать реальную бронь.' },
          { href: '/analytics', title: 'Аналитика', description: 'Подобрать пространство через matchmaker и demand signals.' },
          { href: '/launch', title: 'Launch', description: 'Следить за live feed, waitlist и early access потоком.' }
        ];

  const pageLead =
    view === 'about'
      ? locale === 'uz'
        ? {
            eyebrow: 'Sayt haqida',
            title: 'AYVON qanday ishlashini alohida sahifada ko‘ring.',
            description: 'Bu yerda servis g‘oyasi, ishlash oqimi va mahsulot ichidagi asosiy bloklar jamlangan.'
          }
        : {
            eyebrow: 'О сайте',
            title: 'AYVON теперь разделен на отдельные страницы.',
            description: 'Здесь собрана идея сервиса, рабочий сценарий пользователя и основные блоки продукта.'
          }
      : view === 'catalog'
        ? locale === 'uz'
          ? {
              eyebrow: 'Katalog sahifasi',
              title: 'Xonalarni alohida katalog sahifasida ko‘ring.',
              description: 'Bu sahifa faqat tanlashga qaratilgan: filter, qidiruv va active studio fokusda.'
            }
          : {
              eyebrow: 'Страница каталога',
              title: 'Комнаты вынесены в отдельный каталог.',
              description: 'Эта страница сфокусирована на выборе: фильтры, поиск и активная карточка без лишних блоков.'
            }
        : view === 'booking'
          ? locale === 'uz'
            ? {
                eyebrow: 'Bron sahifasi',
                title: 'Endi bron qilish alohida sahifada.',
                description: 'Studio tanlang, slotni belgilang va booking flow ni alohida joyda tugating.'
              }
            : {
                eyebrow: 'Страница бронирования',
                title: 'Теперь бронирование вынесено в отдельный маршрут.',
                description: 'Выберите studio, слот и завершите booking flow на отдельной странице.'
              }
          : view === 'analytics'
            ? locale === 'uz'
              ? {
                  eyebrow: 'Analitika',
                  title: 'Matchmaker va signals alohida analytics sahifasida.',
                  description: 'Bu yerda tavsiya, bandlik va talab dinamikasi bir joyga yig‘ilgan.'
                }
              : {
                  eyebrow: 'Аналитика',
                  title: 'Matchmaker и signals вынесены на отдельную страницу.',
                  description: 'Здесь собраны рекомендации, загрузка и динамика спроса по выбранному пространству.'
                }
            : view === 'launch'
              ? locale === 'uz'
                ? {
                    eyebrow: 'Launch',
                    title: 'Live feed va early access endi alohida sahifada.',
                    description: 'Bu yerda bronlar oqimi, waitlist va launch holati bir joyda ko‘rinadi.'
                  }
                : {
                    eyebrow: 'Launch',
                    title: 'Live feed и ранний доступ теперь на отдельной странице.',
                    description: 'Здесь собраны поток броней, waitlist и launch-состояние продукта.'
                  }
              : null;

  return (
    <>
      <main className="min-h-screen px-4 pb-14 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6">
          <AyvonTopBar copy={{ ...copy.hero, ...copy.common }} locale={locale} onLocaleChange={setLocale} />

          {view === 'home' ? (
            <>
              <HeroSection
                averageOccupancy={averageOccupancy}
                averageRating={averageRating}
                backendLabel={backendStatusLabel}
                bookingsCount={bookings.length}
                cityCount={cityOptions.length - 1}
                copy={{ ...copy.hero, ...copy.common }}
                liveSeats={liveSeats}
                locale={locale}
                minResponseTime={Math.min(...studios.map((studio) => studio.responseMinutes))}
                recommendationName={recommendation.studio.name}
                recommendationReason={recommendation.reason}
                waitlistCount={waitlist.length}
                onLocaleChange={setLocale}
                onOpenAbout={() => router.push('/about')}
                onOpenCatalog={() => router.push('/catalog')}
                onOpenBooking={() => router.push('/booking')}
                onOpenLaunch={() => router.push('/launch')}
                showHeader={false}
              />

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {routeCards.map((card) => (
                  <Link key={card.href} href={card.href} className="surface-panel rounded-[28px] p-5 transition hover:-translate-y-[2px] hover:bg-white/90">
                    <p className="eyebrow">{card.title}</p>
                    <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[var(--ink)]">{card.title}</h2>
                    <p className="copy-safe mt-3 text-sm leading-6 text-[var(--muted)]">{card.description}</p>
                  </Link>
                ))}
              </section>
            </>
          ) : null}

          {pageLead ? (
            <section className="surface-panel rounded-[34px] p-6 sm:p-8">
              <p className="eyebrow">{pageLead.eyebrow}</p>
              <h1 className="title-balance mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{pageLead.title}</h1>
              <p className="copy-safe mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">{pageLead.description}</p>
            </section>
          ) : null}

          {view === 'about' ? (
            <AboutSection
              averageOccupancy={averageOccupancy}
              cityCount={cityOptions.length - 1}
              copy={copy.about}
              liveSeats={liveSeats}
              onOpenBooking={() => router.push('/booking')}
            />
          ) : null}

          {view === 'catalog' ? (
            <section className="grid gap-6 xl:grid-cols-[0.92fr_0.58fr]">
              <CatalogSection
                budgetLimit={budgetLimit}
                cityOptions={cityOptions}
                copy={copy.catalog}
                locale={locale}
                moodOptions={moodOptions}
                search={search}
                selectedCity={selectedCity}
                selectedMood={selectedMood}
                selectedStudioId={selectedStudioId}
                visibleStudios={visibleStudios}
                onBudgetChange={setBudgetLimit}
                onResetFilters={resetFilters}
                onSearchChange={setSearch}
                onSelectCity={setSelectedCity}
                onSelectMood={setSelectedMood}
                onSelectStudio={setSelectedStudioId}
              />

              <aside className="surface-panel rounded-[34px] p-6 sm:p-7">
                <p className="eyebrow">{locale === 'uz' ? 'Tanlangan studio' : 'Выбранное studio'}</p>
                <h2 className="title-balance mt-4 text-3xl font-semibold tracking-[-0.04em]">{selectedStudio.name}</h2>
                <p className="copy-safe mt-3 text-sm leading-6 text-[var(--muted)]">{selectedStudio.story}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-[var(--line)] bg-white/72 p-4">
                    <p className="field-label">{copy.catalog.priceFrom}</p>
                    <p className="mt-3 whitespace-nowrap text-2xl font-semibold">{formatCurrency(selectedStudio.pricePerHour, locale)}</p>
                  </div>
                  <div className="rounded-[22px] border border-[var(--line)] bg-white/72 p-4">
                    <p className="field-label">{copy.catalog.rating}</p>
                    <p className="mt-3 text-2xl font-semibold">{selectedStudio.rating.toFixed(1)}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-[26px] bg-[#111827] p-5 text-[var(--paper)]">
                  <p className="text-sm leading-7 text-[rgba(248,243,234,0.74)]">
                    {locale === 'uz'
                      ? 'Bron qilish sahifasiga o‘ting, slotni tanlang va real booking yarating.'
                      : 'Перейдите на страницу брони, выберите слот и завершите реальное бронирование.'}
                  </p>
                  <button onClick={() => router.push('/booking')} className="mt-5 rounded-full bg-[var(--paper)] px-4 py-2 text-sm font-medium text-[#111827]">
                    {locale === 'uz' ? 'Bron sahifasiga o‘tish' : 'Открыть страницу брони'}
                  </button>
                </div>
              </aside>
            </section>
          ) : null}

          {view === 'booking' ? (
            <section className="grid gap-6 xl:grid-cols-[0.92fr_0.58fr]">
              <CatalogSection
                budgetLimit={budgetLimit}
                cityOptions={cityOptions}
                copy={copy.catalog}
                locale={locale}
                moodOptions={moodOptions}
                search={search}
                selectedCity={selectedCity}
                selectedMood={selectedMood}
                selectedStudioId={selectedStudioId}
                visibleStudios={visibleStudios}
                onBudgetChange={setBudgetLimit}
                onResetFilters={resetFilters}
                onSearchChange={setSearch}
                onSelectCity={setSelectedCity}
                onSelectMood={setSelectedMood}
                onSelectStudio={setSelectedStudioId}
              />

              <BookingCockpit
                bookingTotal={bookingTotal}
                brief={brief}
                canReserve={canReserve}
                copy={copy.booking}
                duration={duration}
                guest={guest}
                isSubmitting={isSubmittingBooking}
                locale={locale}
                membership={membership}
                perHour={perHour}
                savings={savings}
                seats={seats}
                selectedSlot={selectedSlot}
                selectedSlotInfo={selectedSlotInfo}
                selectedStudio={selectedStudio}
                onBriefChange={setBrief}
                onDurationChange={setDuration}
                onGuestChange={setGuest}
                onMembershipToggle={() => setMembership((current) => !current)}
                onReserve={reserveSelectedStudio}
                onSeatsChange={setSeats}
                onSlotSelect={setSelectedSlot}
              />
            </section>
          ) : null}

          {view === 'analytics' ? (
            <section className="grid gap-6 xl:grid-cols-[0.74fr_0.86fr]">
              <ConciergeSection
                copy={copy.concierge}
                goalOptions={goalOptions}
                plannerGoal={plannerGoal}
                plannerPriority={plannerPriority}
                plannerTeamSize={plannerTeamSize}
                priorityOptions={priorityOptions}
                recommendation={recommendation}
                onOpenStudio={() => {
                  setSelectedStudioId(recommendation.studio.id);
                  router.push('/booking');
                }}
                onSelectGoal={setPlannerGoal}
                onSelectPriority={setPlannerPriority}
                onTeamSizeChange={setPlannerTeamSize}
              />

              <SignalsSection chartMode={chartMode} copy={copy.signals} locale={locale} selectedStudio={selectedStudio} onChartModeChange={setChartMode} />
            </section>
          ) : null}

          {view === 'launch' ? (
            <LaunchSection
              backendLabel={backendStatusLabel}
              bookings={bookings}
              copy={copy.launch}
              isSubmitting={isSubmittingWaitlist}
              locale={locale}
              recommendationCity={recommendation.studio.city}
              statusMessage={statusMessage}
              statusTone={statusTone}
              waitlist={waitlist}
              waitlistEmail={waitlistEmail}
              waitlistName={waitlistName}
              onJoinWaitlist={joinWaitlist}
              onWaitlistEmailChange={setWaitlistEmail}
              onWaitlistNameChange={setWaitlistName}
            />
          ) : null}
        </div>
      </main>

      <BookingSuccessModal copy={copy.booking} successState={bookingSuccess} onClose={() => setBookingSuccess(null)} />
    </>
  );
}

