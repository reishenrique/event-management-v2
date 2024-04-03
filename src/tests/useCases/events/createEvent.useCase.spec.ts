/* eslint-disable @typescript-eslint/no-explicit-any */

import { IEventRepository } from '../../../domain/interfaces/IEventRepository'
import { CreateEventUseCase } from '../../../domain/useCases/events/createEvent.useCase'
import { EventRepositoryInMemory } from '../../mock/eventRepositoryInMemory'

const makeSut = (
  events?: any,
): {
  mockEventRepository: IEventRepository
  sut: CreateEventUseCase
} => {
  const mockEventRepository = new EventRepositoryInMemory(events)
  const sut = new CreateEventUseCase(mockEventRepository)

  jest.spyOn(mockEventRepository, 'findEventByCnpj')
  jest.spyOn(mockEventRepository, 'findEventByName')
  jest.spyOn(mockEventRepository, 'createEvent')

  return { sut, mockEventRepository }
}

describe('EventController', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('Should return a new event successfully registered', async () => {
    const { sut, mockEventRepository } = makeSut()

    const event = {
      eventName: 'Event Test',
      eventDescription: 'Event Test Description',
      cnpj: '11122233344455',
      location: 'São Paulo',
      eventType: 'Academic and Educational Event',
      eventTicketPrice: 1000,
      venueCapacity: 1000,
      contactInformation: 'Teste Contact information',
      paymentMethodOption: 'Credit',
    }

    const newEvent = await sut.execute(event)

    expect(newEvent.eventName).toBe(event.eventName)

    expect(mockEventRepository.findEventByName).toHaveBeenCalledTimes(1)
    expect(mockEventRepository.findEventByCnpj).toHaveBeenCalledTimes(1)
    expect(mockEventRepository.createEvent).toHaveBeenCalledTimes(1)
  })
})
