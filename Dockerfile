# Fetching the minified node image on apline linux
FROM node:slim

# Declaring env
ENV NODE_ENV production

# Setting up the work directory
WORKDIR /express-docker

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN npm install

# Installing pm2 globally
RUN npm install pm2 -g

RUN npm install -g bun

# Starting our application
# CMD pm2 start process.yml && tail -f /dev/null
CMD pm2 start ecosystem.config.json && tail -f /dev/null
# CMD ["npm", "start"]

# Exposing server port
EXPOSE 8000