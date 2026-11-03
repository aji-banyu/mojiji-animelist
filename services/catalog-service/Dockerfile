FROM node:20-alpine
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=64"
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
USER node
CMD ["node", "src/index.js"]
