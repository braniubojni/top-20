import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (
	configService: ConfigService,
): Promise<TypegooseModuleOptions> => {
	return {
		uri: getMongoString(configService),
		...getMongoOptions(),
	};
};

const getMongoString = (configService: ConfigService) => {
	return !!configService.get('MONGO_REST')
		? configService.get('MONGO_PREFIX') +
				configService.get('MONGO_LOGIN') +
				':' +
				configService.get('MONGO_PASSWORD') +
				'@' +
				configService.get('MONGO_REST')
		: 'mongodb://' +
				configService.get('MONGO_LOGIN') +
				':' +
				configService.get('MONGO_PASSWORD') +
				'@' +
				configService.get('MONGO_HOST') +
				':' +
				configService.get('MONGO_PORT') +
				'/' +
				configService.get('MONGO_AUTHDATABASE');
};

const getMongoOptions = () => ({
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
