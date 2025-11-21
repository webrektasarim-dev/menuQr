import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PlanService } from '../common/services/plan.service';

@Module({
  imports: [PrismaModule],
  controllers: [TablesController],
  providers: [TablesService, PlanService],
  exports: [TablesService],
})
export class TablesModule {}

