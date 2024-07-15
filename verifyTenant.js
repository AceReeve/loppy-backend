import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const applicationKey = process.env.APPLICATION_KEY;

// Function to get access token
async function getAccessToken() {
  const response = await axios.post('https://api.servicetitan.io/oauth/token', {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  });
  return response.data.access_token;
}

// Function to pull data from ServiceTitan
async function verifyTenant() {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      'https://api.servicetitan.io/v1/some-endpoint',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Application-Key': applicationKey,
        },
      },
    );

    console.log(response.data);
  } catch (error) {
    console.error(
      'Error fetching data from ServiceTitan:',
      error.response ? error.response.data : error.message,
    );
  }
}

verifyTenant();
