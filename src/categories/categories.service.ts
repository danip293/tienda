import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoriesRepository.save(createCategoryDto);
  }

  findAll() {
    return this.categoriesRepository.find();
  }

  findOne(id: number) {
    return this.categoriesRepository.findOne(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const product = await this.categoriesRepository.preload({
      id,
      ...updateCategoryDto,
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} was not found`);
    }
    product.userId = '123';
    const res = await this.categoriesRepository.save(product);
    return res;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
