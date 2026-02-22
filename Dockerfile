# Use official Node.js 20 slim image
FROM node:20-slim

# Set working directory inside the container
WORKDIR /app

# Copy package files first (for faster rebuilds)
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the middleware code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose port 4000
EXPOSE 4000

# Start the compiled server
CMD ["node", "dist/index.js"]

