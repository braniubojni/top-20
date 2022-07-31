import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { MongoIdValidationPipe } from '../common/pipes/mongo-id-validation.pipe';
import { CreatePageDto } from './dto/create-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageModel } from './top-page.model';
import { TopPageService } from './top-page.service';
@UsePipes(new ValidationPipe())
@Controller('top-page')
export class TopPageController {
	constructor(private readonly topPageService: TopPageService) {}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(
		@Body() dto: CreatePageDto,
	): Promise<DocumentType<TopPageModel>> {
		return await this.topPageService.createPage(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async findById(
		@Param('id', MongoIdValidationPipe) id: string,
	): Promise<DocumentType<TopPageModel>> {
		return await this.topPageService.getPageById(id);
	}

	@Get('byAlias/:alias')
	async byAlias(
		@Param('alias') alias: string,
	): Promise<DocumentType<TopPageModel>> {
		return await this.topPageService.byAlias(alias);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(
		@Param('id', MongoIdValidationPipe) id: string,
		@Body() dto: CreatePageDto,
	) {
		return await this.topPageService.updatePage(id, dto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', MongoIdValidationPipe) id: string) {
		return await this.topPageService.deletePage(id);
	}

	@HttpCode(200)
	@Post()
	async find(@Body() dto: FindTopPageDto) {
		return await this.topPageService.findByCategory(dto.firstCategory);
	}
}
