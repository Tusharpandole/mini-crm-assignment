import { NextRequest } from 'next/server';

export const POST = async (req: Request | NextRequest) => {
  const request = await req.json();
  const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
  return new Response(JSON.stringify(status), { status: 200 });
};
