import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app.js'
import request from 'supertest'
import { db } from '../src/database.js'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
    await db.migrate.latest()
  })

  afterAll(async () => {
    await db.destroy()
    await app.close()
  })

  beforeEach(async () => {
    await db.raw('SET FOREIGN_KEY_CHECKS = 0')
    await db('transactions').truncate()
    await db.raw('SET FOREIGN_KEY_CHECKS = 1')
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: '5000.00',
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: '5000.00',
        type: 'credit',
      })

    const cookies = createResponse.get('Set-Cookie') ?? []

    const listResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: '5000.00',
      }),
    ])
  })

  it('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: '3000.00',
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie') ?? []

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
        expect.objectContaining({
            title: 'New transaction',
            amount: '3000.00',
        }),
    )
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: '5000.00',
        type: 'credit',
      })
    
    const cookies = createTransactionResponse.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        amount: '2000.00',
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
        amount: '3000.00',
    })
  })
})