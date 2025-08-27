import { Module } from '@nestjs/common';
import { CollectDataUseCase } from './collect-data.use-case';
import { InfraModule } from '../infra/infra.module';

@Module({
  imports: [InfraModule],
  providers: [CollectDataUseCase],
  exports: [CollectDataUseCase],
})
export class ApplicationModule {}
