import { Module } from '@nestjs/common';
import { ServiceTitanController } from 'src/app/controller/service-titan/service-titan.controller';
import { ServiceTitanService } from 'src/app/services/service-titan/service-titan.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [ServiceTitanController],
  providers: [ServiceTitanService],
})
export class ServiceTitanModule {}
