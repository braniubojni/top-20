import {
	Body,
	Patch,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { MongoObjectIdDto } from 'src/common/dto/mongo-object-id.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ProductService } from './product.service';

@UsePipes(new ValidationPipe())
@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post('create')
	async create(@Body() dto: CreateProductDto) {
		return await this.productService.create(dto);
	}

	@Patch(':id')
	async patch(
		@Param('id') id: MongoObjectIdDto,
		@Body() dto: CreateProductDto,
	) {
		return await this.productService.updateById(id, dto);
	}

	@Delete(':id')
	async delete(@Param('id') id: MongoObjectIdDto) {
		return await this.productService.deleteById(id);
	}

	@Post('find')
	async find(@Body() dto: FindProductDto) {
		return await this.productService.findWithReviews(dto);
	}

	@Get(':id')
	async get(@Param('id') id: MongoObjectIdDto) {
		console.log(id);
		return await this.productService.findById(id);
	}
}
