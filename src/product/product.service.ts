import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { NOT_FOUND_ID } from 'src/common/exceptions/not-found.constants';
import { ReviewModel } from 'src/review/review.model';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ProductModel } from './product.model';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(ProductModel)
		private readonly productRepository: ModelType<ProductModel>,
	) {}

	async create(dto: CreateProductDto): Promise<DocumentType<ProductModel>> {
		const product = await this.productRepository.create(dto);
		return product;
	}

	async findById(
		id: Required<Types.ObjectId>,
	): Promise<DocumentType<ProductModel>> {
		const product = await this.productRepository.findById(id).exec();
		if (!product) {
			throw new NotFoundException(NOT_FOUND_ID);
		}
		return product;
	}

	async deleteById(
		id: Required<Types.ObjectId>,
	): Promise<DocumentType<ProductModel>> {
		const removedProduct = await this.productRepository
			.findByIdAndDelete(id)
			.exec();
		if (!removedProduct) {
			throw new NotFoundException(NOT_FOUND_ID);
		}
		return removedProduct;
	}

	async updateById(
		id: Required<Types.ObjectId>,
		dto: CreateProductDto,
	): Promise<DocumentType<ProductModel>> {
		const updatedProduct = await this.productRepository
			.findByIdAndUpdate(id, dto, {
				new: true,
			})
			.exec();
		if (!updatedProduct) {
			throw new NotFoundException(NOT_FOUND_ID);
		}
		return updatedProduct;
	}

	async findWithReviews(dto: FindProductDto) {
		console.log('Worked');
		return (await this.productRepository
			.aggregate([
				{
					$match: {
						categories: dto.category, // if we have even one value
					},
				},
				{
					$sort: {
						_id: 1,
					},
				},
				{
					$limit: dto.limit,
				},
				{
					$lookup: {
						from: 'Review',
						localField: '_id',
						foreignField: 'productId',
						as: 'review',
					},
				},
				{
					$addFields: {
						reviewCount: { $size: '$review' },
						reviewAvg: { $avg: '$review.rating' },
					},
				},
			])
			.exec()) as (ProductModel & {
			review: ReviewModel[];
			reviewCount: number;
			reviewAvg: number;
		})[];
	}
}