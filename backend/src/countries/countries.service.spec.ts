import { Test, TestingModule } from '@nestjs/testing';
import { CountryService } from './countries.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CountryService', () => {
  let service: CountryService;

  const mockPrismaService = {
    country: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CountryService>(CountryService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all countries ordered alphabetically by name', async () => {
      const mockCountries = [
        { id: 'uuid-1', name: 'Australia', code: 'AU', createdAt: new Date() },
        { id: 'uuid-2', name: 'Canada', code: 'CA', createdAt: new Date() },
      ];

      mockPrismaService.country.findMany.mockResolvedValue(mockCountries);

      const result = await service.findAll();

      expect(mockPrismaService.country.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual(mockCountries);
    });
  });
});
