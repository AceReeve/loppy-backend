import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ServiceTitanService {
  private readonly tokenUrl = 'https://auth.servicetitan.io/connect/token';
  private readonly clientId = 'cid.1fw0fulndbc2wdvdy2o7zueof';
  private readonly clientSecret = 'cs1.kplsyupeyqdmhp05f2la86aw82h5xo9jpn4bne7z6s686527kr';
  private token: string;
  private readonly apiUrl = 'https://api.servicetitan.io/';
  private readonly appKey = 'ak1.5y547w55zqerjtwixu6od03et'; 
  private readonly tenant = '1885706780';
  constructor(private readonly httpService: HttpService) {}

  private async getToken(): Promise<string> {
    if (this.token) {
      return this.token;
    }

    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(this.tokenUrl, new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }).toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      this.token = response.data.access_token;
      return this.token;
    } catch (error) {
      throw new Error('Could not retrieve token');
    }
  }

  private async fetchData(endpoint: string, params?: any): Promise<any> {
    const token = await this.getToken();
    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ST-App-Key': this.appKey,
          },
          params,
        }),
      );
      return response.data;
    } catch (error) {
      throw new Error('Could not retrieve data');
    }
  }

  getInventoryBills(page: number, pageSize: number): Promise<any> {
    return this.fetchData(`accounting/v2/tenant/${this.tenant}/inventory-bills`, { page, pageSize });
  }

  getInvoicesPayments(page: number, pageSize: number): Promise<any> {
    return this.fetchData(`accounting/v2/tenant/${this.tenant}/invoices`, { page, pageSize });
  }

  getPayments(page: number, pageSize: number): Promise<any> {
    return this.fetchData(`accounting/v2/tenant/${this.tenant}/payments`, { page, pageSize });
  }

  getPaymentTerms(): Promise<any> {
    return this.fetchData(`accounting/v2/tenant/${this.tenant}/payment-terms`);
  }

  getPaymentTypes(): Promise<any> {
    return this.fetchData(`accounting/v2/tenant/${this.tenant}/payment-types`);
  }

  getCustomers(page: number, pageSize: number): Promise<any> {
    return this.fetchData(`crm/v2/tenant/${this.tenant}/customers`, { page, pageSize });
  }

  getAppointmentAssignments(page: number, pageSize: number): Promise<any> {
    return this.fetchData(`dispatch/v2/tenant/${this.tenant}/appointment-assignments`, { page, pageSize });
  }

  getTechnicianShifts(): Promise<any> {
    return this.fetchData(`dispatch/v2/tenant/${this.tenant}/technician-shifts`);
  }

  getInstalledEquipment(): Promise<any> {
    return this.fetchData(`equipmentsystems/v2/tenant/${this.tenant}/installed-equipment`);
  }

  getForms(): Promise<any> {
    return this.fetchData(`forms/v2/tenant/${this.tenant}/forms`);
  }

  getFormSubmissions(): Promise<any> {
    return this.fetchData(`forms/v2/tenant/${this.tenant}/submissions`);
  }

  getCallReasons(): Promise<any> {
    return this.fetchData(`jbce/v2/tenant/${this.tenant}/call-reasons`);
  }

  getAppointmentsJPM(): Promise<any> {
    return this.fetchData(`jpm/v2/tenant/${this.tenant}/appointments`);
  }

  getJobCancelReasons(): Promise<any> {
    return this.fetchData(`jpm/v2/tenant/${this.tenant}/job-cancel-reasons`);
  }

  getJobHoldReasons(): Promise<any> {
    return this.fetchData(`jpm/v2/tenant/${this.tenant}/job-hold-reasons`);
  }

  getJobs(page: number, pageSize: number): Promise<any> {
    return this.fetchData(`jpm/v2/tenant/${this.tenant}/jobs`, { page, pageSize });
  }

  getJobTypes(): Promise<any> {
    return this.fetchData(`jpm/v2/tenant/${this.tenant}/job-types`);
  }

  getProjects(): Promise<any> {
    return this.fetchData(`jpm/v2/tenant/${this.tenant}/projects`);
  }

  getProjectStatuses(): Promise<any> {
    return this.fetchData(`jpm/v2/tenant/${this.tenant}/project-statuses`);
  }

  getMemberships(): Promise<any> {
    return this.fetchData(`memberships/v2/tenant/${this.tenant}/memberships`);
  }

  getMembershipTypes(): Promise<any> {
    return this.fetchData(`memberships/v2/tenant/${this.tenant}/membership-types`);
  }

  getRecurringServices(): Promise<any> {
    return this.fetchData(`memberships/v2/tenant/${this.tenant}/recurring-services`);
  }

  getRecurringServiceEvents(): Promise<any> {
    return this.fetchData(`memberships/v2/tenant/${this.tenant}/recurring-service-events`);
  }

  getRecurringServiceTypes(): Promise<any> {
    return this.fetchData(`memberships/v2/tenant/${this.tenant}/recurring-service-types`);
  }

  getCampaigns(): Promise<any> {
    return this.fetchData(`marketing/v2/tenant/${this.tenant}/campaigns`);
  }

  getCategories(): Promise<any> {
    return this.fetchData(`marketing/v2/tenant/${this.tenant}/categories`);
  }

  getPricebookCategories(): Promise<any> {
    return this.fetchData(`pricebook/v2/tenant/${this.tenant}/categories`);
  }

  getDiscountsAndFees(): Promise<any> {
    return this.fetchData(`pricebook/v2/tenant/${this.tenant}/discounts-and-fees`);
  }

  getEquipment(): Promise<any> {
    return this.fetchData(`pricebook/v2/tenant/${this.tenant}/equipment`);
  }

  getMaterials(): Promise<any> {
    return this.fetchData(`pricebook/v2/tenant/${this.tenant}/materials`);
  }

  getServices(): Promise<any> {
    return this.fetchData(`pricebook/v2/tenant/${this.tenant}/services`);
  }

  getReportCategories(): Promise<any> {
    return this.fetchData(`reporting/v2/tenant/${this.tenant}/report-categories`);
  }

  getEstimates(): Promise<any> {
    return this.fetchData(`sales/v2/tenant/${this.tenant}/estimates`);
  }

  getBusinessUnits(): Promise<any> {
    return this.fetchData(`settings/v2/tenant/${this.tenant}/business-units`);
  }

  getEmployees(): Promise<any> {
    return this.fetchData(`settings/v2/tenant/${this.tenant}/employees`);
  }

  getTagTypes(): Promise<any> {
    return this.fetchData(`settings/v2/tenant/${this.tenant}/tag-types`);
  }

  getTechnicians(): Promise<any> {
    return this.fetchData(`settings/v2/tenant/${this.tenant}/technicians`);
  }

  getUserRoles(): Promise<any> {
    return this.fetchData(`settings/v2/tenant/${this.tenant}/user-roles`);
  }

  getCalls(): Promise<any> {
    return this.fetchData(`telecom/v2/tenant/${this.tenant}/calls`);
  }

  getTaskData(): Promise<any> {
    return this.fetchData(`taskmanagement/v2/tenant/${this.tenant}/data`);
  }

  getTasks(): Promise<any> {
    return this.fetchData(`taskmanagement/v2/tenant/${this.tenant}/tasks`);
  }
}
