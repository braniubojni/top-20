import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect, Types } from 'mongoose';
import { TypegooseModule } from 'nestjs-typegoose';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthDto } from '../../src/auth/dto/auth.dto';
import {
	NOT_FOUND_USR,
	WRONG_PASSWORD,
} from '../../src/common/exceptions/not-found.constants';
import { getMongoConfig } from '../../src/configs/mongo.config';

const loginDto: AuthDto = {
	login: 'test' + Math.random() + '@gmail.com',
	password: 'Abcd1234$',
};

describe('AuthController (e2e)', () => {
	let app: INestApplication;
	let httpServer: HttpServer;
	let user = { _id: new Types.ObjectId(), email: '', passwordHash: '' };

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				AppModule,
				TypegooseModule.forRootAsync({
					imports: [ConfigModule],
					inject: [ConfigService],
					useFactory: getMongoConfig,
				}),
				ConfigModule.forRoot({}),
			],
			providers: [AuthModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		httpServer = app.getHttpServer();
	});

	it('/auth/registration (POST) - success', async () => {
		await request(httpServer)
			.post('/auth/registration')
			.send(loginDto)
			.expect(HttpStatus.CREATED)
			.then(({ body }: request.Response) => {
				expect(body.email).toBeDefined();
				expect(body.passwordHash).toBeDefined();
				user = Object.assign(user, body);
			});
	});

	it('/auth/login (POST) - success', async () => {
		await request(httpServer)
			.post('/auth/login')
			.send(loginDto)
			.expect(HttpStatus.OK)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBeDefined();
			});
	});

	it('/auth/login (POST) - fail', (done) => {
		request(httpServer)
			.post('/api/auth/login')
			.send({ ...loginDto, password: 'abcd1234' })
			.expect(
				HttpStatus.FORBIDDEN,
				{
					statusCode: HttpStatus.FORBIDDEN,
					message: WRONG_PASSWORD,
					error: 'Unauthorized',
				},
				() => done(),
			);
	});

	it('/auth/login (POST) - fail', (done) => {
		request(httpServer)
			.post('/auth/login')
			.send({ ...loginDto, login: 'abc@ok.ru' })
			.expect(
				404,
				{
					statusCode: HttpStatus.NOT_FOUND,
					message: NOT_FOUND_USR,
				},
				() => {
					done();
				},
			);
	});

	it('/auth/:userId (DELETE)', (done) => {
		const endpoint = `/auth/${user._id}`;
		request(httpServer)
			.delete(endpoint)
			.set('Authorization', process.env.API_KEY)
			.expect(HttpStatus.OK)
			.then(({ body }: request.Response) => {
				expect(body._id).toBeDefined();
				expect(body.email).toBeDefined();
				expect(body.passwordHash).toBeDefined();
				done();
			});
	});

	afterAll(() => {
		disconnect();
	});
});
