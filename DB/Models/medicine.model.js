import { Schema, model } from "mongoose";

const medicineSchema = new Schema(
  {
    medicineName: {
      type: String,
      required: true,
      unique: true,
    },
    prescriptionRequired: {
      type: Boolean,
      required: true, 
    },
    storageCondition: {
      type: String,
      required: true,
    },  

    
    expiryDate: {
      type: Date,
      required: true,
    },
    usageInstruction: {
      type: String,
      required: true,
    },
    sideEffects: {
      type: [String],
      default: [],
    },
    medicineType: {
      type: String,
      required: true,
    },
    categoryId: {
       type: Schema.Types.ObjectId,
       ref: 'MedicineCategory',
       required: true
    },
    activeIngredient: {
      type: String,
      required: true,
    },
    manufacture: {
      type: String,
      required: true,
    },
    concentration: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const medicineModel = model("Medicine", medicineSchema);

