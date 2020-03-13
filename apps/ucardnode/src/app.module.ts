import { Module } from '@nestjs/common';
import { CardnodeModule } from '@ulmax/cardnode';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDatabase } from '@ulmax/server-shared';

@Module({
  imports: [
    CardnodeModule,     
    TypeOrmModule.forRoot(configDatabase(process.env.NODE_ENV))
  ]
})
export class UlmaxCardNodeAppModule {}