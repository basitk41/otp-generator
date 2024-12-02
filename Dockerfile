# Use the official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the application code
COPY . .

# Install NestJS CLI locally for the build step
RUN npm install @nestjs/cli --save-dev
RUN npm install prisma --save-dev

# Install Prisma client
RUN npx prisma migrate dev --name init
RUN npm install @prisma/client


# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build


# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
