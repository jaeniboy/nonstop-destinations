# Basis-Image
FROM node:18-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# Kopieren der package.json und package-lock.json (oder yarn.lock)
COPY package*.json ./
COPY backend/package*.json ./backend/

# Installieren der Abhängigkeiten
RUN npm ci

# Kopieren des Quellcodes
COPY backend ./backend

# Arbeitsverzeichnis auf das Backend-Verzeichnis setzen
WORKDIR /app/backend

# Build-Prozess (falls erforderlich)
# RUN npm run build

# Port freigeben
EXPOSE 3000

# Startbefehl
CMD ["npm", "start"]
