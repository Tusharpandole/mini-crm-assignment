import axios from 'axios';
import { CustomerT } from '@assets/types/types';

type ResponseT = {
    status: "SENT" | "FAILED";
}

interface ConstraintsI {
  total_spends: Array<number | null>;
  visits: Array<number | null>;    
  last_visit: Array<Date | null>;
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export const sendMessages = async ({ id, constraints, message }: { id: string, constraints: ConstraintsI, message: string }) => {
  try {
    // Fetch the audience based on the constraints
    const audienceResponse = await axios.post(`${BASE_URL}/api/customer/audience`, { constraints });

    if (audienceResponse.status !== 200) {
      throw new Error('Failed to fetch audience');
    }
    const audience: CustomerT[] = audienceResponse.data as CustomerT[];

    for (const user of audience) {
      const response = await axios.post(`${BASE_URL}/api/dummy-vendor`, { message, user });
      const data: ResponseT = response.data as ResponseT;
      await axios.post(`${BASE_URL}/api/delivery-receipt`, { logId: id, userId: user.user_id, status: data });
    }
    
    return "Messages delivered successfully";
  } catch (error) {
    console.error('Error sending messages:', error);
    return `Failed to deliver, error: ${error}`;
  }
};
