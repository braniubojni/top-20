import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';
import { MongoIdValidationPipe } from '../common/pipes/mongo-id-validation.pipe';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
	constructor(
		private readonly reviewService: ReviewService,
		private readonly telegramService: TelegramService,
	) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

	@UsePipes(new ValidationPipe())
	@Post('notify')
	async notify(
		@Body() { name, title, description, rating, productId }: CreateReviewDto,
	) {
		const msg =
			`Name: ${name}\n` +
			`Title: ${title}\n` +
			`Description: ${description}\n` +
			`Rating: ${rating}\n` +
			`ID: ${productId}\n`;
		return this.telegramService.sendMessage(msg);
	}

	@Delete(':id')
	async delete(@Param('id', MongoIdValidationPipe) id: string) {
		return this.reviewService.delete(id);
	}

	@Get('byProduct/:productId')
	async get(@Param('productId', MongoIdValidationPipe) productId: string) {
		return this.reviewService.findByProductId(productId);
	}

	@Delete('byProduct/:productId')
	async deleteAll(
		@Param('productId', MongoIdValidationPipe) productId: string,
	) {
		return this.reviewService.deleteByProductId(productId);
	}
}
