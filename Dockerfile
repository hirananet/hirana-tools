FROM node:10-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
ENV TZ="UTC-8"
EXPOSE 3000
CMD ["npm", "run", "start:prod"]