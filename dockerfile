FROM node:20-alpine3.17

RUN apk update && \
    apk add bash git make && \
    apk add --upgrade grep


WORKDIR ./irdeck
COPY ./ ./
RUN yarn install
CMD ["yarn", "start"]


