FROM node:20-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the source files into the image
COPY . .

# Build the application
RUN npm run build

# Create a new stage for the final image
FROM node:20-alpine as final

# Set production node environment by default
ENV NODE_ENV production

# Run the application as a non-root user
USER node

# Copy production dependencies and built application
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/dist ./dist

# Expose the port that the application listens on
EXPOSE 3000

# Run the application
CMD node dist/index.js
