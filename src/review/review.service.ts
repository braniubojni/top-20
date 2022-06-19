import { HttpException, Inject, Injectable, HttpStatus } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { FEEDBACK, notFound } from './review.constants';
import { ReviewModel } from './review.model';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel(ReviewModel)
		private readonly reviewModel: ModelType<ReviewModel>,
	) {}

	async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		return await this.reviewModel.create(dto);
	}

	async delete(id: string): Promise<DocumentType<ReviewModel> | null> {
		const deletedDoc = await this.reviewModel.findByIdAndDelete(id).exec();
		if (!deletedDoc) {
			throw new HttpException(notFound(FEEDBACK, id), HttpStatus.NOT_FOUND);
		}
		return deletedDoc;
	}

	async findByProductId(
		productId: string,
	): Promise<DocumentType<ReviewModel>[]> {
		return await this.reviewModel
			.find({ productId: new Types.ObjectId(productId) })
			.exec();
	}

	async deleteByProductId(productId: string) {
		const deletedDoc = await this.getById(productId);

		return this.reviewModel
			.deleteMany({
				productId: deletedDoc._id,
			})
			.exec();
	}

	private async getById(id: string): Promise<DocumentType<ReviewModel> | null> {
		const found = await this.reviewModel.findById(id).exec();
		if (!found) {
			throw new HttpException(notFound(FEEDBACK, id), HttpStatus.NOT_FOUND);
		}
		return found;
	}
}