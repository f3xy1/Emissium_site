# Docker для Emissium

## Стек и схема запуска

- Frontend: JavaScript, React 18, React Router 7, Vite 5, HTML5 и CSS3.
- Backend: Node.js 24, Express 4, JWT и bcrypt.
- Database: SQLite через better-sqlite3; данные хранятся в Docker volume.
- Контейнеризация: Docker с многоэтапной сборкой и Docker Compose.

Один контейнер запускает Express, который обслуживает API, собранный React-клиент и статическую админку. Все части доступны через один порт `8080`. SQLite — файловая БД, поэтому отдельный контейнер СУБД здесь не нужен.

## Файлы

- `Dockerfile` — устанавливает зависимости и собирает клиент в промежуточных стадиях; в итоговый образ переносит сервер, его production-зависимости и каталог `dist/`. Компилятор, Python, Vite и nodemon в итоговый образ не переносятся. Процесс работает от пользователя `node`, порт — `8080`; healthcheck проверяет `/api/health`.
- `.dockerignore` — исключает локальные `node_modules`, сборки, Git, настройки редактора, секреты `.env` и файлы SQLite. Зависимости устанавливаются внутри Linux-образа, а БД создаётся в volume.
- `docker-compose.yml` — собирает и запускает приложение, публикует порт, подключает постоянный volume и отдельную bridge-сеть. Передаёт ключи авторизации из `.env`.
- `.env.example` — шаблон настроек для запуска.

В Dockerfile используется кэш BuildKit для npm: `RUN --mount=type=cache,target=/root/.npm …`. Файлы `package.json` и `package-lock.json` копируются до исходников, чтобы изменения кода не вызывали повторную установку зависимостей. `npm ci` устанавливает версии из lock-файлов; `requirements.txt` для сборки этого JavaScript-проекта не используется.

## Подготовка

Нужны Docker Engine и Compose v2 на Linux либо Docker Desktop с Linux containers на Windows. Команды выполняются из корня проекта.

Создать `.env` из шаблона в Ubuntu:

```bash
cp .env.example .env
```

В PowerShell:

```powershell
Copy-Item .env.example .env
```

Заменить значения `JWT_SECRET` и `ADMIN_SECRET` своими. Для генерации случайного ключа можно выполнить следующую команду два раза и вставить результаты в соответствующие строки `.env`:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Для входа в админку используется значение `ADMIN_SECRET` из `.env`.

## Сборка и запуск отдельного контейнера

```bash
docker build -t emissium:latest .
docker run -d --name emissium --init -p 8080:8080 --env-file .env -v emissium-data:/app/data emissium:latest
docker ps
docker logs emissium
docker top emissium
docker exec emissium id
```

Проверка пользователя должна показать `uid=1000(node)`. `docker top` показывает процессы контейнера; с `--init` помимо Node.js будет присутствовать процесс инициализации. Для просмотра размеров и кэширования сборки:

```bash
docker image ls emissium
docker build --progress=plain -t emissium:latest .
```

При повторной сборке без изменений Docker использует слои `CACHED`. Если исходники изменились, зависимости остаются в кэше, а клиент пересобирается.

Остановка и удаление отдельного контейнера:

```bash
docker stop emissium
docker rm emissium
```

Volume `emissium-data` сохраняет базу после удаления контейнера.

## Запуск через Docker Compose

Если ранее запускался отдельный контейнер, сначала остановить его, чтобы освободить порт `8080`.

```bash
docker compose config --quiet
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 web
docker compose top
docker compose exec web id
```

| Что открыть | Адрес |
| --- | --- |
| Сайт | http://localhost:8080 |
| Личный кабинет | http://localhost:8080/profile |
| Админка | http://localhost:8080/admin-panel/ |
| Проверка API | http://localhost:8080/api/health |

С другого компьютера вместо `localhost` используется IP-адрес Docker-хоста. Клиент и админка обращаются к относительным адресам `/api` и `/admin`.

```bash
curl http://localhost:8080/api/health
docker compose down
```

API возвращает `{"status":"ok","version":"0.1"}`. `docker compose down` останавливает контейнер и удаляет сеть, сохраняя volume с SQLite. При запуске через Compose имя volume по умолчанию получает префикс проекта; это отдельный volume от примера с `docker run`.

## Изменения приложения для Docker

В `server/index.js` добавлена раздача клиента и админки при заданном `STATIC_DIR`, а также возврат `index.html` для маршрутов React Router. `server/db.js` поддерживает `DB_PATH` и создаёт каталог БД. В образе эти переменные указывают на `/app/public` и `/app/data/emissium.db`.

В `src/api/auth.js` используется `/api` с возможностью переопределения через `VITE_API_URL` при сборке; в админке — `/admin`. Для локальной разработки Vite проксирует `/api` на `http://localhost:3001`. Обычные команды `npm run dev`, `npm --prefix server start` и `node server/admin.js` остаются доступны.

Первый запуск создаёт пустую SQLite БД; локальный `server/emissium.db` в образ не копируется.
