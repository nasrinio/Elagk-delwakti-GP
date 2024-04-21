import { Schema, model } from "mongoose";

const pharmacySchema = new Schema(
  {
    pharmacyName: {
      type: String,
      required: true,    
    },
    logo: {
      secure_url: {
        type: String,
        required: true,
      }, 
      public_id: {
        type: String,
        required: true,
      },
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    operatingHours: {
      type: String,
      required: true,
    },

    medicineId: [{
      type: Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    }],

    streetName: {
      type: String,
      required: true,
    },
    buildingNum: String,
    cityId: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    customId: String,
  },
  { timestamps: true }
);

export const pharmacyModel = model("Pharmacy", pharmacySchema);

