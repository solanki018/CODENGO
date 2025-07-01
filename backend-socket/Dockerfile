# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install

# Build TypeScript (optional if you have ts-node-dev)
# RUN npm run build

# Expose port for socket server
EXPOSE 3001

# Start server
CMD ["npx", "ts-node", "server.ts"]
