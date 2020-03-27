import { Module } from '@nestjs/common';
import { CardnodeModule, UlmaxCard } from '@ulmax/cardnode';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDatabase } from '@ulmax/server-shared';
import { UsersAdmininistrationModule, CommunalData, PersonalBiodata } from '@ulmax/users-admininistration';

@Module({
  imports: [
    CardnodeModule,
    UsersAdmininistrationModule,
    TypeOrmModule.forRoot({ ...configDatabase(process.env.NODE_ENV),
       entities: [CommunalData, PersonalBiodata, UlmaxCard]
      }),
  ],
})
export class AppModule {}
