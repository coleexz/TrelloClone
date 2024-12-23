FROM node
WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . ./

# Set environment variables
ENV PORT=4000
ENV IS_DEV=true
ENV DATABASE_URL="postgres://trelloclone:UNITEC1234@database:5432/trelloclone_db"

EXPOSE 4000

CMD ["npm","run","start"]
