# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Build args
ARG MONGO_URI
ARG NEXTAUTH_SECRET
ENV MONGO_URI=$MONGO_URI
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build