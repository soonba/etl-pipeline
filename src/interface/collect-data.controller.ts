import { Controller } from '@nestjs/common';
import { DataRepository } from '../domain/repository/data.repository';

@Controller({
  version: '1',
  path: 'collect-data',
})
export class CollectDataController {
  constructor(private readonly dataRepository: DataRepository) {}

  // @Get()
  // async get(): Promise<void> {
  // }
}
