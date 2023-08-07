import { main } from '../../configs/configTestsDatabase'
import supertest from 'supertest'
import app from '../../../app'
import { developer1 } from '../../mocks/developers.mock'
import { client } from '../../../database'

describe('POST - /developers', () => {
    beforeAll(async () => {
        await client.connect()
        await main(client)
    })

    afterAll(async () => {
        await client.end()
    })

    it('Sucesso - Criando um developer com sucesso.', async () => {
        const response = await supertest(app)
            .post('/developers')
            .send(developer1)

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('email')
    })

    it('Falha - Criando um developer com email já cadastrado.', async () => {
        const response = await supertest(app)
            .post('/developers')
            .send(developer1)

        expect(response.status).toBe(409)
        expect(response.body).toHaveProperty('message')
    })
})
