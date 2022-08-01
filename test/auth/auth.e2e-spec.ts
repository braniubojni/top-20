import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect } from 'mongoose';
import { AuthDto } from '../../src/auth/dto/auth.dto';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AuthModule } from '../../src/auth/auth.module';

const loginDto: AuthDto = {
	login: 'test@gmail.com',
	password: 'Abcd1234$',
};

describe('AuthController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			providers: [AuthModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/login (POST) - success', async () => {
		await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBeDefined();
			});
	});

	it('/auth/login (POST) - fail', (done) => {
		request(app.getHttpServer())
			.post('/api/auth/login')
			.send({ ...loginDto, password: 'abcd1234' })
			.expect(
				401,
				{
					statusCode: 401,
					message: 'Password is incorrect!',
					error: 'Unauthorized',
				},
				() => done(),
			);
	});

	it('/auth/login (POST) - fail', (done) => {
		request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, login: 'abc@ok.ru' })
			.expect(
				404,
				{
					statusCode: 404,
					message: 'User was not found!',
				},
				() => {
					done();
				},
			);
	});

	afterAll(() => {
		disconnect();
	});
});
