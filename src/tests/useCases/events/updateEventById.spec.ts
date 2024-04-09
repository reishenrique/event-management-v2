import { CustomError } from '../../../domain/errors/customError'
import { IEventRepository } from '../../../domain/interfaces/IEventRepository'
import { UpdateEventByIdUseCase } from '../../../domain/useCases/events/updateEventById.useCase'
import { EventRepositoryInMemory } from '../../mock/eventRepositoryInMemory'

const makeSut = (
  events?: any,
): { sut: UpdateEventByIdUseCase; mockEventRepository: IEventRepository } => {
  const mockEventRepository = new EventRepositoryInMemory(events)
  const sut = new UpdateEventByIdUseCase(mockEventRepository)

  jest.spyOn(mockEventRepository, 'findEventByIdAndUpdate')

  return { sut, mockEventRepository }
}

describe('Update event by id', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('Should search for a event by ID and update the data', async () => {
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

    const newEventData = {
      eventName: 'Mock Event - Updated',
      eventDescription: 'Mock Event - Updated',
    }

    const event = await sut.execute(id, newEventData)
    console.log(event)

    expect(event.eventName).toBe('Mock Event - Updated')
    expect(event.eventDescription).toBe('Mock Event - Updated')

    expect(mockEventRepository.findEventByIdAndUpdate).toHaveBeenCalledTimes(1)
  })

  it('Should return an exception when the user ID is not provided for search and update', async () => {
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

    const newEventData = {
      eventName: 'Mock Event - Updated',
      eventDescription: 'Mock Event - Updated',
    }

    await expect(sut.execute(undefined, newEventData)).rejects.toThrow(
      CustomError.BadRequestError(
        'Event ID is required to proceed with update execution',
      ),
    )

    expect(mockEventRepository.findEventByIdAndUpdate).not.toHaveBeenCalled()
  })
})
