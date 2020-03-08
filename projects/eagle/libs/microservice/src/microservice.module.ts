import { Module } from '@nestjs/common';
import { CrudMicroSerivceController } from './crud.controller';
import { ModelMicroService } from './crud.service';

@Module({
  controllers: [CrudMicroSerivceController],
  providers: [ModelMicroService],
  exports: [ModelMicroService],
})
export class MicroserviceModule {}
