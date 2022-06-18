import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Post,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewModel } from './review.model';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.reviewService.delete(id);
	}

	@Get('byProduct/:productId')
	async get(@Param('productId') productId: string) {
		return this.reviewService.findByProductId(productId);
	}

	@Delete('byProduct/:productId')
	async deleteAll(@Param('productId') productId: string) {
		return this.reviewService.deleteReviewByProductId(productId)
	}
}
