import {
	ArgumentMetadata,
	ForbiddenException,
	Injectable,
	PipeTransform,
} from '@nestjs/common';
import { AuthDto } from '../dto/auth.dto';
import { passwordValidation } from './auth.validation';

@Injectable()
export class PasswordValidationPipe implements PipeTransform {
	transform(value: AuthDto, metadata: ArgumentMetadata) {
		if (!passwordValidation(value.password)) {
			throw new ForbiddenException();
		}
		return value;
	}
}
