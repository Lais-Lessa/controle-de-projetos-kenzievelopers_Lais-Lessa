import supertest from 'supertest'
import { main } from '../../configs/configTestsDatabase'
import app from '../../../app'
import { developer1, developer2, developer3 } from '../../mocks/developers.mock'
import {
    developerInfo1,
    developerInfoNotAccepted,
} from '../../mocks/developerInfo.mock'
import { client } from '../../../database'

describe('POST - /developers/:id/infos', () => {
    beforeAll(async () => {
        await client.connect()
        await main(client)
    })

    afterAll(async () => {
        await client.end()
    })

    it('Sucesso - Criando uma developerInfo com sucesso.', async () => {
        const user = await supertest(app).post('/developers').send(developer1)

        const userId = user.body.id

        const response = await supertest(app)
            .post(`/developers/${userId}/infos`)
            .send(developerInfo1)

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('developerSince')
        expect(response.body).toHaveProperty('preferredOS')
        expect(response.body).toHaveProperty('developerId')

        expect(response.body.developerId).toBe(userId)
        expect(response.body.preferredOS).toBe(developerInfo1.preferredOS)
        response.pause()
    })

    it('Falha - Tentando cadastrar uma informação à um usuário que já possui informação atrelada à ele.', async () => {
        const user = await supertest(app).post('/developers').send(developer2)

        const userId = user.body.id

        await supertest(app)
            .post(`/developers/${userId}/infos`)
            .send(developerInfo1)

        const response = await supertest(app)
            .post(`/developers/${userId}/infos`)
            .send(developerInfo1)

        expect(response.status).toBe(409)
        expect(response.body).toHaveProperty('message')
    })

    it('Falha - Tentando cadastrar preferedOS a um usuário que não existe', async () => {
        const response = await supertest(app)
            .post(`/developers/999/infos`)
            .send(developerInfoNotAccepted)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('message')
    })
})
