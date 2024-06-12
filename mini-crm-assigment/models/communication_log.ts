import { Schema, model, models } from "mongoose";

const validateArrayLength = (arr: Array<Number | null>) => arr.length === 2;

const validateArrayElements = (arr: Array<Number | null>) => arr.every(el => el === null || typeof el === 'number');
const validateLastVisitElements = (arr: Array<Number | null>) => arr.every(el => el === null || typeof el === 'string');

const ConstraintSchema = new Schema({
  total_spends: {
    type: [Schema.Types.Mixed],
    validate: {
      validator: validateArrayLength,
      message: 'total_spends array must have exactly 2 elements.'
    },
    required: false,
  },
  visits: {
    type: [Schema.Types.Mixed],
    validate: {
      validator: validateArrayLength,
      message: 'visits array must have exactly 2 elements.'
    },
    required: false,
  },
  last_visit: {
    type: [Schema.Types.Mixed],
    validate: {
      validator: validateArrayLength,
      message: 'last_visit array must have exactly 2 elements.'
    },
    required: false,
  }
}, { _id: false });

ConstraintSchema.path('total_spends').validate(validateArrayElements, 'Each element in total_spends must be a number or null.');
ConstraintSchema.path('visits').validate(validateArrayElements, 'Each element in visits must be a number or null.');
ConstraintSchema.path('last_visit').validate(validateLastVisitElements, 'Each element in last_visit must be a string or null.');


const CommunicationLogSchema = new Schema({
  constraints: {
    type: ConstraintSchema,
    required: [true, "Audience constraints are required"],
  },
  messages: {
    type: [String],
    required: [true, "Message is required"],
  },
  audience_size: {
    type: Number,
    required: [true, "Audience size is required"]
  },
});

const CommunicationLog = models.CommunicationLog || model("CommunicationLog", CommunicationLogSchema);

export default CommunicationLog;
