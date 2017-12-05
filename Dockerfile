FROM node:6.9.1

RUN mkdir -p /usr/local/app

COPY . /usr/local/app

WORKDIR /usr/local/app

RUN echo 'registry=https://registry.npm.taobao.org' > /root/.npmrc

RUN git clone https://github.com/SheepBeast/vue-netease-cloud-music.git

WORKDIR vue-netease-cloud-music/

RUN npm install

CMD [ "npm", "run", "dev" ]

EXPOSE 8080

# docker build -t sheepbeast/vue_client .
# docker run --name=vue_client -p 8080:8080 --link=vue_proxy:proxy_server -d sheepbeast/vue_client
