import { Module } from '@nestjs/common';
import { CollectDataUseCase } from './collect-data.use-case';
import { DataSourceModule } from './data-souces/data-source.module';

@Module({
  imports: [DataSourceModule],
  providers: [CollectDataUseCase],
  exports: [CollectDataUseCase],
})
export class ApplicationModule {}
