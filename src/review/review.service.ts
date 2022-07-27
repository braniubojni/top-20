import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { NOT_FOUND_ID } from '../common/exceptions/not-found.constants';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewModel } from './review.model';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel(ReviewModel)
		private readonly reviewModel: ModelType<ReviewModel>,
	) {}

	async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		const review = await this.reviewModel.create(dto);
		return review;
	}

	async delete(
		id: Required<Types.ObjectId>,
	): Promise<DocumentType<ReviewModel> | null> {
		const deletedDoc = await this.reviewModel.findByIdAndDelete(id).exec();
		if (!deletedDoc) {
			throw new HttpException(NOT_FOUND_ID, HttpStatus.NOT_FOUND);
		}
		return deletedDoc;
	}

	async findByProductId(
		productId: Required<Types.ObjectId>,
	): Promise<DocumentType<ReviewModel>[]> {
		return await this.reviewModel
			.find({ productId: new Types.ObjectId(productId) })
			.exec();
	}

	async deleteByProductId(productId: Required<Types.ObjectId>) {
		const deletedDoc = await this.getById(productId);

		return this.reviewModel
			.deleteMany({
				productId: deletedDoc._id,
			})
			.exec();
	}

	private async getById(
		id: Required<Types.ObjectId>,
	): Promise<DocumentType<ReviewModel> | null> {
		const found = await this.reviewModel.findById(id).exec();
		if (!found) {
			throw new HttpException(NOT_FOUND_ID, HttpStatus.NOT_FOUND);
		}
		return found;
	}
}
