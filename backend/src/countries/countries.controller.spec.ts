import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from './countries.controller';
import { CountryService } from './countries.service';

describe('CountryController', () => {
  let controller: CountryController;

  const mockCountryService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [
        {
          provide: CountryService,
          useValue: mockCountryService,
        },
      ],
    }).compile();

    controller = module.get<CountryController>(CountryController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all countries', async () => {
      const expectedResult = [
        { id: 'uuid-1', name: 'Australia', code: 'AU', createdAt: new Date() },
        { id: 'uuid-2', name: 'Canada', code: 'CA', createdAt: new Date() },
      ];

      mockCountryService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(mockCountryService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});
