# Використання базового образу Ubuntu (як на лекції)
FROM node:24.18-slim

WORKDIR playwright-project

# Щоб Playwright не піднімав HTML-репорт сервер у Docker
ENV CI=true

# Копіювання файлів проекту
COPY . .

# Видалення старих результатів тестування
RUN rm -rf playwright-report
RUN rm -rf test-results

# Встановлення необхідних пакетів in package.json
# Старіша версія Playwright (1.49.1 замість 1.62.0 з лекції)
RUN npm i
RUN npx -y playwright@1.49.1 install --with-deps firefox chromium
RUN npx playwright install firefox chromium

# Виконання Node.js скрипта
ENTRYPOINT ["npm"]
CMD [ "run", "playwright:test:headless:firefox" ]
