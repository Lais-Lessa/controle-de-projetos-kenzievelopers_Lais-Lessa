import { main } from '../../configs/configTestsDatabase'
import supertest from 'supertest'
import app from '../../../app'
import { developer1, developer2, developer3 } from '../../mocks/developers.mock'
import {
    project1,
    project2,
    projectUpdate1,
    projectUpdate2,
    projectUpdateNotValidDeveloperId,
} from '../../mocks/projects.mock'
import { client } from '../../../database'

describe('PATCH - /projects/:id', () => {
    beforeAll(async () => {
        await client.connect()
        await main(client)
    })

    afterAll(async () => {
        await client.end()
    })

    it('Sucesso - Atualizando um projeto com sucesso.', async () => {
        const developer = await supertest(app)
            .post('/developers')
            .send(developer1)
        await supertest(app).post('/developers').send(developer2)

        const project = project1
        project.developerId = developer.body.id

        const projectResponse = await supertest(app)
            .post('/projects')
            .send(project)

        const response = await supertest(app)
            .patch(`/projects/${projectResponse.body.id}`)
            .send(projectUpdate1)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('description')
        expect(response.body).toHaveProperty('repository')
        expect(response.body).toHaveProperty('startDate')
        expect(response.body).toHaveProperty('endDate')
        expect(response.body).toHaveProperty('developerId')
    })

    it('Falha - Tentando atualizar um projeto com um id de projeto inválido.', async () => {
        const response = await supertest(app)
            .patch(`/projects/${999}`)
            .send(projectUpdate2)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('message')
    })

    it('Falha - Tentando atualizar um projeto com um developerId inválido.', async () => {
        const developer = await supertest(app)
            .post('/developers')
            .send(developer3)

        const project = project2
        project.developerId = developer.body.id
        const projectResponse = await supertest(app)
            .post('/projects')
            .send(project)

        const response = await supertest(app)
            .patch(`/projects/${projectResponse.body.id}`)
            .send(projectUpdateNotValidDeveloperId)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('message')
    })
})
