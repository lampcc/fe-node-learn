#制定node镜像的版本
FROM node:8.9.1
#ENV NODE_ENV development
#进入到app目录下面，类似cd
WORKDIR /app
COPY . /app
#COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
#RUN npm install --production --silent
RUN npm install --silent
#COPY . .
#对外暴露的端口
EXPOSE 3000
#程序启动脚本
CMD npm start