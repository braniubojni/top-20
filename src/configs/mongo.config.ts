import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = (configService: ConfigService): string => {
	return getMongoString(configService);
};

const getMongoString = (configService: ConfigService) => {
	return (
		'mongodb://' +
		configService.get('MONGO_LOGIN') +
		':' +
		configService.get('MONGO_PASSWORD') +
		'@' +
		configService.get('MONGO_HOST') +
		':' +
		configService.get('MONGO_PORT') +
		'/' +
		configService.get('MONGO_AUTHDATABASE')
	);
};

export const getMongoOptions = () => ({
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
