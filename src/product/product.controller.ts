import {
	Body,
	Patch,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	HttpCode,
} from '@nestjs/common';
import { FindProductDto } from './dto/find-product.dto';
import { ProductModel } from './product.model';

@Controller('product')
export class ProductController {
	@Post('create')
	async create(@Body() dto: Omit<ProductModel, '_id'>) {}

	@Get(':id')
	async get(@Param('id') id: string) {}

	@Patch(':id')
	async patch(@Param('id') id: string, dto: ProductModel) {}

	@Delete(':id')
	async delete(@Param('id') id: string) {}

	@HttpCode(200)
	@Post()
	async find(@Body() dto: FindProductDto) {}
}
