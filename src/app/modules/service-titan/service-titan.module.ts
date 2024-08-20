import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; 
import { serviceTitanController } from 'src/app/controller/service-titan/service-titan.controller';
import { ServiceTitanService } from 'src/app/services/service-titan/service-titan.service';

@Module({
  imports: [HttpModule],
  controllers: [serviceTitanController],
  providers: [ServiceTitanService],
})
export class ServiceTitanModule {}
