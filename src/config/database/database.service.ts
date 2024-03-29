
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    MongooseModuleOptions,
    MongooseOptionsFactory,
} from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class DatabaseConnection implements MongooseOptionsFactory {
    private readonly logger = new Logger(DatabaseConnection.name);
    constructor(private configService: ConfigService) { }

    createMongooseOptions(): MongooseModuleOptions {
        const MONGO_HOSTNAME = this.configService.get<string>('MONGO_HOSTNAME');
        const MONGO_USERNAME = this.configService.get<string>('MONGO_USERNAME');
        const MONGO_PASSWORD = this.configService.get<string>('MONGO_PASSWORD');
        const MONGO_DB_NAME = this.configService.get<string>('MONGO_DB_NAME');
        return {
            uri: `${MONGO_HOSTNAME}://${MONGO_USERNAME}:${MONGO_PASSWORD}@servihero.7ucwppc.mongodb.net/?retryWrites=true&w=majority&appName=${MONGO_DB_NAME}`
           
        };
    }
    async onModuleInit() {
        try {
            await this.connectToDatabase();
        } catch (error) {
            this.logger.error('Error connecting to MongoDB:', error);
        }
    }
    private async connectToDatabase() {
        const option = this.createMongooseOptions().uri;
        await mongoose.connect(option);
        this.logger.log('Connected to MongoDB database...');
    }
}




