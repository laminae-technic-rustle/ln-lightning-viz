# This is fine for now, but not production ready
# FIXME - Make build two-step, use NGINX

FROM node:14.15.4-alpine

ENV NODE_ENV production
WORKDIR /opt/app

COPY package.json package.json
COPY yarn.lock yarn.lock
COPY pages/ pages/
COPY styles/ styles/

RUN yarn install --frozen-lockfile
RUN yarn build
CMD yarn start
