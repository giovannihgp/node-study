import { makeAnswer } from "@test/factories/make-answer.js"
import { InMemoryAnswerAttachmentsRepository } from "@test/repositories/in-memory-answer-attachments-repository.js"
import { InMemoryAnswersRepository } from "@test/repositories/in-memory-answer-repository.js"
import { InMemoryQuestionAttachmentsRepository } from "@test/repositories/in-memory-question-attachments-repository.js"
import { InMemoryQuestionsRepository } from "@test/repositories/in-memory-questions-repository.js"
import type { SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "../use-case/send-notifications.js"
import { SendNotificationUseCase} from "../use-case/send-notifications.js"
import { InMemoryNotificationsRepository } from "@test/repositories/in-memory-notifications-repository.js"
import { makeQuestion } from "@test/factories/make-question.js"
import type { MockInstance } from "vitest"
import { waitFor } from "@test/wait-for.js"
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen.js"
import { InMemoryAttachmentsRepository } from "@test/repositories/in-memory-attachments-repository.js"
import { InMemoryStudentsRepository } from "@test/repositories/in-memory-students-repository.js"

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  ({
    ...args
  }: SendNotificationUseCaseRequest) => Promise<SendNotificationUseCaseResponse>
>

describe('On Question Best Answer Chosen', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
          inMemoryQuestionAttachmentsRepository,
          inMemoryAttachmentsRepository,
          inMemoryStudentsRepository,
        )
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswersRepository = 
          new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepository,
        )
        inMemoryNotificationsRepository =  new InMemoryNotificationsRepository()
        sendNotificationUseCase = 
          new SendNotificationUseCase(
            inMemoryNotificationsRepository,
        )

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        new OnQuestionBestAnswerChosen(inMemoryAnswersRepository, sendNotificationUseCase)
    })

    it('should send a notification when topic has new best answer chosen', async () => {
        const question = makeQuestion()
        const answer = makeAnswer({ questionId: question.id })

        inMemoryQuestionsRepository.create(question)
        inMemoryAnswersRepository.create(answer)

        question.bestAnswerId = answer.id

        inMemoryQuestionsRepository.save(question)

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })
    })
})