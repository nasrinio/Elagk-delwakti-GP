import { Schema, model } from "mongoose";

const reminderSchema = new Schema(
  {
    reminderMsg: {
      type: String,
      required: false,
      lowercase: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    prescriptionId: {       
      type: Schema.Types.ObjectId,
      ref: 'Prescription',
      required: true
    },
    medicineId : {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
    },
    isTaken: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: Number,
      required: true,
    },
    dosage: {
      type: String,
      required: false,
    },
    duration: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
export const reminderModel = model("Reminder", reminderSchema);
