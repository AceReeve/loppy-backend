import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ServiceTitanService {
  private readonly tokenUrl = 'https://auth.servicetitan.io/connect/token';
  private readonly clientId = 'cid.1fw0fulndbc2wdvdy2o7zueof';
  private readonly clientSecret =
    'cs1.kplsyupeyqdmhp05f2la86aw82h5xo9jpn4bne7z6s686527kr';
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
        this.httpService.post(
          this.tokenUrl,
          new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: this.clientId,
            client_secret: this.clientSecret,
          }).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      this.token = response.data.access_token;
      return this.token;
    } catch (error) {
      throw new Error('Could not retrieve token');
    }
  }

  private async fetchData(
    endpoint: string,
    params?: any,
    retries: number = 3,
  ): Promise<any> {
    const token = await this.getToken();
    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ST-App-Key': this.appKey,
          },
          params: {
            ...params,
            sort: 'modifiedOn',
            order: 'desc',
          },
          // Add a timeout to handle cases where requests are hanging
          timeout: 5000, // Adjust the timeout as needed
        }),
      );
      return response.data;
    } catch (error) {
      if (retries > 0) {
        await new Promise((res) =>
          setTimeout(res, Math.pow(2, 3 - retries) * 1000),
        );
        return this.fetchData(endpoint, params, retries - 1);
      }
      throw new Error('Could not retrieve data: ' + error.message);
    }
  }

  getInventoryBills(page: number, pageSize: number): Promise<any> {
    return this.fetchData(
      `accounting/v2/tenant/${this.tenant}/inventory-bills`,
      { page, pageSize },
    );
  }

  async getInvoicesPayments(page: number, pageSize: number): Promise<any> {
    return this.fetchData(`accounting/v2/tenant/${this.tenant}/invoices`, {
      page,
      pageSize,
    });
  }

  async getPayments(page: number, pageSize: number): Promise<any> {
    return this.fetchData(`accounting/v2/tenant/${this.tenant}/payments`, {
      page,
      pageSize,
    });
  }

  async getPaymentTerms(): Promise<any> {
    return this.fetchData(`accounting/v2/tenant/${this.tenant}/payment-terms`);
  }

  async getPaymentTypes(): Promise<any> {
    return this.fetchData(`accounting/v2/tenant/${this.tenant}/payment-types`);
  }

  async getCustomers(page: number, pageSize: number): Promise<any> {
    return this.fetchData(`crm/v2/tenant/${this.tenant}/customers`, {
      page,
      pageSize,
    });
  }

  async getAppointmentAssignments(
    page: number,
    pageSize: number,
  ): Promise<any> {
    return this.fetchData(
      `dispatch/v2/tenant/${this.tenant}/appointment-assignments`,
      { page, pageSize },
    );
  }

  async getTechnicianShifts(): Promise<any> {
    return this.fetchData(
      `dispatch/v2/tenant/${this.tenant}/technician-shifts`,
    );
  }

  async getInstalledEquipment(): Promise<any> {
    return this.fetchData(
      `equipmentsystems/v2/tenant/${this.tenant}/installed-equipment`,
    );
  }

  async getForms(): Promise<any> {
    return this.fetchData(`forms/v2/tenant/${this.tenant}/forms`);
  }

  async getFormSubmissions(): Promise<any> {
    return this.fetchData(`forms/v2/tenant/${this.tenant}/submissions`);
  }

  async getCallReasons(): Promise<any> {
    return this.fetchData(`jbce/v2/tenant/${this.tenant}/call-reasons`);
  }

  async getAppointmentsJPM(): Promise<any> {
    return this.fetchData(`jpm/v2/tenant/${this.tenant}/appointments`);
  }

  async getJobCancelReasons(): Promise<any> {
    return this.fetchData(`jpm/v2/tenant/${this.tenant}/job-cancel-reasons`);
  }

  async getJobHoldReasons(): Promise<any> {
    return this.fetchData(`jpm/v2/tenant/${this.tenant}/job-hold-reasons`);
  }

  async getJobs(page: number, pageSize: number): Promise<any> {
    return this.fetchData(`jpm/v2/tenant/${this.tenant}/jobs`, {
      page,
      pageSize,
    });
  }

  async getJobTypes(): Promise<any> {
    return this.fetchData(`jpm/v2/tenant/${this.tenant}/job-types`);
  }

  async getProjects(): Promise<any> {
    return this.fetchData(`jpm/v2/tenant/${this.tenant}/projects`);
  }

  async getProjectStatuses(): Promise<any> {
    return this.fetchData(`jpm/v2/tenant/${this.tenant}/project-statuses`);
  }

  async getMemberships(): Promise<any> {
    return this.fetchData(`memberships/v2/tenant/${this.tenant}/memberships`);
  }

  async getMembershipTypes(): Promise<any> {
    return this.fetchData(
      `memberships/v2/tenant/${this.tenant}/membership-types`,
    );
  }

  async getRecurringServices(): Promise<any> {
    return this.fetchData(
      `memberships/v2/tenant/${this.tenant}/recurring-services`,
    );
  }

  async getRecurringServiceEvents(): Promise<any> {
    return this.fetchData(
      `memberships/v2/tenant/${this.tenant}/recurring-service-events`,
    );
  }

  async getRecurringServiceTypes(): Promise<any> {
    return this.fetchData(
      `memberships/v2/tenant/${this.tenant}/recurring-service-types`,
    );
  }

  async getCampaigns(): Promise<any> {
    return this.fetchData(`marketing/v2/tenant/${this.tenant}/campaigns`);
  }

  async getCategories(): Promise<any> {
    return this.fetchData(`marketing/v2/tenant/${this.tenant}/categories`);
  }

  async getPricebookCategories(): Promise<any> {
    return this.fetchData(`pricebook/v2/tenant/${this.tenant}/categories`);
  }

  async getDiscountsAndFees(): Promise<any> {
    return this.fetchData(
      `pricebook/v2/tenant/${this.tenant}/discounts-and-fees`,
    );
  }

  async getEquipment(): Promise<any> {
    return this.fetchData(`pricebook/v2/tenant/${this.tenant}/equipment`);
  }

  async getMaterials(): Promise<any> {
    return this.fetchData(`pricebook/v2/tenant/${this.tenant}/materials`);
  }

  async getServices(): Promise<any> {
    return this.fetchData(`pricebook/v2/tenant/${this.tenant}/services`);
  }

  async getReportCategories(): Promise<any> {
    return this.fetchData(
      `reporting/v2/tenant/${this.tenant}/report-categories`,
    );
  }

  async getEstimates(): Promise<any> {
    return this.fetchData(`sales/v2/tenant/${this.tenant}/estimates`);
  }

  async getBusinessUnits(): Promise<any> {
    return this.fetchData(`settings/v2/tenant/${this.tenant}/business-units`);
  }

  async getEmployees(): Promise<any> {
    return this.fetchData(`settings/v2/tenant/${this.tenant}/employees`);
  }

  async getTagTypes(): Promise<any> {
    return this.fetchData(`settings/v2/tenant/${this.tenant}/tag-types`);
  }

  async getTechnicians(): Promise<any> {
    return this.fetchData(`settings/v2/tenant/${this.tenant}/technicians`);
  }

  async getUserRoles(): Promise<any> {
    return this.fetchData(`settings/v2/tenant/${this.tenant}/user-roles`);
  }

  async getCalls(): Promise<any> {
    return this.fetchData(`telecom/v2/tenant/${this.tenant}/calls`);
  }

  async getTaskData(): Promise<any> {
    return this.fetchData(`taskmanagement/v2/tenant/${this.tenant}/data`);
  }

  async getTasks(): Promise<any> {
    return this.fetchData(`taskmanagement/v2/tenant/${this.tenant}/tasks`);
  }
}
