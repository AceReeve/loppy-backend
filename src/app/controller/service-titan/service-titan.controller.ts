import { Controller, Get } from '@nestjs/common';
import { ServiceTitanService } from 'src/app/services/service-titan/service-titan.service';
import { Public } from '../../decorators/public.decorator';

@Controller('service-titan')
export class ServiceTitanController {
  constructor(private readonly serviceTitanService: ServiceTitanService) {}

  @Public()
  @Get('overview')
  getOverview() {
    return this.serviceTitanService.getOverview();
  }

  @Public()
  @Get('priority-customers')
  getPriorityCustomers() {
    return this.serviceTitanService.getPriorityCustomers();
  }
  @Public()
  @Get('salesman-leaderboard')
  getSalesmanLeaderboard() {
    return this.serviceTitanService.getSalesmanLeaderboard();
  }
  @Public()
  @Get('unsold-tickets')
  getUnsoldTickets() {
    return this.serviceTitanService.getUnsoldTickets();
  }
  @Public()
  @Get('lead-submissions')
  getLeadSubmissions() {
    return this.serviceTitanService.getLeadSubmissions();
  }
  @Public()
  @Get('customer-leads')
  getCustomerLeads() {
    return this.serviceTitanService.getCustomerLeads();
  }
  @Public()
  @Get('total-revenue')
  getTotalRevenue() {
    return this.serviceTitanService.getTotalRevenue();
  }

  @Public()
  @Get('token')
  async getToken() {
    const token = await this.serviceTitanService.getAuthToken();
    return { token };
  }
}

// import { Controller, Get } from '@nestjs/common';
// import { ServiceTitanService } from 'src/app/services/service-titan/service-titan.service';
// import { Public } from '../../decorators/public.decorator';

// @Controller('service-titan')
// export class ServiceTitanController {
//   constructor(private readonly serviceTitanService: ServiceTitanService) {}

//   @Public()
//   @Get('overview')
//   getOverview() {
//     return this.serviceTitanService.getOverview();
//   }

//   @Public()
//   @Get('priority-customers')
//   getPriorityCustomers() {
//     return this.serviceTitanService.getPriorityCustomers();
//   }

//   @Public()
//   @Get('salesman-leaderboard')
//   getSalesmanLeaderboard() {
//     return this.serviceTitanService.getSalesmanLeaderboard();
//   }

//   @Public()
//   @Get('unsold-tickets')
//   getUnsoldTickets() {
//     return this.serviceTitanService.getUnsoldTickets();
//   }

//   @Public()
//   @Get('lead-submissions')
//   getLeadSubmissions() {
//     return this.serviceTitanService.getLeadSubmissions();
//   }

//   @Public()
//   @Get('customer-leads')
//   getCustomerLeads() {
//     return this.serviceTitanService.getCustomerLeads();
//   }

//   @Public()
//   @Get('total-revenue')
//   getTotalRevenue() {
//     return this.serviceTitanService.getTotalRevenue();
//   }
// }
