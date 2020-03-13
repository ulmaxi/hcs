import { Module } from '@nestjs/common';
import { CardnodeModule } from '@ulmax/cardnode';

@Module({
  imports: [CardnodeModule]
})
export class UlmaxCardNodeAppModule {}
