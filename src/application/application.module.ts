import { Module } from '@nestjs/common';
import { CollectDataUseCase } from './collect-data.use-case';
import { InfraModule } from '../infra/infra.module';
import { PipelineFacade } from './pipeline-facade';
import { DomainModule } from '../domain/domain.module';

@Module({
  imports: [InfraModule, DomainModule],
  providers: [CollectDataUseCase, PipelineFacade],
  exports: [PipelineFacade],
})
export class ApplicationModule {}
