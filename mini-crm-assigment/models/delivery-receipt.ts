import { Schema, model, models } from "mongoose";

const ReceiptSchema = new Schema({
    logId: {
        type: Schema.Types.ObjectId,
        ref: "CommunicationLog",
    },
    userId: {
        type: String,
        ref: "Product",
        required: [true, 'UserId are required'],
    },
    status: {
        type: String,
        enum: ["SENT", "FAILED"],
        required: [true, 'Status is required'],
    },
});

const Receipt = models.Receipt || model("Reciept", ReceiptSchema);

export default Receipt;
