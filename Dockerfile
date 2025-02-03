# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps --omit=dev

# Copy the rest of the application
COPY . .

# Reinstall dependencies to ensure all are present
RUN npm install --legacy-peer-deps

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Build the NestJS app
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the NestJS application
CMD ["npm", "run", "start:prod"]
