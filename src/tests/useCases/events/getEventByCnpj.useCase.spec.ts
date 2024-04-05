import { CustomError } from '../../../domain/errors/customError'
import { IEventRepository } from '../../../domain/interfaces/IEventRepository'
import { GetEventByCnpjUseCase } from '../../../domain/useCases/events/getEventByCnpj.useCase'
import { EventRepositoryInMemory } from '../../mock/eventRepositoryInMemory'

const makeSut = (
  events?: any,
): { sut: GetEventByCnpjUseCase; mockEventRepository: IEventRepository } => {
  const mockEventRepository = new EventRepositoryInMemory(events)
  const sut = new GetEventByCnpjUseCase(mockEventRepository)

  jest.spyOn(mockEventRepository, 'findEventByCnpj')

  return { sut, mockEventRepository }
}

describe('Get event by cnpj', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('Should search for a event by their cnpj and return successfully', async () => {
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

    const cnpj = '12345678901220'

    const user = await sut.execute(cnpj)

    expect(user).toEqual(mockEvent)

    expect(mockEventRepository.findEventByCnpj).toHaveBeenCalledTimes(1)
  })

  it('Should throw an exception when the event cnpj is not provided', async () => {
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
        'Event CNPJ is required to proceed with the search execution',
      ),
    )

    expect(mockEventRepository.findEventByCnpj).not.toHaveBeenCalled()
  })
})
