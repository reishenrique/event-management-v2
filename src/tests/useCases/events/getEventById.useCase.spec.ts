import { CustomError } from '../../../domain/errors/customError'
import { IEventRepository } from '../../../domain/interfaces/IEventRepository'
import { GetEventByIdUseCase } from '../../../domain/useCases/events/getEventById.useCase'
import { EventRepositoryInMemory } from '../../mock/eventRepositoryInMemory'

const makeSut = (
  events?: any,
): { sut: GetEventByIdUseCase; mockEventRepository: IEventRepository } => {
  const mockEventRepository = new EventRepositoryInMemory(events)
  const sut = new GetEventByIdUseCase(mockEventRepository)

  jest.spyOn(mockEventRepository, 'findEventById')

  return { sut, mockEventRepository }
}

describe('Get event by id', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should search for a event by their id and return successfully', async () => {
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

    const event = await sut.execute(id)

    expect(event).toEqual(mockEvent)

    expect(mockEventRepository.findEventById).toHaveBeenCalledTimes(1)
  })

  it('Should throw an exception when the user id is not provided', async () => {
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

    await expect(sut.execute(undefined)).rejects.toThrow(
      CustomError.BadRequestError(
        'Event ID is required to proceed with the search execution',
      ),
    )

    expect(mockEventRepository.findEventById).not.toHaveBeenCalled()
  })
})
