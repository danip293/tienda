import { Controller, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { ProductsController } from './products.controller';

// Services
import { ProductsService } from './products.service';

// Entities
import { Product } from './entities/product.entity';
// import { Content, Photo, Post, Question } from './entities/sobrecarga';
import { ProductRepository } from './products.repository';
import { AuditRepository } from './audit.repository';
import { EntitySubcriber } from './entity.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository, AuditRepository])],
  controllers: [ProductsController],
  providers: [ProductsService, EntitySubcriber],
  exports: [ProductsService],
})
export class ProductsModule {}
