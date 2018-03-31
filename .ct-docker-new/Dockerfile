FROM node:8.9.4-stretch
RUN apt-get update
RUN apt-get install build-essential -y
RUN apt-get install git -y
RUN apt-get install python -y
RUN apt-get install apt-transport-https -y
RUN useradd -ms /bin/bash rocketchat || true
ENV METEOR_ALLOW_SUPERUSER true

RUN curl https://install.meteor.com/ | sh
ENV RC_VERSION 0.63.0-develop
#RUN npm update -g npm
MAINTAINER buildmaster@rocket.chat
RUN mkdir build
ADD . /build/
WORKDIR /build
RUN chmod +x ./ct-build.sh
RUN ./ct-build.sh

RUN cd /app/bundle/programs/server \
 && npm install \
 && npm cache clear --force \
 && chown -R rocketchat:rocketchat /app 

#USER rocketchat

VOLUME /app/uploads

WORKDIR /app/bundle

# needs a mongoinstance - defaults to container linking with alias 'mongo'
ENV DEPLOY_METHOD=docker \
    NODE_ENV=production \
    MONGO_URL=mongodb://mongo:27017/rocketchat \
    HOME=/tmp \
    PORT=3000 \
    ROOT_URL=http://localhost:3000 \
    Accounts_AvatarStorePath=/app/uploads

EXPOSE 3000

CMD ["node", "main.js"]
