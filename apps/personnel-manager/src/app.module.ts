import { Module } from '@nestjs/common';
import { EHRpersonnelModule } from '@ulmax/ehr';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDatabase } from '@ulmax/server-shared';

@Module({
  imports: [
    EHRpersonnelModule,
    TypeOrmModule.forRoot(configDatabase(process.env.NODE_ENV)),
  ],
})
export class EHRPersonnelAppModule {}
