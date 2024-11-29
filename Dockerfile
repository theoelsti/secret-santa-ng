FROM node:18-alpine

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma client and build the application
RUN npx prisma generate && npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]