import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { MongoIdValidationPipe as string } from 'src/common/pipes/mongo-id-validation.pipe';
import { CreatePageDto } from './dto/create-page.dto';
import { NOT_FOUND_BY_ALIAS, NOT_FOUND_PAGE } from './top-page.constants';
import { TopLevelCategory, TopPageModel } from './top-page.model';

@Injectable()
export class TopPageService {
	constructor(
		@InjectModel(TopPageModel)
		private readonly topPageModel: ModelType<TopPageModel>,
	) {}

	private NotFoundPage(msg: string) {
		throw new NotFoundException(msg);
	}

	async createPage(
		createPageDto: CreatePageDto,
	): Promise<DocumentType<TopPageModel>> {
		const page = await this.topPageModel.create(createPageDto);
		return page;
	}

	async getPageById(id: string): Promise<DocumentType<TopPageModel>> {
		const page = await this.topPageModel.findById(id).exec();
		if (!page) {
			this.NotFoundPage(NOT_FOUND_PAGE);
		}
		return page;
	}

	async byAlias(alias: string) {
		const page = await this.topPageModel.findOne({ alias });
		if (!page) {
			this.NotFoundPage(NOT_FOUND_BY_ALIAS);
		}
		return page;
	}

	async updatePage(
		id: string,
		dto: CreatePageDto,
	): Promise<DocumentType<TopPageModel>> {
		const page = await this.topPageModel
			.findByIdAndUpdate(id, dto, { new: true })
			.exec();
		if (!page) {
			this.NotFoundPage(NOT_FOUND_PAGE);
		}
		return page;
	}

	async deletePage(id: string): Promise<DocumentType<TopPageModel>> {
		const page = await this.topPageModel.findByIdAndRemove(id).exec();
		if (!page) {
			this.NotFoundPage(NOT_FOUND_PAGE);
		}
		return page;
	}

	async findByCategory(firstLevelCategory: TopLevelCategory) {
		const topPage = await this.topPageModel
			.find({ firstLevelCategory }, { alias: 1, secondCategory: 1, title: 1 })
			.exec();
		return topPage;
	}
}
