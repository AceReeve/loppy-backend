import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

dotenv.config();

@Injectable()
export class ServiceTitanService {
  private readonly baseUrl: string = `https://${process.env.TENANT}.api.servicetitan.io`;
  constructor(private readonly httpService: HttpService) {}
  private readonly authUrl =
    'https://auth-integration.servicetitan.io/connect/token';

  private async getAccessToken(): Promise<string> {
    console.log('TENANT1', process.env.TENANT);

    const response = await axios.post(`${this.baseUrl}/oauth/token`, {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: 'offline_access',
    });

    console.log('TENANT', process.env.TENANT);
    console.log('CLIENT_ID', process.env.CLIENT_ID);
    console.log('CLIENT_SECRET', process.env.CLIENT_SECRET);
    return response.data.access_token;
  }

  private async fetchFromServiceTitan(endpoint: string): Promise<any> {
    console.log('APPLICATION_KEY', process.env.APPLICATION_KEY);
    const accessToken = await this.getAccessToken();
    console.log('accessToken', accessToken);

    const response = await axios.get(`${this.baseUrl}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Application-Key': process.env.APPLICATION_KEY,
      },
    });
    console.log('APPLICATION_KEY', process.env.APPLICATION_KEY);

    return response.data;
  }

  public async getOverview(): Promise<any> {
    const endpoint = '/v1/overview';
    return this.fetchFromServiceTitan(endpoint);
  }

  public async getPriorityCustomers(): Promise<any> {
    const endpoint = '/v1/customers?priority=true';
    return this.fetchFromServiceTitan(endpoint);
  }

  public async getSalesmanLeaderboard(): Promise<any> {
    const endpoint = '/v1/sales/leaderboard';
    return this.fetchFromServiceTitan(endpoint);
  }

  public async getUnsoldTickets(): Promise<any> {
    const endpoint = '/v1/tickets/unsold';
    return this.fetchFromServiceTitan(endpoint);
  }

  public async getLeadSubmissions(): Promise<any> {
    const endpoint = '/v1/leads/submissions';
    return this.fetchFromServiceTitan(endpoint);
  }

  public async getCustomerLeads(): Promise<any> {
    const endpoint = '/v1/customers/leads';
    return this.fetchFromServiceTitan(endpoint);
  }

  public async getTotalRevenue(): Promise<any> {
    const endpoint = '/v1/revenue/total';
    return this.fetchFromServiceTitan(endpoint);
  }

  async getAuthToken(): Promise<string> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    // Log the URL and headers for debugging
    console.log('Request URL:', this.authUrl);
    console.log('Request Headers:', headers);
    console.log('Client ID:', process.env.CLIENT_ID);
    console.log('Client Secret:', process.env.CLIENT_SECRET);

    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    });

    // Log the body for debugging
    console.log('Request Body:', body.toString());

    try {
      const response = await lastValueFrom(
        this.httpService.post(this.authUrl, body.toString(), { headers }),
      );

      // Log the response for debugging
      console.log('Response:', response.data);

      return response.data.access_token;
    } catch (error) {
      // Log the error for debugging
      console.error('Error:', error.response?.data || error.message);

      throw new Error('Failed to fetch auth token');
    }
  }
}

// import { Injectable } from '@nestjs/common';
// import axios from 'axios';
// import * as dotenv from 'dotenv';

// dotenv.config();

// @Injectable()
// export class ServiceTitanService {
//   // Use a generic base URL for non-tenant-specific endpoints
//   private readonly baseUrl: string = `https://api.servicetitan.io`;

//   private async getAccessToken(): Promise<string> {
//     console.log('1');

//     const response = await axios.post(`${this.baseUrl}/oauth/token`, {
//       client_id: process.env.CLIENT_ID,
//       client_secret: process.env.CLIENT_SECRET,
//       grant_type: 'client_credentials',
//       scope: 'offline_access',
//     });

//     console.log('CLIENT_ID', process.env.CLIENT_ID);
//     console.log('CLIENT_SECRET', process.env.CLIENT_SECRET);
//     return response.data.access_token;
//   }

//   private async fetchFromServiceTitan(
//     endpoint: string,
//     useTenant: boolean = true,
//   ): Promise<any> {
//     const accessToken = await this.getAccessToken();
//     const baseUrl = useTenant
//       ? `https://${process.env.TENANT}.api.servicetitan.io`
//       : this.baseUrl;

//     const response = await axios.get(`${baseUrl}${endpoint}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Application-Key': process.env.APPLICATION_KEY,
//       },
//     });
//     console.log('APPLICATION_KEY', process.env.APPLICATION_KEY);

//     return response.data;
//   }

//   // Example of a method without tenant identifier
//   public async getOverview(): Promise<any> {
//     const endpoint = '/v1/overview';
//     return this.fetchFromServiceTitan(endpoint, false);
//   }

//   public async getPriorityCustomers(): Promise<any> {
//     const endpoint = '/v1/customers?priority=true';
//     return this.fetchFromServiceTitan(endpoint);
//   }

//   public async getSalesmanLeaderboard(): Promise<any> {
//     const endpoint = '/v1/sales/leaderboard';
//     return this.fetchFromServiceTitan(endpoint);
//   }

//   public async getUnsoldTickets(): Promise<any> {
//     const endpoint = '/v1/tickets/unsold';
//     return this.fetchFromServiceTitan(endpoint);
//   }

//   public async getLeadSubmissions(): Promise<any> {
//     const endpoint = '/v1/leads/submissions';
//     return this.fetchFromServiceTitan(endpoint);
//   }

//   public async getCustomerLeads(): Promise<any> {
//     const endpoint = '/v1/customers/leads';
//     return this.fetchFromServiceTitan(endpoint);
//   }

//   public async getTotalRevenue(): Promise<any> {
//     const endpoint = '/v1/revenue/total';
//     return this.fetchFromServiceTitan(endpoint);
//   }
// }
