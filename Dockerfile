# Используем базовый образ Node.js
FROM node:18-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только необходимые файлы
COPY package.json pnpm-lock.yaml ./

# Устанавливаем pnpm
RUN npm install -g pnpm

# Устанавливаем все зависимости, включая TypeScript
RUN pnpm install

# Устанавливаем TypeScript вручную на случай, если что-то пошло не так
RUN pnpm add -D typescript

# Проверяем, что TypeScript установлен
RUN pnpm exec tsc --version

# Копируем остальные файлы приложения
COPY . .

# Сборка приложения
RUN pnpm run build

# Используем nginx для обслуживания фронтенда
FROM nginx:alpine

# Копируем скомпилированные файлы из первой стадии
COPY --from=build /app/dist /usr/share/nginx/html
