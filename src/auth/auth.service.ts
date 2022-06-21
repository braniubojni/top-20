import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';
import { genSaltSync, hashSync } from 'bcryptjs';
import {
	NOT_FOUND_USR,
	USR_ALREADY_EXIST,
} from '../common/exceptions/not-found.constants';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
	) {}

	async createUser(dto: AuthDto): Promise<DocumentType<UserModel>> {
		const existUsr = await this.userModel.findOne({ email: dto.login }).exec();
		if (existUsr) {
			throw new BadRequestException(USR_ALREADY_EXIST);
		}
		const salt = genSaltSync(10);
		const newUser = new this.userModel({
			email: dto.login,
			passwordHash: hashSync(dto.password, salt),
		});
		return newUser.save();
	}

	async findUser(email: string) {
		const user = await this.getOneUser(email);
		return user;
	}

	private async getOneUser(
		email: string,
	): Promise<DocumentType<UserModel> | null> {
		const founded = await this.userModel.findOne({ email }).exec();
		if (!founded) {
			throw new HttpException(NOT_FOUND_USR, HttpStatus.NOT_FOUND);
		}
		return founded;
	}
}
