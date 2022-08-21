import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class ProductCharacteristic {
	name: string;
	value: string;
}

export interface ProductModel extends Base {}
export class ProductModel extends TimeStamps {
	@prop()
	image: string;

	@prop()
	title: string;

	@prop()
	price: number;

	@prop()
	oldPrice?: number;

	@prop()
	credit: number;

	@prop()
	description: string;

	@prop()
	advantages: string;

	@prop()
	disAdvantages: string;
	@prop({ type: () => [String] })
	categories: string[];

	@prop({ type: () => [String], _id: false })
	tags: string[];

	characteristics: ProductCharacteristic[];
}
