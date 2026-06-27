import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { DepartmentsModule } from './departments/departments.module';
import { RolesModule } from './roles/roles.module';
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    DepartmentsModule,
    RolesModule,
    CountriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
