# Lignum — студия кухонь и шкафов на заказ

Одностраничный сайт-портфолио с интерактивным конфигуратором и живым пересчётом цены.
Без форм заявок и сбора персональных данных: на финале конфигуратора и в контактах —
простой CTA в Telegram **@anna_lumenmanager**. Сделан по референсу из видео:
тёплый минимализм, крупная антиква, «воздух», полноэкранные интерьеры, плавные появления.

**Стек:** SvelteKit 3 (Svelte 5 runes) · TypeScript · Tailwind CSS 4 · GSAP ScrollTrigger ·
sharp для картинок · adapter-vercel.

---

## Быстрый старт

Требуется Node.js **22.17+**.

```bash
npm install
cp .env.example .env      # Windows PowerShell: Copy-Item .env.example .env
npm run dev
```

Откройте http://localhost:5173.

Полезные команды:

| Команда | Что делает |
| --- | --- |
| `npm run dev` | dev-сервер |
| `npm run check` | svelte-check + типы |
| `npm run build` | production-сборка и `.vercel/output` |
| `npm run preview` | локальный просмотр production-сборки |
| `npm run images:optimize` | пересборка webp и `images.json` из `scripts/.raw` |
| `npm run images:generate` | генерация интерьеров через Polza AI (нужен баланс) |

> **Windows:** `npm run build` — обычный `vite build`, но в `vite.config.ts` подключён
> `scripts/patch-symlink.mjs`. Adapter Vercel создаёт симлинки, а Windows без режима
> разработчика их запрещает; патч подменяет только неудачный вызов на junction.
> На Linux/Vercel он ничего не делает.

---

## Что реализовано

- **Hero** с полноэкранным интерьером, крупной антиквой, рукописным акцентом,
  тремя цифрами и CTA в конфигуратор.
- **Каталог направлений** (кухни, шкафы-купе, гардеробные, прихожие) с горизонтальной
  каруселью и переходом в конфигуратор с готовым пресетом. Стрелки отключаются
  на краях — лишних кликов «в пустоту» больше нет.
- **Конфигуратор из 6 шагов:** тип → размеры → фасады и цвет → столешница/фурнитура
  или наполнение → опции и техника → итог.
  - реактивный пересчёт на каждом шаге, анимированная цена;
  - SVG-развёртка, которая меняет цвет, размеры, подсветку, технику, двери и наполнение;
  - сохранение конфигурации в `localStorage`;
  - на финале — сводка, кнопка «Скопировать конфигурацию» и CTA в Telegram;
  - подробная расшифровка «Из чего цена».
- **Цены без тарифных пакетов:** объяснение, от чего зависит стоимость, два ориентира
  «от … за погонный метр» и CTA в конфигуратор/Telegram.
- **Портфолио:** фильтры по типу и стилю, 6 страниц проектов с описанием, размерами,
  материалами, галереей и кнопкой «Рассчитать похожий».
- **Процесс, материалы, отзывы, FAQ, контакты** — контакты ведут в Telegram, почту
  и по телефону; форм и загрузки файлов нет.
- **SEO:** title/description, canonical, OG/Twitter, favicon, `sitemap.xml`, `robots.txt`,
  JSON-LD организации, FAQPage и BreadcrumbList.
- **Аналитика:** Яндекс.Метрика с целями `configurator_open`, `configurator_step`,
  `telegram_click`, `phone_click`.
- **Адаптив** mobile-first, `prefers-reduced-motion`, ленивая загрузка и `srcset` для
  изображений, предзагрузка шрифтов.

---

## Контакт в Telegram

По умолчанию используется **@anna_lumenmanager**:

- `src/lib/data/content.ts` — `TELEGRAM_URL`, `telegramHandle`, `manager`, `socials.telegram`;
- ссылка подставляется в Hero, Header (мобильное меню), Footer, FAQ, секцию контактов,
  финал конфигуратора и блок цен.

Чтобы поменять контакт, достаточно заменить `TELEGRAM_URL` и `telegramHandle` в
`src/lib/data/content.ts`. Никаких ботов, токенов и серверных эндпоинтов не нужно.

**Почему без форм:** сайт не собирает имя, телефон, комментарии и файлы через формы —
значит, нет обработки персональных данных через сайт и лишней возни с 152-ФЗ.
Пользователь сам пишет в Telegram; переписка хранится в мессенджере. Политика
конфиденциальности на `/privacy` описывает только обезличенную статистику Метрики
и добровольную переписку.

---

## Переменные окружения

`.env` (локально) или Environment Variables в Vercel:

| Переменная | Обязательна | Назначение |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | да | `https://ваш-домен.ru` без слеша на конце |
| `PUBLIC_YM_ID` | нет | номер счётчика Яндекс.Метрики |
| `POLZA_API_KEY` | только локально | генерация картинок, на Vercel не нужен |

Серверных секретов и токенов нет: сайт статический, API для заявок удалён.

---

## Яндекс.Метрика

1. Создайте счётчик, скопируйте номер в `PUBLIC_YM_ID`.
2. В интерфейсе Метрики создайте цели типа «JavaScript-событие»:
   - `configurator_open` — открыл конфигуратор;
   - `configurator_step` — прошёл шаг (в параметрах номер шага);
   - `telegram_click` — нажал CTA в Telegram;
   - `phone_click` — клик по телефону.
3. Счётчик грузится после `requestIdleCallback`, чтобы не мешать LCP.

---

## Изображения

В проекте 13 интерьеров, сгенерированных через **Polza AI** (`google/gemini-3-pro-image-preview`),
и одно стоковое фото гардеробной — [Pexels #7005019](https://www.pexels.com/photo/7005019/)
(автор Olena Bohovyk, бесплатная лицензия Pexels). Оно использовано, потому что на момент
сборки баланс Polza закончился. Промпты и пайплайн лежат в `scripts/generate-images.mjs`,
исходник стока — в `scripts/sources/walkin.jpg`.

```bash
npm run images:generate          # только недостающие
npm run images:generate -- hero  # перегенерировать конкретные
npm run images:optimize          # webp 480/960/1440/2048 + images.json
```

`scripts/.raw/` в git не попадает — в репозиторий идут только готовые `static/images/*.webp`
и манифест. Если баланс Polza пополнен, удалите ненужные aliases в
`scripts/optimize-images.mjs` и сгенерируйте оригиналы: сайт подхватит их после
`images:optimize`.

---

## Конфигуратор: как менять цены и материалы

- `src/lib/data/configurator.json` — все материалы, цвета, коэффициенты, цены за метр,
  опции и техника. Формула описана в `$comment`.
- `src/lib/pricing.ts` — расчёт, нормализация входных данных, человекочитаемая сводка.
- `src/lib/configurator.svelte.ts` — клиентский стор (Svelte 5 runes), шаги, localStorage.
- `src/lib/components/configurator/Preview.svelte` — SVG-схема; добавляя материал,
  проверьте, что для него есть `hex` и, при необходимости, `grain`.

Чтобы добавить направление в каталог, обновите `src/lib/data/content.ts` и пресет
`preset` — он применяется в конфигураторе.

---

## Структура

```
src/
  app.css                     дизайн-токены, кнопки, типографика, reveal
  app.html                    шрифты, favicon, theme-color
  lib/
    actions.ts                reveal + GSAP-параллакс
    analytics.ts              цели Метрики
    configurator.svelte.ts    стор конфигуратора
    pricing.ts                формула и сводка
    data/                     контент, проекты, материалы, манифест картинок
    components/               шапка, подвал, UI, SVG-превью
    sections/                 секции главной
  routes/
    +page.svelte              главная
    portfolio/[slug]/         страницы проектов
    privacy/                  политика
    robots.txt, sitemap.xml   генерация на билде
scripts/                      генерация/оптимизация картинок, Windows-патч сборки
static/                       шрифты, webp, favicon, og.jpg
```

---

## Деплой на Vercel

### Вариант 1 — через Git

1. Запушьте репозиторий в GitHub/GitLab.
2. В Vercel: **Add New → Project → Import**.
3. Framework Preset определится как **SvelteKit**; build command — `npm run build`.
4. Добавьте переменные окружения: `PUBLIC_SITE_URL`, при необходимости `PUBLIC_YM_ID`.
5. Deploy. Проверьте главную, страницу проекта, конфигуратор, `/sitemap.xml`,
   `/robots.txt` и `/privacy`.
6. **Domains → Add**: привяжите купленный домен, включите HTTPS (Vercel делает
   сертификат автоматически). Для `.ru` делегируйте NS на Vercel или пропишите
   A/CNAME по инструкции панели.
7. После смены домена обновите `PUBLIC_SITE_URL` и сделайте Redeploy — от него зависят
   canonical, OG и sitemap.

### Вариант 2 — через CLI

```bash
npm i -g vercel
vercel login
vercel            # preview
vercel --prod     # production
```

CLI сам прочитает `.vercel/output` после `npm run build`; переменные можно добавить
в `vercel env add`.

---

## Что проверить перед публикацией

- [ ] `src/lib/data/content.ts`: название, телефон, email, адрес, Telegram-контакт,
      соцсети, цифры, отзывы.
- [ ] `src/routes/privacy/+page.svelte`: при необходимости — реквизиты оператора.
- [ ] В `PUBLIC_SITE_URL` указан домен сайта, `og.jpg` и favicon отображаются.
- [ ] Счётчик Метрики и цели.
- [ ] Проверить, что цены и коэффициенты в `configurator.json` соответствуют прайсу.
- [ ] По желанию: сгенерировать недостающие фото через Polza и убрать aliases.

---

## Известные ограничения

- Форм и приёма заявок на сайте нет — это сознательное решение, контакт только в Telegram.
- Стоковое фото гардеробной (Pexels) стоит заменить на сгенерированное в едином стиле,
  когда появится баланс Polza.
