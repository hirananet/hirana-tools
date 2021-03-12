FROM node:10-alpine
WORKDIR /app
COPY ./package.json ./
COPY ./dist .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start:builded:prod"]