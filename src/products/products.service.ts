import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Between, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { QueryProductDto } from './dto/query-product.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  findAll(productQuery: QueryProductDto) {
    return this.productsRepository.find({
      where: { 
        name: productQuery.name,
        priceSubunit: Between(productQuery.price_subunit.gte, productQuery.price_subunit.lte),
        
      } 
    });
  }

  findOne(id: number) {
    return this.productsRepository.findOne({ where: { id }, relations: ['categories'] });
  }

  create(createProductDto: CreateProductDto) {
    return this.productsRepository.save(createProductDto);
  }

  async update(product: Product, updateProductDto: UpdateProductDto) {
    const categories = await this.categoriesRepository.find({ where: updateProductDto.categories.map((id) => ({ id }))});
    return this.productsRepository.save({ ...product, ...updateProductDto, categories });
  }

  remove(product: Product) {
    return this.productsRepository.delete(product.id);
  }
}
