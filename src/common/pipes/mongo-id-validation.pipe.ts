import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ID_VALIDATION_ERR } from './validation.constants';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
	transform(value: string, metadata: ArgumentMetadata) {
		if (metadata.type !== 'param') {
			return value;
		}
		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException(ID_VALIDATION_ERR);
		}
		return value;
	}
}
