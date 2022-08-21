import {
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FilesService } from './files.service';
import { MFile } from './mfile.class';
import { FileElementResponse } from './response/file-element.response';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('upload')
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('files'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
	): Promise<FileElementResponse[]> {
		const saveArray = [new MFile(file)];
		if (file.mimetype.includes('image')) {
			const buffer = await this.filesService.convertToWebP(file.buffer);
			// FIXME: This part looks ugly, make it dynamic not only for webp
			saveArray.push(
				new MFile({
					originalname: `${file.originalname.split('.')[0]}.webp`,
					buffer,
				}),
			);
		}
		return this.filesService.saveFiles(saveArray);
	}
}
