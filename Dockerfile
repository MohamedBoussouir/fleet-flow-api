# 1. الصورة الأساسية لنظام تشغيل Node.js بحجم خفيف
FROM node:22-alpine


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install


COPY . .


EXPOSE 5000


CMD ["npm", "start"]