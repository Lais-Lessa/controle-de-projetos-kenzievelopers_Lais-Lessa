import supertest from 'supertest'
import app from '../../../app'
import { main } from '../../configs/configTestsDatabase'
import { developer1 } from '../../mocks/developers.mock'
import { client } from '../../../database'

describe('DELETE - /developers/:id', () => {
    beforeAll(async () => {
        await client.connect()
        await main(client)
    })

    afterAll(async () => {
        await client.end()
    })

    test('Sucesso - Deletando um developer com sucesso.', async () => {
        const user = await supertest(app).post('/developers').send(developer1)

        const userId = user.body.id

        const response = await supertest(app).delete(`/developers/${userId}`)
        const listResponse = await supertest(app).get(`/developers/${userId}`)

        expect(listResponse.status).toBe(404)
        expect(response.status).toBe(204)
        expect(response.body).toStrictEqual({})
    })

    test('Falha - Tentando deletar um developer que não existe.', async () => {
        const response = await supertest(app).delete(`/developers/${999}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('message')
    })
})
