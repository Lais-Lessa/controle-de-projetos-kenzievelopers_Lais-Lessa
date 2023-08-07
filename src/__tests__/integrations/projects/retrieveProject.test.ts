import { main } from '../../configs/configTestsDatabase'
import supertest from 'supertest'
import app from '../../../app'
import { developer1 } from '../../mocks/developers.mock'
import { project1 } from '../../mocks/projects.mock'
import { client } from '../../../database'

describe('GET - /projects/:id', () => {
    beforeAll(async () => {
        await client.connect()
        await main(client)
    })

    afterAll(async () => {
        await client.end()
    })

    it('Sucesso - Listando dados de um projeto específico.', async () => {
        const developer = await supertest(app)
            .post('/developers')
            .send(developer1)

        const project = project1
        project.developerId = developer.body.id

        const projectResponse = await supertest(app)
            .post('/projects')
            .send(project)

        const response = await supertest(app).get(
            `/projects/${projectResponse.body.id}`
        )

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('projectId')
        expect(response.body).toHaveProperty('projectName')
        expect(response.body).toHaveProperty('projectDescription')
        expect(response.body).toHaveProperty('projectRepository')
        expect(response.body).toHaveProperty('projectStartDate')
        expect(response.body).toHaveProperty('projectEndDate')
        expect(response.body).toHaveProperty('projectDeveloperName')
    })

    it('Falha - Tentando listar um projeto com o id inválido.', async () => {
        const response = await supertest(app).get(`/projects/999`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('message')
    })
})
