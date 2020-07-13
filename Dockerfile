FROM node:latest

COPY . /app

WORKDIR /tmp
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl

WORKDIR /app
ENV SONAR_URL=http://192.168.0.3:9000
ENV PROJECT_ID=AAA
ENV SERVER=192.168.0.2
ENV PORT=13000

RUN npm i
ENTRYPOINT npm start