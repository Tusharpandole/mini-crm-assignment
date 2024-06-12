// pages/api/communications-log.js
import { connectToDB } from '@utils/database';
import CommunicationLog from '@models/communication_log';
import { NextRequest } from 'next/server';
import { sendMessages } from '@utils/sendMessages';

interface ConstraintsI {
  total_spends: [number | null, number | null];
  visits: [number | null, number | null];
  last_visit: [Date | null, Date | null];
}

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { constraints, message, audience_count } = await req.json();

    if (!message) { // For a request for past messages, ew wont send message in request
      const existingLog = await CommunicationLog.findOne({ constraints });

      if (existingLog) {
        return new Response(JSON.stringify(existingLog.messages), { status: 200 });
      }
      return new Response(JSON.stringify([]), { status: 200 });
    }

    // The rest of the code to handle creating a new communication log
    const existingLog = await CommunicationLog.findOne({ constraints });
    if (existingLog) {
      existingLog.messages.push(message);
      existingLog.audience_size = audience_count;

      await existingLog.save();

      const sentRes = await sendMessages({
        id: existingLog._id,
        constraints,
        message
      });

      return new Response(JSON.stringify({ existingLog, sentRes }), { status: 200 });
    } else {
      const newLog = new CommunicationLog({
        constraints,
        audience_size: audience_count,
        messages: [message],
      });

      const savedLog = await newLog.save();

      const sentRes = await sendMessages({
        id: savedLog._id,
        constraints,
        message
      });
      console.log(sentRes);

      return new Response(JSON.stringify({ savedLog, sentRes }), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
