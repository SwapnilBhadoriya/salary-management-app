import { Module } from '@nestjs/common';
import { CountryService } from './countries.service';
import { CountryController } from './countries.controller';

@Module({
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountriesModule {}
