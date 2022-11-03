import { test, describe, beforeEach, afterAll, expect } from 'vitest'
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(helper.initialNotes)
}, 20000)

describe.skip('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 40000)

  test('all the notes are returned', async () => {
    const res = await api.get('/api/notes')

    expect(res.body).toHaveLength(helper.initialNotes.length)
  }, 20000)

  test('a specific note is within the returned notes', async () => {
    const res = await api.get('/api/notes')

    const contents = res.body.map(cont => cont.content)
    expect(contents).toContain(
      'Browser can execute only Javascript'
    )
  }, 20000)
})

describe.skip('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
    expect(resultNote.body).toEqual(processedNoteToView)
  })

  test('fails with status code 404 if note doesnt exist', async () => {
    const validNotExistingId = await helper.nonExistingId()
    console.log(validNotExistingId)

    await api
      .get(`/api/notes/${validNotExistingId}`)
      .expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/notes/${invalId}`)
      .expect(400)
  })
})

describe.skip('addition of a note', () => {
  test('succeeds with valid data', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('fails with status code 400 if data invalid', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

describe.skip('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(
      helper.initialNotes.length - 1
    )

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).not.toContain(noteToDelete.content)
  })

  test('fails with status code 400 is the id is invalid or the note doesnt exist', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[10]

    await api
      .delete(`/api/notes/${noteToDelete}`)
      .expect(400)

    const notes = await helper.notesInDb()
    expect(notesAtStart).toHaveLength(notes.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
