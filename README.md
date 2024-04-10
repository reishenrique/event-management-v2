## Event Management V2

Project initially conceived for handling users and events within a ticket-selling platform.

#### Main technologies and libs used for development:
- [Node.js (v18.16.0)](https://nodejs.org/en)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [Jest](https://jestjs.io/pt-BR/)
- [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken)
- [Zod](https://zod.dev/) 
- [Mongoose](https://mongoosejs.com/)
- [Docker](https://docker.com)

## 💻 Prerequisites

Before you begin, ensure you have met the following requirements:

1. Node.js installed on your machine (use NVM to install the Node version that was used for project development).
2. Docker installed on your machine (in case you want to perform tests using docker-compose).
3. Configured .env file (there is a .env.example file at the root of the project with the structure of the information).
4. MongoDB Compass installed on your machine to visualize system changes during your local testing.


## 🚀 Initializing the project locally along with docker-compose

Before proceeding with the steps below, ensure that Docker Desktop is running on your machine

```
npm install
./mongo.sh (Script that initializes docker-compose with local mongoDB)
npm run dev
```
Or if you want to test locally using a created MongoDB database, follow these steps

```
npm install
npm run dev
```

