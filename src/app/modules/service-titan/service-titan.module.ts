import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; 
import { InvoiceController } from 'src/app/controller/service-titan/service-titan.controller';
import { ServiceTitanService } from 'src/app/services/service-titan/service-titan.service';

@Module({
  imports: [HttpModule],
  controllers: [InvoiceController],
  providers: [ServiceTitanService],
})
export class ServiceTitanModule {}
