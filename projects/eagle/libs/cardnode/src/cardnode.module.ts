import { Module } from '@nestjs/common';
import { CardnodeService } from './cardnode.service';

@Module({
  providers: [CardnodeService],
  exports: [CardnodeService],
})
export class CardnodeModule {}
