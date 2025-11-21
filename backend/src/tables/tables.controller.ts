import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Tables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @ApiOperation({ summary: 'Create table' })
  create(@CurrentUser() user: any, @Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(user.userId, createTableDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tables' })
  findAll(@CurrentUser() user: any) {
    return this.tablesService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get table by ID' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.tablesService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update table' })
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return this.tablesService.update(user.userId, id, updateTableDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete table' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.tablesService.remove(user.userId, id);
  }

  // Public route - Get table by qrCode (for checkout)
  @Get('public/qr/:qrCode')
  @ApiOperation({ summary: 'Get table by QR code (public)' })
  async findByQrCode(@Param('qrCode') qrCode: string) {
    return this.tablesService.findByQrCode(qrCode);
  }
}

