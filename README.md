# Lignum — студия кухонь и шкафов на заказ

Одностраничный сайт-портфолио с интерактивным конфигуратором, живым пересчётом цены
и отправкой заявок в Telegram. Сделан по референсу из видео: тёплый минимализм,
крупная антиква, «воздух», полноэкранные интерьеры, плавные появления блоков.

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
| `npm run telegram:check` | проверка токена и доступа к чату |
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
  каруселью и переходом в конфигуратор с готовым пресетом.
- **Конфигуратор из 6 шагов:** тип → размеры → фасады и цвет → столешница/фурнитура
  или наполнение → опции и техника → итог с формой.
  - реактивный пересчёт на каждом шаге, анимированная цена;
  - SVG-развёртка, которая меняет цвет, размеры, подсветку, технику, двери и наполнение;
  - сохранение конфигурации в `localStorage`;
  - серверный пересчёт цены перед отправкой — цене из браузера не доверяем;
  - подробная расшифровка «Из чего цена».
- **Портфолио:** фильтры по типу и стилю, 6 страниц проектов с описанием, размерами,
  материалами, галереей и кнопкой «Рассчитать похожий».
- **Процесс, цены, материалы, отзывы, FAQ, контакты** с загрузкой плана помещения.
- **Заявки в Telegram:** `POST /api/lead`, honeypot, минимальное время заполнения,
  rate limit по IP, ограничение размера и типа файла.
- **SEO:** title/description, canonical, OG/Twitter, favicon, `sitemap.xml`, `robots.txt`,
  JSON-LD организации, FAQPage и BreadcrumbList.
- **Аналитика:** Яндекс.Метрика с целями `configurator_open`, `configurator_step`,
  `lead_sent`, `phone_click`.
- **Адаптив** mobile-first, `prefers-reduced-motion`, ленивая загрузка и `srcset` для
  изображений, предзагрузка шрифтов.

---

## Переменные окружения

`.env` (локально) или Environment Variables в Vercel:

| Переменная | Обязательна | Назначение |
| --- | --- | --- |
| `TELEGRAM_BOT_TOKEN` | для заявок | токен бота от @BotFather |
| `TELEGRAM_CHAT_ID` | для заявок | id чата/канала, куда падают заявки |
| `PUBLIC_SITE_URL` | да | `https://ваш-домен.ru` без слеша на конце |
| `PUBLIC_YM_ID` | нет | номер счётчика Яндекс.Метрики |
| `POLZA_API_KEY` | только локально | генерация картинок, на Vercel не нужен |

Если Telegram не настроен, сайт работает в **демо-режиме**: заявка логируется в консоль
сервера и пользователь видит успех. Это удобно для проверки форм без бота.

---

## Заявки в Telegram — пошагово

1. В Telegram откройте **@BotFather** → `/newbot` → задайте имя и username.
   Полученный токен вида `123456789:AA...` — это `TELEGRAM_BOT_TOKEN`.
2. Создайте приватный канал или группу для заявок (например, «Lignum · заявки»).
3. Добавьте бота в чат и сделайте **администратором** (для канала — с правом публикации).
4. Напишите в чат любое сообщение от своего имени, затем откройте:
   `https://api.telegram.org/bot<ТОКЕН>/getUpdates`
   и найдите `"chat":{"id":...}`. Для каналов id начинается с `-100...`.
   Альтернатива: добавить в чат @getmyid_bot.
5. Пропишите в `.env`:

   ```dotenv
   TELEGRAM_BOT_TOKEN=123456789:AA...
   TELEGRAM_CHAT_ID=-1001234567890
   ```

6. Перезапустите dev-сервер и проверьте:

   ```bash
   npm run telegram:check          # токен + доступ к чату
   npm run telegram:check -- --send # плюс тестовое сообщение
   ```

7. Отправьте тестовую заявку с сайта. В сообщении будут имя, телефон, комментарий,
   состав конфигурации, пересчитанная на сервере цена, файл плана и время по МСК.

---

## Яндекс.Метрика

1. Создайте счётчик, скопируйте номер в `PUBLIC_YM_ID`.
2. В интерфейсе Метрики создайте цели типа «JavaScript-событие» с идентификаторами:
   - `configurator_open` — открыл конфигуратор;
   - `configurator_step` — прошёл шаг (в параметрах номер шага);
   - `lead_sent` — отправил заявку;
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
  Тот же код выполняется на сервере в `/api/lead`, поэтому подмена цены в браузере
  ничего не даёт.
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
    server/                   Telegram и rate limit
  routes/
    +page.svelte              главная
    api/lead/+server.ts       приём заявок
    portfolio/[slug]/         страницы проектов
    privacy/                  политика
    robots.txt, sitemap.xml   генерация на билде
scripts/                      генерация/оптимизация картинок, сборка, Telegram-check
static/                       шрифты, webp, favicon, og.jpg
```

---

## Деплой на Vercel

### Вариант 1 — через Git

1. Запушьте репозиторий в GitHub/GitLab.
2. В Vercel: **Add New → Project → Import**.
3. Framework Preset определится как **SvelteKit**; build command — `npm run build`.
4. Добавьте переменные окружения (`TELEGRAM_*`, `PUBLIC_SITE_URL`, `PUBLIC_YM_ID`).
5. Deploy. Проверьте:
   - главную и страницу проекта;
   - отправку заявки (в Telegram должно прийти сообщение);
   - `/sitemap.xml`, `/robots.txt`, `/api/lead` (POST).
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

> Домен `lignum.ru` в примере — проверьте его доступность до покупки. Если занят,
> поменяйте `site.name`/`PUBLIC_SITE_URL` и логотип: название вымышленное.

---

## Что заменить перед реальным запуском

- [ ] `src/lib/data/content.ts`: название, телефон, email, адрес, соцсети, цифры, отзывы.
- [ ] `src/routes/privacy/+page.svelte`: реквизиты оператора (ИП/ООО, ИНН, ОГРН).
- [ ] `PUBLIC_SITE_URL` — на реальный домен; проверить `og.jpg`, favicon.
- [ ] Telegram-бот и чат; `npm run telegram:check -- --send`.
- [ ] Счётчик Метрики и цели.
- [ ] Проверить, что цены и коэффициенты в `configurator.json` соответствуют прайсу.
- [ ] Заменить демо-проекты и отзывы на реальные (сейчас все имена и кейсы вымышлены).
- [ ] По желанию: сгенерировать недостающие фото через Polza и убрать aliases.

---

## Известные ограничения

- Rate limit хранится в памяти инстанса Vercel. Для жёсткого лимита подключите
  Upstash Redis / Vercel KV.
- В демо-режиме без Telegram заявки не сохраняются в базе — только лог сервера.
- Отзывы и проекты — демонстрационные, не являются публичной офертой.
- Стоковое фото гардеробной (Pexels) стоит заменить на сгенерированное в едином стиле,
  когда появится баланс Polza.
