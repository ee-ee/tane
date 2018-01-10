const request = require('supertest')
const app = require('../src/app')

describe('Test the root path', () => {
    test('GET / should respond with a 404', () => {
        return request(app).get('/').expect(404)
    })
})

describe('Test the /boards path', () => {
  test('GET /boards should respond with all boards', () => {
    return request(app).get('/boards')
      .expect('Content-Type', /json/)
      .expect(200)
  })

  test('POST /boards should create a new board', () => {
    return request(app).post('/boards')
      .field('slug', 'comp')
      .field('name', 'Computarias')
      .expect('Content-Type', /json/)
      .expect(201, {
        board: {
          slug: 'comp',
          name: 'Computarias',
          url: '/boards/comp'
        }
      })
  })

  test('POST /boards should not create without slug', () => {
    return request(app).post('/boards')
      .field('name', 'Computarias')
      .expect('Content-Type', /json/)
      .expect(422, {
        error: 'Missing board slug'
      })
  })

  test('POST /boards should not create without name', () => {
    return request(app).post('/boards')
      .field('slug', 'comp')
      .expect('Content-Type', /json/)
      .expect(422, {
        error: 'Missing board name'
      })
  })

  test('GET /boards/{slug} should 404 for inexistent board', () => {
    return request(app).get('/boards/kek')
      .expect(404)
  })

  test('GET /boards/{slug} should respond with a valid board', () => {
    return request(app).get('/boards/comp')
      .expect('Content-Type', /json/)
      .expect(200, {
        board: {
          slug: 'comp',
          name: 'Computarias',
          url: '/boards/comp'
        }
      })
  })
})

describe('Test the /boards path', () => {
  test('GET /boards/{slug}/threads should respond with all threads', () => {
    return request(app).get('/boards/comp/threads')
      .expect('Content-Type', /json/)
      .expect(200, {
        board: {
          slug: 'comp',
          name: 'Computarias',
          url: '/boards/comp',
          threads: []
        }
      })
  })

  test('GET /boards/{slug}/threads should 404 for an invalid slug', () => {
    return request(app).get('/boards/kek/threads')
      .expect(404)
  })

  test ('POST /boards/{slug}/threads should create a new thread', () => {
    return request(app).post('/boards/comp/threads')
      .field('subject', 'Random Subject')
      .field('body', 'A random text for a new thread.')
      .expect('Content-Type', /json/)
      .expect(201, {
        thread: {
          number: 1,
          subject: 'Random Subject',
          body: 'A random text for a new thread.'
        }
      })
  })

  test('POST /boards/{slug}/threads should create a new thread without a subject', () => {
    return request(app).post('/boards/comp/threads')
      .field('body', 'A random text for a new thread.')
      .expect('Content-Type', /json/)
      .expect(201, {
        thread: {
          number: 2,
          subject: '',
          body: 'A random text for a new thread.',
          replies: []
        }
      })
  })

  test('POST /boards/{slug}/threads should not create a new thread without a body', () => {
    return request(app).post('/boards/comp/threads')
      .expect(422, {
        error: 'Missing post body'
      })
  })

  test('GET /boards/{slug}/threads/{number} should 404 if inexistent thread', () => {
    return request(app).get('/boards/comp/threads/4945930')
      .expect(404)
  })

  test('GET /boards/{slug}/threads/{number} should 404 if invalid number', () => {
    return request(app).get('/boards/comp/threads/kek')
      .expect(404)
  })

  test('GET /boards/{slug}/threads/{number} should return thread', () => {
    return request(app).get('/boards/comp/threads/1')
      .expect('Content-Type', /json/)
      .expect(200, {
        thread: {
          number: 1,
          subject: 'Random Subject',
          body: 'A random text for a new thread.',
          replies: []
        }
      })
  })

  test('POST /boards/{slug}/threads/{number} should create a new reply', () => {
    return request(app).post('/boards/comp/threads/1')
      .field('body', 'A random reply.')
      .expect('Content-Type', /json/)
      .expect(201, {
        thread: {
          number: 1,
          subject: 'Random Subject',
          body: 'A random text for a new thread.',
          replies: [
            {
              number: 3,
              body: 'A random reply.'
            }
          ]
        }
      })
  })

  test('POST /boards/{slug}/threads/{number} should not create a new reply without a body', () => {
    return request(app).post('/boards/comp/threads/1')
      .field('body', 'A random reply.')
      .expect(422, {
        error: 'Missing post body'
      })
  })
})
