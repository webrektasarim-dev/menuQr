import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;

    // If no user, JWT guard should have caught this
    if (!user) {
      return false;
    }

    // Check if user is accessing their own data
    // This guard ensures users can only access their own tenant data
    if (params.userId && params.userId !== user.userId) {
      throw new ForbiddenException('Access denied to this resource');
    }

    // For slug-based routes (public menu), we'll validate in the service
    // This guard is mainly for admin routes
    
    return true;
  }
}

