import { main } from '../../configs/configTestsDatabase'
import supertest from 'supertest'
import app from '../../../app'
import { developer1 } from '../../mocks/developers.mock'
import { project1, projectNotValidDeveloper } from '../../mocks/projects.mock'
import { client } from '../../../database'

describe('POST - /projects', () => {
    beforeAll(async () => {
        await client.connect()
        await main(client)
    })

    afterAll(async () => {
        await client.end()
    })

    it('Sucesso - Criando um projeto com sucesso.', async () => {
        const developer = await supertest(app)
            .post('/developers')
            .send(developer1)

        const project = project1
        project.developerId = developer.body.id

        const response = await supertest(app).post('/projects').send(project)

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('description')
        expect(response.body).toHaveProperty('repository')
        expect(response.body).toHaveProperty('startDate')
        expect(response.body).toHaveProperty('endDate')
        expect(response.body).toHaveProperty('developerId')
    })

    it('Falha - Tentando criar um projeto com developerId inválido.', async () => {
        const response = await supertest(app)
            .post('/projects')
            .send(projectNotValidDeveloper)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('message')
    })
})
