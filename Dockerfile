# # Fetching the minified node image on apline linux
# FROM node:slim

# # Declaring env
# ENV NODE_ENV production

# # Setting up the work directory
# WORKDIR /express-docker

# # Copying all the files in our project
# COPY . .

# # Installing dependencies
# RUN npm install

# # Installing pm2 globally
# RUN npm install pm2 -g

# RUN npm install -g bun

# # Starting our application
# # CMD pm2 start process.yml && tail -f /dev/null
# CMD pm2 start ecosystem.config.json && tail -f /dev/null
# # CMD ["npm", "start"]

# # Exposing server port
# EXPOSE 8000

#Build stage
FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

#Production stage
FROM node:16-alpine AS production

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]