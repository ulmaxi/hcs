import { Module } from '@nestjs/common';
import { LotaService } from './lota.service';

@Module({
  providers: [LotaService],
  exports: [LotaService],
})
export class LotaModule {}
