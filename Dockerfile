#Dockerfile such that any machine can run this code
#Sets up Docker
FROM node:12
WORKDIR /Users/Andrew/Dev/spec
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

CMD [ "node", "index.js" ]
