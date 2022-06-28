import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const loginDto: AuthDto = {
	login: 'test@ok.ru',
	password: 'test1234',
};

describe('Auth Controller (e2e)', () => {
	let app: INestApplication;
	let createdId: string;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto);
		token = body.access_token;
	});

	it('/auth/login (POST) - success', (done) => {
		request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBeDefined();
				done();
			});
	});

	it('/auth/login (POST) - fail', async () => {
		await request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, password: 'abcd1234' })
			.expect(401, {
				statusCode: 401,
				message: 'Password is incorrect!',
				error: 'Unauthorized',
			});
	});

	it('/auth/login (POST) - fail', async () => {
		await request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, login: 'abc@ok.ru' })
			.expect(404, {
				statusCode: 404,
				message: 'User was not found!',
			});
	});

	afterAll(() => {
		disconnect();
	});
});
