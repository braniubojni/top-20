import {
	Body,
	Patch,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	HttpCode,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post('create')
	async create(@Body() dto: CreateProductDto) {
		return await this.productService.create(dto);
	}

	@Get(':id')
	async get(@Param('id') id: Required<Types.ObjectId>) {
		return await this.productService.findById(id);
	}

	@Patch(':id')
	async patch(
		@Param('id') id: Required<Types.ObjectId>,
		@Body() dto: CreateProductDto,
	) {
		return await this.productService.updateById(id, dto);
	}

	@Delete(':id')
	async delete(@Param('id') id: Required<Types.ObjectId>) {
		return await this.productService.deleteById(id);
	}

	// @UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindProductDto) {
		console.log('Worked');
		return await this.productService.findWithReviews(dto);
	}
}
