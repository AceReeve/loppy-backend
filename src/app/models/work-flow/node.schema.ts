import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Node {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, type: Object })
  data: {
    title: string;
    onButtonClick?: string;
  };

  @Prop({ required: true, type: Object })
  position: {
    x: number;
    y: number;
  };
}

export const NodeSchema = SchemaFactory.createForClass(Node);
