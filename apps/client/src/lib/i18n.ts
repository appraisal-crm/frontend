import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const ru = {
  brand: { name: 'ОЦЕНКА', sub: 'кабинет клиента' },
  common: { signIn: 'Войти', signOut: 'Выйти', loading: 'Загрузка' },
  theme: { light: 'Светлая тема', dark: 'Тёмная тема' },
  lang: { switch: 'English' },
  status: {
    new: 'Новая',
    in_progress: 'В работе',
    inspection_scheduled: 'Осмотр назначен',
    inspection_completed: 'Осмотр завершён',
    appraisal: 'Оценка',
    report_sent: 'Отчёт отправлен',
    closed: 'Закрыта',
  },
  stage: {
    new: 'Новая',
    in_progress: 'В работе',
    inspection_scheduled: 'Осмотр назн.',
    inspection_completed: 'Осмотр готов',
    appraisal: 'Оценка',
    report_sent: 'Отчёт',
    closed: 'Закрыта',
  },
  object: {
    apartment: 'Квартира',
    house: 'Дом',
    land: 'Земельный участок',
    commercial: 'Коммерческая',
    car: 'Автомобиль',
  },
  signin: {
    eyebrow: 'Оценка недвижимости · квартиры · дома · земля · бизнес',
    titleLead: 'Весь путь оценки — ',
    titleAccent: 'на одной линии',
    lead: 'Подайте заявку на оценку объекта и следите, как она продвигается: от приёма до готового отчёта. Никаких звонков «узнать статус» — процесс виден целиком.',
    panelStage: 'Стадия заявки',
    cta: 'Войти и подать заявку',
    footAuth: 'Вход через корпоративный аккаунт (Keycloak)',
  },
  home: { title: 'Заявки на оценку', sub: 'Подайте новую заявку и следите за её движением по этапам.', newRequest: 'Новая заявка' },
  form: {
    email: 'Email',
    phone: 'Телефон',
    objectType: 'Тип объекта',
    address: 'Адрес',
    addressHint: 'Можно уточнить позже',
    addressPlaceholder: 'Город, улица, дом',
    submit: 'Подать заявку',
    errEmailRequired: 'Укажите email',
    errEmailFormat: 'Неверный формат email',
    errPhoneRequired: 'Укажите телефон',
    errPhoneFormat: 'Неверный формат телефона',
    fail: 'Не удалось отправить заявку. Попробуйте ещё раз.',
    ok: 'Заявка принята — следите за статусом справа.',
  },
  list: {
    errLoad: 'Не удалось загрузить заявки. Обновите страницу.',
    emptyTitle: 'Пока нет заявок',
    emptyBody: 'Подайте первую заявку — она появится здесь вместе со шкалой статуса.',
  },
  card: { noAddress: 'Адрес не указан' },
  layout: { footer: 'Appraisal CRM · оценка недвижимости', userFallback: 'Клиент' },
};

const en: typeof ru = {
  brand: { name: 'APPRAISAL', sub: 'client portal' },
  common: { signIn: 'Sign in', signOut: 'Sign out', loading: 'Loading' },
  theme: { light: 'Light theme', dark: 'Dark theme' },
  lang: { switch: 'Русский' },
  status: {
    new: 'New',
    in_progress: 'In progress',
    inspection_scheduled: 'Inspection scheduled',
    inspection_completed: 'Inspection done',
    appraisal: 'Appraisal',
    report_sent: 'Report sent',
    closed: 'Closed',
  },
  stage: {
    new: 'New',
    in_progress: 'In progress',
    inspection_scheduled: 'Insp. sched.',
    inspection_completed: 'Insp. done',
    appraisal: 'Appraisal',
    report_sent: 'Report',
    closed: 'Closed',
  },
  object: {
    apartment: 'Apartment',
    house: 'House',
    land: 'Land plot',
    commercial: 'Commercial',
    car: 'Vehicle',
  },
  signin: {
    eyebrow: 'Property appraisal · flats · houses · land · business',
    titleLead: 'The whole appraisal, ',
    titleAccent: 'on a single line',
    lead: 'Submit a request to have your property appraised and watch it move — from intake to the final report. No “what’s the status” calls; the whole process is visible.',
    panelStage: 'Request stage',
    cta: 'Sign in to submit a request',
    footAuth: 'Sign in with your corporate account (Keycloak)',
  },
  home: { title: 'Appraisal requests', sub: 'Submit a new request and track it through the stages.', newRequest: 'New request' },
  form: {
    email: 'Email',
    phone: 'Phone',
    objectType: 'Object type',
    address: 'Address',
    addressHint: 'Can be specified later',
    addressPlaceholder: 'City, street, building',
    submit: 'Submit request',
    errEmailRequired: 'Enter an email',
    errEmailFormat: 'Invalid email format',
    errPhoneRequired: 'Enter a phone number',
    errPhoneFormat: 'Invalid phone format',
    fail: 'Could not submit the request. Please try again.',
    ok: 'Request received — track its status on the right.',
  },
  list: {
    errLoad: 'Could not load requests. Refresh the page.',
    emptyTitle: 'No requests yet',
    emptyBody: 'Submit your first request — it will appear here with a status track.',
  },
  card: { noAddress: 'No address' },
  layout: { footer: 'Appraisal CRM · property valuation', userFallback: 'Client' },
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { ru: { translation: ru }, en: { translation: en } },
    fallbackLng: 'ru',
    supportedLngs: ['ru', 'en'],
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'], lookupLocalStorage: 'appraisal-lang' },
    interpolation: { escapeValue: false },
  });

export { i18n };
export const localeOf = (lng: string) => (lng.startsWith('en') ? 'en-US' : 'ru-RU');
