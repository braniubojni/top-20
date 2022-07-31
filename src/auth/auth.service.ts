import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';
import { compare, genSalt, hash } from 'bcryptjs';
import {
	NOT_FOUND_USR,
	USR_ALREADY_EXIST,
	WRONG_PASSWORD,
} from '../common/exceptions/not-found.constants';
import { JwtService } from '@nestjs/jwt';
import { ILoginUser } from './auth.interface';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
	) {}

	async createUser(dto: AuthDto): Promise<DocumentType<UserModel>> {
		const existUsr = await this.userModel.findOne({ email: dto.login }).exec();
		if (existUsr) {
			throw new BadRequestException(USR_ALREADY_EXIST);
		}
		const salt = await genSalt(10);
		const newUser = new this.userModel({
			email: dto.login,
			passwordHash: await hash(dto.password, salt),
		});
		return newUser.save();
	}

	async loginUser({ login, password }: AuthDto): Promise<ILoginUser> {
		const { email } = await this.validateUser(login, password);
		return {
			access_token: await this.jwtService.signAsync(email),
		};
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

	private async validateUser(
		email: string,
		password: string,
	): Promise<Pick<UserModel, 'email'>> {
		/** Validating email */
		const user = await this.getOneUser(email);
		const isCorrectPass = await compare(password, user.passwordHash);
		if (!isCorrectPass) {
			/** Validating password */
			throw new UnauthorizedException(WRONG_PASSWORD);
		}
		return {
			email: user.email,
		};
	}
}
