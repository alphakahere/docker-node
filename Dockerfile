FROM node:20
WORKDIR /app
COPY package.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then yarn; \
    else yarn --production; \
    fi

COPY . ./

ENV PORT="3000"
EXPOSE $PORT
CMD ["node", "index.js" ]