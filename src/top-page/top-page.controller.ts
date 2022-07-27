import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageModel } from './top-page.model';
``;
@Controller('top-page')
export class TopPageController {
	@Post('create')
	async create(@Body() dto: Omit<TopPageModel, '_id'>) {}

	@Get(':id')
	async get(@Param('id') id: Required<Types.ObjectId>) {}

	@Patch(':id')
	async patch(@Param('id') id: Required<Types.ObjectId>, dto: TopPageModel) {}

	@Delete(':id')
	async delete(@Param('id') id: Required<Types.ObjectId>) {}

	@HttpCode(200)
	@Post()
	async find(@Body() dto: FindTopPageDto) {}
}
