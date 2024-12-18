import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Between, In, Repository } from 'typeorm';
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
    let categories: Category[] = [];
    if (updateProductDto.categories) {
      categories = await this.categoriesRepository.find({ where: { id: In(updateProductDto.categories)} });
    } else {
      categories = product.categories;
    }

    return this.productsRepository.save({ ...product, ...updateProductDto, categories });
  }

  remove(product: Product) {
    return this.productsRepository.delete(product.id);
  }
}
