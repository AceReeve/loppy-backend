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
  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get<string>('MONGODB_URL'),
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
