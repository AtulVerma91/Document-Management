# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first (improves caching)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application, excluding unnecessary files
COPY . .

# Exclude node_modules and dist during build
RUN rm -rf node_modules dist

# Build the NestJS app
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the NestJS application
CMD ["npm", "run", "start:prod"]
