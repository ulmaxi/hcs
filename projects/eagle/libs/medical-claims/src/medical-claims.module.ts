import { Module } from '@nestjs/common';
import { MedicalClaimsService } from './medical-claims.service';

@Module({
  providers: [MedicalClaimsService],
  exports: [MedicalClaimsService],
})
export class MedicalClaimsModule {}
