FROM node:10-alpine

RUN apk add --no-cache \
        libstdc++ binutils-gold curl g++ gcc \
        gnupg libgcc linux-headers make \
        python

VOLUME ["/usr/src/app"]
WORKDIR /usr/src/app

# RUN npm cache clean --force
RUN npm install -g pm2

# CMD ["pm2", "start", "ecosystem.config.js", "--no-daemon"]
CMD npm install --silent --only=production && pm2 start ecosystem.config.js --no-daemon
# CMD pm2 start ecosystem.config.js --no-daemon

EXPOSE 4000