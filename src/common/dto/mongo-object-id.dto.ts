import { ObjectId } from 'bson';
import { isMongoId, IsMongoId } from 'class-validator';

export class MongoObjectIdDto {
	@IsMongoId({ always: true })
	_id: string;
}
