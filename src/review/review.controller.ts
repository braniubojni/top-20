import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

	@Delete(':id')
	async delete(@Param('id') id: Required<Types.ObjectId>) {
		return this.reviewService.delete(id);
	}

	@Get('byProduct/:productId')
	async get(@Param('productId') productId: Required<Types.ObjectId>) {
		return this.reviewService.findByProductId(productId);
	}

	@Delete('byProduct/:productId')
	async deleteAll(@Param('productId') productId: Required<Types.ObjectId>) {
		return this.reviewService.deleteByProductId(productId);
	}
}
