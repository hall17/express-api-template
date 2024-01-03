# Base image
FROM node:18-alpine as production

# Set Env 
# ENV NODE_ENV production 

# Create app directory
WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

# Install app dependencies
RUN yarn

# Bundle app source
COPY . .

RUN yarn prisma generate

# Expose application port
EXPOSE 3000

# Build the application
RUN yarn build

# Start the server using the production build
CMD ["npm", "run", "start-prod"]