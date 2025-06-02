# Use Node.js 16
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files into the container
COPY . .

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production

# Open port 5000
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]
