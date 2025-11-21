import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheService } from '../common/services/cache.service';

@Module({
  imports: [PrismaModule],
  controllers: [MenusController],
  providers: [MenusService, CacheService],
  exports: [MenusService],
})
export class MenusModule {}

