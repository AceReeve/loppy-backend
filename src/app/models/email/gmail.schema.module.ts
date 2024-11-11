import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerReplied, CustomerRepliedSchema } from './gmail.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CustomerReplied.name, schema: CustomerRepliedSchema }])],
  exports: [MongooseModule],
})
export class CustomerRepliedSchemaModule {}
