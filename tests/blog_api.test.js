const supertest = require('supertest');
const { app, server} = require('../index')
const api = supertest(app)

test('blogi json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('connectin-Type', /application\/json/)
})

afterAll(() => {
    server.close()
})