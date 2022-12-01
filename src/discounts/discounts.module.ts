import { Module } from '@nestjs/common';
import { PercentageDiscountsService } from './percentage-discounts.service';
import { CurrencyDiscountsService } from './currency-discount.service';

@Module({
  providers: [PercentageDiscountsService, CurrencyDiscountsService],
  exports: [PercentageDiscountsService, CurrencyDiscountsService],
})
export class DiscountsModule {}
