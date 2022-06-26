import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';
import * as request from 'supertest';
import { compareSync } from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { WRONG_PASSWORD } from 'src/common/exceptions/not-found.constants';

describe('AuthService', () => {
	let service: AuthService;
	let loginDto: AuthDto = {
		login: 'test@ok.ru',
		password: 'test1234',
	};
	interface IReturnValue {
		email: string;
		passwordHash: string;
	}

	const exec = { exec: jest.fn() };
	const returnValue = {
		email: 'test@ok.ru',
		passwordHash:
			'$2a$10$Pa7ls5kJHuYOhzHIvFx2ZO4mpUtxE1gM2Vh.mWUK6vgTbJ/BIDkKO',
	};
	const userRepositoryFactory = () => ({
		find: () => exec,
		findOne: (email: string) => returnValue,
	});
	const privateFunctions = {
		getOneUser: function (email: string): IReturnValue {
			return userRepositoryFactory().findOne(email);
		},
		validateUser: function ({ login, password }: AuthDto) {
			const user = this.getOneUser(login);
			const isCorrectPassword = compareSync(password, user.passwordHash);
			if (!isCorrectPassword) {
				throw new UnauthorizedException(WRONG_PASSWORD);
			}
			return {
				email: user.email,
			};
		},
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [UserModel, JwtService],
			providers: [
				JwtService,
				AuthService,
				{
					useFactory: userRepositoryFactory,
					provide: getModelToken('UserModel'),
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it('Service should be defined', () => {
		expect(service).toBeDefined();
	});

	it('Login user - success', () => {
		return privateFunctions.validateUser(loginDto);
	});

	// it('Login user - fail', async () => {
	// 	const id = new Types.ObjectId();
	// 	userRepositoryFactory()
	// 		.find()
	// 		.exec.mockReturnValueOnce([{ productId: id }]);
	// 	const res = await service.findByProductId(id as unknown as string);
	// 	expect(res[0].productId).toBe(id);
	// });
});
