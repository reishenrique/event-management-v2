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

## 📫 Contributing to the project

1. Clone this repository
2. (Make sure that before creating a new branch, it is updated with main)
3. Create a branch: `git checkout -b <branch-name>` 
4. Make your changes and confirm them: `git commit -m <commit-message>`
5. Send to the original branch: `git push origin <name-project>/<local>`
6. Create the pull request

I will love to review your improvement points!

## 🚀 Starting the unit tests developed for the use cases

All the use cases developed for the system have been tested using Jest.

You can see how they are structured by following the path: `src > tests > useCases > events or users` 

Below is the script that initializes the tests: 

```
npm test
```

## 📫 Endpoints available in the system

1. Users
- POST api/v2/user/createUser
- GET api/v2/user/getbycpf/11122233392
- GET api/v2/user/getbyid/65e5e90b4760390944a86f5a
- PUT api/v2/user/65e5e90b4760390944a86f5a
- DELETE api/v2/user/65e5e90b4760390944a86f5a

2. Events
- POST api/v2/event/createEvent
- GET api/v2/event/getbycnpj/12345678901221
- GET api/v2/event/getbyid/65e5e95d4760390944a86f64
- PUT api/v2/event/65e5e95d4760390944a86f64
- DELETE  api/v2/event/65e5e95d4760390944a86f64

3. Authentication/Login
- POST api/v2/auth/login
- POST api/v2/auth/verifyToken

The payloads and parameters for each endpoint can be checked in the `routes.http` file at the root of the project.

