import { Controller, Get } from '@nestjs/common';
import { BASE_API_URL } from 'src/common/constants';
import { ChartsService } from './charts.service';

@Controller(`${BASE_API_URL}/charts`)
export class ChartsController {
  constructor(private chartsService: ChartsService) {}

  @Get('chart-compose-product')
  getChartComposeProduct() {
    return this.chartsService.chartComposeProduct();
  }

  @Get('chart-category')
  getChartCategory() {
    return this.chartsService.chartCategory();
  }

  @Get('count')
  count() {
    return this.chartsService.chartsCount();
  }

  @Get('user-stat')
  userStat() {
    return this.chartsService.userStat();
  }

  @Get('order-stat')
  orderStat() {
    return this.chartsService.orderStat();
  }

  @Get('product-sellest')
  getProductSellest() {
    return this.chartsService.getProductSellest();
  }

  @Get('revenue')
  getRevenue() {
    return this.chartsService.getRevenueMonthly();
  }
}
