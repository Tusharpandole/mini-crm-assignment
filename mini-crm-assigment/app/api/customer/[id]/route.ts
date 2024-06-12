import { connectToDB } from '@utils/database';
import Customer from '@models/customer';
import { NextRequest } from 'next/server';

// GET
export const GET = async (request: Request | NextRequest, { params }: { params: { id: string } }) => {
    try {
        await connectToDB();
        const customers = await Customer.find({_id: params.id}).populate('user');
        if (!customers) return new Response("Customer not found", { status: 404 });
        return new Response(JSON.stringify(customers), { status: 200 });        
    } catch (error) {
        return new Response("Failed to fetch Customer", { status: 500 });
    }
}

export const PATCH = async (request: Request | NextRequest, { params }: { params: { id: string } }) => {
    const { name, email, phno, total_spends, visits, last_visit } = await request.json();

    try {
        await connectToDB();
        let existingCustomer = await Customer.findById(params.id);

        if (!existingCustomer) {
            return new Response("Stop not found", { status: 404 });
        }

        existingCustomer.name = name;
        existingCustomer.email = email;
        existingCustomer.phno = phno;
        existingCustomer.total_spends = total_spends;
        existingCustomer.visits = visits;
        existingCustomer.last_visit = last_visit;
        
        await existingCustomer.save();

        return new Response(JSON.stringify(existingCustomer), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(`Failed to update customer: ${params.id}`, { status: 500 });
    }
};

// DELETE
export const DELETE = async (request: Request | NextRequest, { params }: { params: { id: string } }) => {
    const {id} = params;
    try {
        await connectToDB();
        await Customer.findByIdAndDelete(id);
        return new Response(`Customer deleted successfully: ${id}`, { status: 200 });
    } catch (error) {
        console.error("Error while deleting Customer", error);
        return new Response("Failed to delete Customer", { status: 500 });
    }
};
