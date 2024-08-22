import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/app/decorators/public.decorator';
import { ServiceTitanService } from 'src/app/services/service-titan/service-titan.service';

@ApiTags('service-titan')
@Controller('service-titan')
@Public()
export class serviceTitanController {
  constructor(private readonly serviceTitanService: ServiceTitanService) {}

@Get('inventory-bills')
  async getInventoryBills(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<any> {
    return this.serviceTitanService.getInventoryBills( page, pageSize);
  }

  @Get('invoices-payments')
  async getInvoicesPayments(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<any> {
    return this.serviceTitanService.getInvoicesPayments( page, pageSize);
  }

  @Get('payments')
  async getPayments(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<any> {
    return this.serviceTitanService.getPayments( page, pageSize);
  }

  @Get('payment-terms')
  async getPaymentTerms(
  ): Promise<any> {
    return this.serviceTitanService.getPaymentTerms();
  }

  @Get('payment-types')
  async getPaymentTypes(
  ): Promise<any> {
    return this.serviceTitanService.getPaymentTypes();
  }

  @Get('customers')
  async getCustomers(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<any> {
    return this.serviceTitanService.getCustomers( page, pageSize);
  }

  @Get('appointment-assignments')
  async getAppointmentAssignments(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<any> {
    return this.serviceTitanService.getAppointmentAssignments( page, pageSize);
  }

  @Get('technician-shifts')
  async getTechnicianShifts(
  ): Promise<any> {
    return this.serviceTitanService.getTechnicianShifts();
  }

  @Get('installed-equipment')
  async getInstalledEquipment(
  ): Promise<any> {
    return this.serviceTitanService.getInstalledEquipment();
  }

  @Get('forms')
  async getForms(
  ): Promise<any> {
    return this.serviceTitanService.getForms();
  }

  @Get('form-submissions')
  async getFormSubmissions(
  ): Promise<any> {
    return this.serviceTitanService.getFormSubmissions();
  }

  @Get('call-reasons')
  async getCallReasons(
  ): Promise<any> {
    return this.serviceTitanService.getCallReasons();
  }

  @Get('appointments-jpm')
  async getAppointmentsJPM(
  ): Promise<any> {
    return this.serviceTitanService.getAppointmentsJPM();
  }

  @Get('job-cancel-reasons')
  async getJobCancelReasons(
  ): Promise<any> {
    return this.serviceTitanService.getJobCancelReasons();
  }

  @Get('job-hold-reasons')
  async getJobHoldReasons(
  ): Promise<any> {
    return this.serviceTitanService.getJobHoldReasons();
  }

  @Get('jobs')
  async getJobs(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<any> {
    return this.serviceTitanService.getJobs( page, pageSize);
  }

  @Get('job-types')
  async getJobTypes(
  ): Promise<any> {
    return this.serviceTitanService.getJobTypes();
  }

  @Get('projects')
  async getProjects(
  ): Promise<any> {
    return this.serviceTitanService.getProjects();
  }

  @Get('project-statuses')
  async getProjectStatuses(
  ): Promise<any> {
    return this.serviceTitanService.getProjectStatuses();
  }

  @Get('memberships')
  async getMemberships(
  ): Promise<any> {
    return this.serviceTitanService.getMemberships();
  }

  @Get('membership-types')
  async getMembershipTypes(
  ): Promise<any> {
    return this.serviceTitanService.getMembershipTypes();
  }

  @Get('recurring-services')
  async getRecurringServices(
  ): Promise<any> {
    return this.serviceTitanService.getRecurringServices();
  }

  @Get('recurring-service-events')
  async getRecurringServiceEvents(
  ): Promise<any> {
    return this.serviceTitanService.getRecurringServiceEvents();
  }

  @Get('recurring-service-types')
  async getRecurringServiceTypes(
  ): Promise<any> {
    return this.serviceTitanService.getRecurringServiceTypes();
  }

  @Get('campaigns')
  async getCampaigns(
  ): Promise<any> {
    return this.serviceTitanService.getCampaigns();
  }

  @Get('categories')
  async getCategories(
  ): Promise<any> {
    return this.serviceTitanService.getCategories();
  }

  @Get('pricebook-categories')
  async getPricebookCategories(
  ): Promise<any> {
    return this.serviceTitanService.getPricebookCategories();
  }

  @Get('discounts-and-fees')
  async getDiscountsAndFees(
  ): Promise<any> {
    return this.serviceTitanService.getDiscountsAndFees();
  }

  @Get('equipment')
  async getEquipment(
  ): Promise<any> {
    return this.serviceTitanService.getEquipment();
  }

  @Get('materials')
  async getMaterials(
  ): Promise<any> {
    return this.serviceTitanService.getMaterials();
  }

  @Get('services')
  async getServices(
  ): Promise<any> {
    return this.serviceTitanService.getServices();
  }

  @Get('report-categories')
  async getReportCategories(
  ): Promise<any> {
    return this.serviceTitanService.getReportCategories();
  }

  @Get('estimates')
  async getEstimates(
  ): Promise<any> {
    return this.serviceTitanService.getEstimates();
  }

  @Get('business-units')
  async getBusinessUnits(
  ): Promise<any> {
    return this.serviceTitanService.getBusinessUnits();
  }

  @Get('employees')
  async getEmployees(
  ): Promise<any> {
    return this.serviceTitanService.getEmployees();
  }

  @Get('tag-types')
  async getTagTypes(
  ): Promise<any> {
    return this.serviceTitanService.getTagTypes();
  }

  @Get('technicians')
  async getTechnicians(
  ): Promise<any> {
    return this.serviceTitanService.getTechnicians();
  }

  @Get('user-roles')
  async getUserRoles(
  ): Promise<any> {
    return this.serviceTitanService.getUserRoles();
  }

  @Get('calls')
  async getCalls(
  ): Promise<any> {
    return this.serviceTitanService.getCalls();
  }

  @Get('task-data')
  async getTaskData(
  ): Promise<any> {
    return this.serviceTitanService.getTaskData();
  }

  @Get('tasks')
  async getTasks(
  ): Promise<any> {
    return this.serviceTitanService.getTasks();
  }
}
