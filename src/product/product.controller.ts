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
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { MongoIdValidationPipe } from '../common/pipes/mongo-id-validation.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ProductService } from './product.service';

@UsePipes(new ValidationPipe())
@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(@Body() dto: CreateProductDto) {
		return this.productService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(
		@Param('id', MongoIdValidationPipe) id: string,
		@Body() dto: CreateProductDto,
	) {
		return this.productService.updateById(id, dto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', MongoIdValidationPipe) id: string) {
		return this.productService.deleteById(id);
	}

	@Post('find')
	async find(@Body() dto: FindProductDto) {
		return this.productService.findWithReviews(dto);
	}

	@Get(':id')
	async get(@Param('id', MongoIdValidationPipe) id: string) {
		return this.productService.findByProdId(id);
	}
}
