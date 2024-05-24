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
    const mongodDBURL = this.configService.get<string>('MONGODB_URL');
    if (mongodDBURL) {
      return {
        uri: this.configService.get<string>('MONGODB_URL'),
      };
    } else {
      const hostname = process.env.MONGO_HOSTNAME;
      const username = process.env.MONGO_USERNAME;
      const password = process.env.MONGO_PASSWORD;
      const dbName = process.env.MONGO_DB_NAME;
      const clustername = process.env.MONGO_CLUSTER_NAME;
      return {
        uri: `${hostname}://${username}:${password}@cluster0.oh6xtoy.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=${clustername}`,
      };
    }
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
