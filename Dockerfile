# syntax = docker/dockerfile:1

# Base Image
ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-slim AS base

ARG PORT=3000

ENV NODE_ENV=production
ENV PORT=${PORT}

WORKDIR /app

# Build
# This is a separate stage to avoid copying the source code into the final image
FROM base AS build

COPY --link . .

ARG NUXT_UI_PRO_LICENSE
ENV NUXT_UI_PRO_LICENSE=${NUXT_UI_PRO_LICENSE}

# add dev dependencies, otherwise nuxt postinstall hooks will fail
RUN npm install --production=false
RUN npm run build

# Run
# This is the final image that will be used to run the application
FROM base

ARG VERSION
ENV NUXT_PUBLIC_VERSION=$VERSION

COPY --from=build /app/.output /app/.output
COPY --from=build /app/node_modules /app/.output/cli/node_modules
COPY package.json /app

EXPOSE ${PORT}
CMD [ "node", "--env-file=.env", ".output/server/index.mjs" ]
