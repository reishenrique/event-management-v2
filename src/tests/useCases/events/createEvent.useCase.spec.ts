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
