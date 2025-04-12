FROM node:18-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    python3 \
    g++ \
    make \
    openssh-client \
    tzdata \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

ENV npm_config_build_from_source=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV NODE_OPTIONS="--experimental-global-webcrypto"

RUN npm ci --legacy-peer-deps
RUN rm -rf node_modules/canvas
RUN npm install canvas --build-from-source

COPY . .

RUN npx prisma generate

RUN npm run build

ENV NODE_ENV=production
ENV NODE_OPTIONS="--experimental-global-webcrypto"

EXPOSE 3000

CMD ["npm", "run", "start"]
