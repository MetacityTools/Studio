FROM node:20-alpine

WORKDIR /app

# install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# copy source code
COPY app app
COPY core core
COPY features features
COPY public public
COPY next.config.mjs tsconfig.json ./

# build the app
RUN npm run build  

# prune dev dependencies
RUN npm prune --omit=dev

# copy entrypoint
COPY entrypoint.sh ./

# runtime config
EXPOSE 3000
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME 0.0.0.0

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["start"]