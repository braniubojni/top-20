import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export enum TopLevelCategory {
	Courses,
	Services,
	Books,
	Products,
}

export class HhData {
	@prop()
	count: number;
	@prop()
	juniorSalary: number;
	@prop()
	middleSalary: number;
	@prop()
	seniorSalary: number;
}

export class TopPageAdvantages {
	@prop()
	title: string;

	@prop()
	description: string;
}

export interface TopPageModel extends Base {}
export class TopPageModel extends TimeStamps {
	@prop({ enum: TopLevelCategory })
	firstLevelCategory: TopLevelCategory;

	@prop()
	secondCategory: string;

	@prop()
	title: string;

	@prop({ unique: true })
	alias: string;

	@prop()
	categories: string;

	@prop({ type: () => HhData })
	hh?: HhData;

	@prop({ type: () => [TopPageAdvantages] })
	advantages: TopPageAdvantages[];

	@prop()
	seoText: string;

	@prop()
	tagsTitle: string;

	@prop({ type: () => [String] })
	tags: string[];
}
