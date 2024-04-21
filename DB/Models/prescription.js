import { Schema, model } from "mongoose";

const prescriptionSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicineId: [{
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
     }],
    createDate: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      lowercase: true,
      required: true,
    },
    prescriptionText: {
      type: String,
    },
    image: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const prescriptionModel = model("Prescription", prescriptionSchema);

