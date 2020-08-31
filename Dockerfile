# Specify Base image
FROM node:alpine

# Set working directory
WORKDIR /usr/devcamper

# Install dependencies
COPY ./ ./
RUN npm install

# Deploy command
CMD ["npm", "start"]