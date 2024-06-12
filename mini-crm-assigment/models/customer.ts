import { Schema, model, models } from "mongoose";
import Email from "next-auth/providers/email";

const CustomerSchema = new Schema({
    user_id: {
        type: String,
        required: [true, 'User ID is required'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'E-mail are required']
    },
    phno: {
        type: String,
        required: [true, 'Phone number is required']
    },
    total_spends: {
        type: Number,
    },
    visits: {
        type: Number,
    },
    last_visit: {
        type: Date,
    },
});

const Customer = models.Customer || model("Customer", CustomerSchema);

export default Customer;
