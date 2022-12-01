import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterQueryProductDto } from './dto/filter-query.product';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  findAll(@Query() paginationQuery: FilterQueryProductDto) {
    return this.productService.list(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Body() productBody) {
    return this.productService.retrieve(id);
  }

  @Post()
  create(@Body() productBody: CreateProductDto) {
    return this.productService.create(productBody);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() productBody: UpdateProductDto) {
    return this.productService.update(id, productBody);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
