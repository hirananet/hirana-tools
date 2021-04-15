FROM node:10-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
ENV TZ="America/Argentina/Buenos_Aires"
EXPOSE 3000
CMD ["npm", "run", "start:prod"]