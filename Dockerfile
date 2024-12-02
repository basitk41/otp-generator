# Use the official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Install NestJS CLI and Prisma as dev dependencies
RUN npm install @nestjs/cli --save-dev
RUN npm install prisma --save-dev

# Install Prisma client
RUN npm install @prisma/client

# Generate Prisma client
RUN npx prisma generate

# Run Prisma migrations (ensure that tables are created in the cloud environment)
# RUN npx prisma migrate deploy

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application (ensure migrations are run before starting the app)
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
