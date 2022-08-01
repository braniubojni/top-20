import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { getModelToken } from 'nestjs-typegoose';
import { ProductService } from './product.service';

describe('ProductService', () => {
	let service: ProductService;

	const exec = { exec: jest.fn() };
	const productRepositoryFactory = () => ({
		findById: () => exec,
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProductService,
				{
					useFactory: productRepositoryFactory,
					provide: getModelToken('ProductModel'),
				},
			],
		}).compile();

		service = module.get<ProductService>(ProductService);
	});

	it('findById - success', async () => {
		const id = new Types.ObjectId();
		productRepositoryFactory()
			.findById()
			.exec.mockReturnValueOnce([{ productId: id }]);
		const res = await service.findByProdId(id as unknown as string);
		expect(res[0].productId).toBe(id);
	});

	it('findById - fail', async () => {
		const id = new Types.ObjectId();
		const fake = new Types.ObjectId();
		productRepositoryFactory()
			.findById()
			.exec.mockReturnValueOnce([{ productId: id }]);
		await service.findByProdId(fake as unknown as string);
		expect(404);
	});
});
