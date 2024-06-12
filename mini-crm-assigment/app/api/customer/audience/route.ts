import { connectToDB } from '@utils/database';
import Customer from '@models/customer';
import { NextRequest, NextResponse } from 'next/server';

interface ConstraintsI {
    total_spends: Array<number | null>;
    visits: Array<number | null>;    
    last_visit: Array<Date | null>;
}

interface RequestI {
    constraints: ConstraintsI;
}

export const POST = async (request: NextRequest) => {
    try {
        const req: RequestI = await request.json();
        const {total_spends, visits, last_visit} = req.constraints;

        await connectToDB();

        const query: any = {};

        if (total_spends) {
            const [lower, upper] = total_spends;
            if (lower !== null || upper !== null) {
                query.total_spends = {};
                if (lower !== null) {
                    query.total_spends.$gte = lower;
                }
                if (upper !== null) {
                    query.total_spends.$lte = upper;
                }
            }
        }

        if (visits) {
            const [lower, upper] = visits;
            if (lower !== null || upper !== null) {
                query.visits = {};
                if (lower !== null) {
                    query.visits.$gte = lower;
                }
                if (upper !== null) {
                    query.visits.$lte = upper;
                }
            }
        }

        if (last_visit) {
            const [lower, upper] = last_visit;
            if (lower !== null || upper !== null) {
                query.last_visit = {};
                if (lower !== null) {
                    query.last_visit.$gte = new Date(lower);
                }
                if (upper !== null) {
                    query.last_visit.$lte = new Date(upper);
                }
            }
        }
        
        const customers = await Customer.find(query);

        return new Response(JSON.stringify(customers), { status: 200});
    } catch (error) {
        console.error('Error processing request:', error);
        return new Response("Failed to fetch customers based on the constraints", { status: 500 });
    }
};
