import { Controller, Get } from '@nestjs/common';
import { CountryService } from './countries.service';

@Controller('countries')
export class CountryController {
  constructor(private readonly countriesService: CountryService) {}

  @Get()
  findAll() {
    return this.countriesService.findAll();
  }
}
