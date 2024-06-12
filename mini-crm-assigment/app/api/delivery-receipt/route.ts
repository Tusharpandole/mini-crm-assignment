import { connectToDB } from '@utils/database';
import CommunicationLog from '@models/communication_log';
import { NextRequest, NextResponse } from 'next/server';
import Receipt from '@models/delivery-receipt';

export const POST = async (req: Request | NextRequest) => {
  try {
    await connectToDB();
    const rq = await req.json();
    const { logId, userId, status } = rq;
    console.log("Delivery Reciept", rq);

    const newReceipt = new Receipt({logId, userId, status});
    await newReceipt.save();

    return new Response('Status updated successfully', { status: 200 })
  } catch (error) {
    return new Response('Failed to update status', { status: 500 })
  }
};
