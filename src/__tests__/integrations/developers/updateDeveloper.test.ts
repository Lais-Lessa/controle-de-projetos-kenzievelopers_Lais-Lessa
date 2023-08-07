import supertest from 'supertest'
import app from '../../../app'
import { main } from '../../configs/configTestsDatabase'
import {
    developer1,
    developer2,
    developerUpdate1,
} from '../../mocks/developers.mock'
import { client } from '../../../database'

describe('PATCH - /developers/:id', () => {
    beforeAll(async () => {
        await client.connect()
        await main(client)
    })

    afterAll(async () => {
        await client.end()
    })

    test('Sucesso - Atualizando um developer com sucesso.', async () => {
        const user = await supertest(app).post('/developers').send(developer1)

        const userId = user.body.id

        const response = await supertest(app)
            .patch(`/developers/${userId}`)
            .send(developerUpdate1)

        expect(response.status).toBe(200)
        expect(response.body.email).toBe(developerUpdate1.email)
    })

    test('Falha - Tentando atualizar um developer com email já cadastrado.', async () => {
        const user = await supertest(app).post('/developers').send(developer2)

        const userId = user.body.id

        const response = await supertest(app)
            .patch(`/developers/${userId}`)
            .send(developerUpdate1)

        expect(response.status).toBe(409)
        expect(response.body).toHaveProperty('message')
    })

    test('Falha - Tentando atualizar um developer que não existe.', async () => {
        const response = await supertest(app)
            .patch(`/developers/${999}`)
            .send(developerUpdate1)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('message')
    })
})
