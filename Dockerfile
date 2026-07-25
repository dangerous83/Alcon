# Builds the static export and serves it with nginx.
#
# The app is a static site (next.config.ts `output: "export"`), so there is
# no Node server at runtime — this image is just nginx over the built HTML.
# Use it for self-hosting; GitHub Pages uses .github/workflows/deploy-pages.yml
# instead.

FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# No base path: this image serves the site from the domain root. Pass
# --build-arg FORM_ENDPOINT=... to wire the quote form to a form service.
ARG FORM_ENDPOINT=""
ARG SITE_URL=""
ENV NEXT_PUBLIC_FORM_ENDPOINT=$FORM_ENDPOINT
ENV NEXT_PUBLIC_SITE_URL=$SITE_URL
RUN npm run build

FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
