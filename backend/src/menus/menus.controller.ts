import { Controller, Get, Post, Body, Patch, Delete, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Menus')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  // Public route - Get menu by slug (for QR menu page)
  @Get('public/:slug')
  @ApiOperation({ summary: 'Get public menu by business slug' })
  async getPublicMenu(@Param('slug') slug: string) {
    return this.menusService.findBySlug(slug);
  }

  // Protected routes
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create menu' })
  async create(@CurrentUser() user: any, @Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(user.userId, createMenuDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get current user menu' })
  async findOne(@CurrentUser() user: any) {
    return this.menusService.findOne(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch()
  @ApiOperation({ summary: 'Update menu' })
  async update(@CurrentUser() user: any, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(user.userId, updateMenuDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete()
  @ApiOperation({ summary: 'Delete menu' })
  async remove(@CurrentUser() user: any) {
    return this.menusService.remove(user.userId);
  }
}

