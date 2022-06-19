import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { disconnect, Types } from 'mongoose';
import { FEEDBACK, notFound } from '../src/review/review.constants';
import { doesNotMatch } from 'assert';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
	name: 'Test',
	title: 'Header',
	description: 'Description',
	rating: 5,
	productId,
};

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/review/create (POST) - success', (done) => {
		request(app.getHttpServer())
			.post('/review/create')
			.send(testDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
				done();
			});
	});

	it('/review/create (POST) - fail', (done) => {
		request(app.getHttpServer())
			.post('/review/create')
			.send({ ...testDto, rating: 0 })
			.expect(
				400,
				{
					statusCode: 400,
					message: ['rating must be less than 1'],
					error: 'Bad Request',
				},
				() => done(),
			);
	});

	it('/byProduct/:productId (GET) - success', async () => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + productId)
			.send(testDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1);
			});
	});

	it('/byProduct/:productId (GET) - fail', async () => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + new Types.ObjectId().toHexString())
			.send(testDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(0);
			});
	});

	it('/review/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/review/' + createdId)
			.expect(200);
	});

	it('/review/:id (DELETE) - fail', () => {
		const id = new Types.ObjectId().toHexString();
		return request(app.getHttpServer())
			.delete('/review/' + id)
			.expect(404, {
				message: notFound(FEEDBACK, id),
				statusCode: 404,
			});
	});

	afterAll(() => {
		disconnect();
	});
});
