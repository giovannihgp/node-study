import { OnAnswerCreated } from "./on-answer-created.js"
import { makeAnswer } from "@test/factories/make-answer.js"
import { InMemoryAnswerAttachmentsRepository } from "@test/repositories/in-memory-answer-attachments-repository.js"
import { InMemoryAnswersRepository } from "@test/repositories/in-memory-answer-repository.js"
import { InMemoryQuestionAttachmentsRepository } from "@test/repositories/in-memory-question-attachments-repository.js"
import { InMemoryQuestionsRepository } from "@test/repositories/in-memory-questions-repository.js"
import type { SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "../use-case/send-notifications.js"
import { SendNotificationUseCase } from "../use-case/send-notifications.js"
import { InMemoryNotificationsRepository } from "@test/repositories/in-memory-notifications-repository.js"
import { makeQuestion } from "@test/factories/make-question.js"
import type { MockInstance } from "vitest"
import { waitFor } from "@test/utils/wait-for.js"
import { InMemoryStudentsRepository } from "@test/repositories/in-memory-students-repository.js"
import { InMemoryAttachmentsRepository } from "@test/repositories/in-memory-attachments-repository.js"

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (
    {
      ...args
    }: SendNotificationUseCaseRequest
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Createed', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    )
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase)
  })

  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    inMemoryQuestionsRepository.create(question)
    inMemoryAnswersRepository.create(answer)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})