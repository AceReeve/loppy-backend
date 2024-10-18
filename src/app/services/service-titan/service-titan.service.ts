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
          timeout: 10000, // Adjust the timeout as needed
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

//////////
async getAllCustomers(  
  page: number = 1, 
  pageSize: number = 50, 
  startDate: string = `${new Date().getFullYear()}-01-01`, 
  endDate: string = `${new Date().getFullYear()}-12-31`): Promise<any[]> {

  const customers = [];
  let currentPage = page;
  let hasMore = true;

  // while (hasMore) {
    // Fetch customers with date filtering applied at the API level
    const customerPage = await this.fetchData(
      `crm/v2/tenant/${this.tenant}/customers`,
      { 
        page: currentPage, 
        pageSize,
        createdOnOrAfter: startDate,
        createdBefore: endDate
      }
    );

    if (customerPage.data) {
      console.log(customerPage.data)
      customers.push(...customerPage.data);
    } else {
      throw new Error('Unexpected response structure: data field not found');
    }

    // hasMore = customerPage.hasMore;
    // currentPage++;
  // }
  return customers;
}

async getCallsV1(customerId: string): Promise<any> {
  const allCalls = await this.fetchData(`telecom/v2/tenant/${this.tenant}/calls`);
  const customerCalls = allCalls.data.filter(call => call.leadCall?.customer?.id === customerId );
  return customerCalls;
}

// Fetch jobs for the customer to calculate lifetime value
async getJobsV1(customerId: string): Promise<any> {
  const jobsData = await this.fetchData(`jpm/v2/tenant/${this.tenant}/jobs`, { customerId });
  
  // Check if jobsData.data is an array
  return Array.isArray(jobsData.data) ? jobsData.data : [];
}

// Fetch campaigns for the customer
async getCampaignsV1(customerId: string): Promise<any> {
  return this.fetchData(`marketing/v2/tenant/${this.tenant}/campaigns`, { customerId });
}

// Fetch the last interaction for the customer
// this api " INTERACTIONS" is having error 404 for enhancement
async getInteractions(customerId: string): Promise<any> {
  return this.fetchData(`crm/v2/tenant/${this.tenant}/interactions`, { customerId });
}

async getAllCustomersOverview(page: number, page_size:number, start_date: string, end_date:string): Promise<any[]> {
  const customers = await this.getAllCustomers(page, page_size, start_date, end_date);
  const customersOverview = [];
  for (const customer of customers) {
    const [jobs, campaigns, interactions, calls] = await Promise.all([
      this.getJobsV1(customer.id).catch((error) => {
        return [];
      }),

      this.getCampaignsV1(customer.id).catch((error) => {
        return { data: [] };
      }),
      this.getInteractions(customer.id).catch((error) => {
        if (error.message === error.message) {
          return []; 
        } else {
          return [];
        }
      }),

      this.getCallsV1(customer.id).catch((error) => {
        return []; 
      }),
    ]);
    const lifetimeValue = jobs.length
  ? jobs.reduce((acc, job) => {
      // Check if the job has no charge
      if (!job.noCharge) {
        return acc + (job.totalAmount || 0);
      }
      return acc;
    }, 0)
  : 0;

    // Get last campaign and last interaction safely
    const lastCampaign = campaigns?.data?.length ? campaigns.data[0].name : 'None';
    const lastInteraction = interactions?.length ? interactions[0].type : 'None';

    const contactPhones = calls.map(call => 
      call.leadCall?.customer?.contacts?.find(contact => contact.type === 'MobilePhone')?.value || null
    );
    // Aggregate the data for each customer
    customersOverview.push({
      name: customer.name || 'Unknown',
      phone: contactPhones.toString(),
      source: customer.customFields?.source || 'Unknown',
      lifetimeValue,
      lastCampaign,
      lastInteraction,
      created_on: customer.createdOn
    });
  }

  return customersOverview;
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
    const startYear = new Date().getFullYear() - 1;
    const endYear = new Date().getFullYear();

    const response = await this.fetchData(`crm/v2/tenant/${this.tenant}/customers`, {
      page,
      pageSize,
    });

    const customers = response.data || [];
    
    const filteredCustomers = customers.filter((customer: any) => {
      const createdOnDate = new Date(customer.createdOn);
      return createdOnDate.getFullYear() === startYear;
    });
    console.log('data count',response.data.length)
    console.log('startYear',startYear)
    // return filteredCustomers;
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
