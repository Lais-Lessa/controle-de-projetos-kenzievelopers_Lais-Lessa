import supertest from 'supertest'
import app from '../../../app'
import { main } from '../../configs/configTestsDatabase'
import { developer1 } from '../../mocks/developers.mock'
import { client } from '../../../database'

describe('GET - /developers/:id', () => {
    beforeAll(async () => {
        await client.connect()
        await main(client)
    })

    afterAll(async () => {
        await client.end()
    })

    test('Sucesso - Listando dados de um developer específico, mesclados com developer_infos', async () => {
        const user = await supertest(app).post('/developers').send(developer1)

        const userId = user.body.id

        const response = await supertest(app).get(`/developers/${userId}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('developerId')
        expect(response.body).toHaveProperty('developerName')
        expect(response.body).toHaveProperty('developerEmail')
        expect(response.body).toHaveProperty('developerInfoDeveloperSince')
        expect(response.body).toHaveProperty('developerInfoPreferredOS')
    })

    test('Falha - Tentando listar os dados de um usuário não cadastrado', async () => {
        const response = await supertest(app).get(`/developers/${999}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('message')
    })
})
