import { CustomError } from '../../../domain/errors/customError'
import { IEventRepository } from '../../../domain/interfaces/IEventRepository'
import { DeleteEventByIdUseCase } from '../../../domain/useCases/events/deleteEventById.useCase'
import { EventRepositoryInMemory } from '../../mock/eventRepositoryInMemory'

const makeSut = (
  events?: any,
): { sut: DeleteEventByIdUseCase; mockEventRepository: IEventRepository } => {
  const mockEventRepository = new EventRepositoryInMemory(events)
  const sut = new DeleteEventByIdUseCase(mockEventRepository)

  jest.spyOn(mockEventRepository, 'deleteEventById')
  jest.spyOn(mockEventRepository, 'findEventById')

  return { sut, mockEventRepository }
}

describe('Delete event by id', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('Should delete the event with provided id', async () => {
    const mockEvent = {
      _id: '6602d505cfa1f38f545a4542',
      eventName: 'Mock Event',
      eventDescription: 'Mock Event',
      cnpj: '12345678901220',
      location: 'São Paulo',
      eventType: 'Social Event',
      eventTicketPrice: 1000,
      venueCapacity: 1000,
      contactInformation: 'Test mock event',
      paymentMethod: 'Credit',
    }

    const { sut, mockEventRepository } = makeSut([mockEvent])

    const id = '6602d505cfa1f38f545a4542'

    await expect(sut.execute(id))

    expect(mockEventRepository.findEventById).toHaveBeenCalledTimes(1)
    expect(mockEventRepository.deleteEventById).toHaveBeenCalledTimes(1)
  })

  it('Should return an exception when the user is not fount by ID for deletion', async () => {
    const mockEvent = {
      _id: '6602d505cfa1f38f545a4542',
      eventName: 'Mock Event',
      eventDescription: 'Mock Event',
      cnpj: '12345678901220',
      location: 'São Paulo',
      eventType: 'Social Event',
      eventTicketPrice: 1000,
      venueCapacity: 1000,
      contactInformation: 'Test mock event',
      paymentMethod: 'Credit',
    }

    const { sut, mockEventRepository } = makeSut([mockEvent])

    const id = '6602d505cfa1f38f545a454'

    await expect(sut.execute(id)).rejects.toThrow(
      CustomError.NotFoundError('Event not found'),
    )

    expect(mockEventRepository.findEventById).toHaveBeenCalledTimes(1)

    expect(mockEventRepository.deleteEventById).not.toHaveBeenCalled()
  })
})
