import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, DepartmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
