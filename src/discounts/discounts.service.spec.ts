import { Test, TestingModule } from '@nestjs/testing';
import { PercentageDiscountsService } from './percentage-discounts.service';

describe('DiscountDiscountsService', () => {
  let service: PercentageDiscountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PercentageDiscountsService],
    }).compile();

    service = module.get<PercentageDiscountsService>(
      PercentageDiscountsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
