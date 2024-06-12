import { connectToDB } from '@utils/database';
import Customer from '@models/customer';
import { NextRequest } from 'next/server';

export const POST = async (req: Request | NextRequest) => {
    const { user_id, name, email, phno, total_spends, visits, last_visit } = await req.json();
    
    try {
        await connectToDB();
        const newCustomer = new Customer({
            user_id, name, email, phno, total_spends, visits, last_visit
        })
        console.log(newCustomer);
        
        await newCustomer.save();

        return new Response(JSON.stringify(newCustomer), { status: 201 })
    } catch(error) {
        console.error("Error creating new customer:", error);
        return new Response("Failed to create new customer", { status: 500 })
    }
}