import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
    },
    products: {
        type: [Schema.Types.ObjectId],
        ref: "Product",
        required: [true, 'Ordered Products are required'],
    },
    order_date: {
        type: Date,
        required: [true, 'Order Date is required'],
    },
    amount: {
        type: Number,
        required: [true, 'Total Order amount is required']
    },
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;
