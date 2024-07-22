import swaggerAutogen from 'swagger-autogen'

const doc = {
    info: {
        title: 'Event Management V2 API Documentation',
        version: '2.0.0',
        description: 'API Documentation for Event Management System',
        contact: {
            name: 'Henrique Reis',
            email: 'contatohenriquereis@gmail.com'
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v2/',
                description: "API Test"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                }
            }
        }
    }
}

const outputFile = './swagger-output.json'
const endpointsFiles = [
    '../src/infraestructure/routes/userRoute/userRoutes.ts',
    '../src/infraestructure/routes/eventRoute/eventRoutes.ts',
    '../src/infraestructure/routes/authRoute/authRoutes.ts',
]

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc)