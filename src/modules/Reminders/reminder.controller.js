import { prescriptionModel } from "../../../DB/Models/prescription.js";
import { reminderModel } from "../../../DB/Models/reminder.model.js";
import { medicineModel } from "../../../DB/Models/medicine.model.js";
//import { convertDate } from "../../utils/dateform.js";

//================================== add reminder ==================================
export const createReminder = async (req, res, next) => {
  const { reminderMsg, startDate, frequency, dosage, duration } = req.body;
  const { medicineId } = req.query;
  const userId = req.authUser._id;

  // Find the prescription associated with the logged-in user and containing the specified medicineId
  const prescription = await prescriptionModel.findOne({
    patientId: userId,
    medicineId: medicineId,
  });

  // Check if the prescription exists for the user and medicine
  if (!prescription) {
    return next(
      new Error(
        "No prescription found for the logged-in user and specified medicine",
        { cause: 404 }
      )
    );
  }

  // Convert startDate from ISO format to "DD/MM/YYYY" format
  //const formattedStartDate = convertDate(startDate);

  // Create the reminder using the fetched prescription and other data
  const reminder = await reminderModel.create({
    reminderMsg,
    startDate,
    prescriptionId: prescription._id,
    medicineId,
    isTaken: false,
    frequency,
    dosage,
    duration,
  });

  // Return the success response with the created reminder
  res.status(201).json({ message: "Reminder created successfully", reminder });
};

// ================================== delete reminder ==========================
export const deleteReminder = async (req, res, next) => {
  const { reminderId } = req.query;

  // Find the reminder by its ID
  const reminder = await reminderModel.findById(reminderId);

  // Check if the reminder exists
  if (!reminder) {
    return next(new Error("Reminder not found", { cause: 404 }));
  }

  // Check if the reminder's prescription belongs to the logged-in user
  const prescription = await prescriptionModel.findOne({
    _id: reminder.prescriptionId,
    patientId: req.authUser._id,
  });

  if (!prescription) {
    return next(
      new Error("You are not authorized to delete this reminder", {
        cause: 403,
      })
    );
  }

  // Delete the reminder
  await reminderModel.findByIdAndRemove(reminderId);

  res.status(200).json({ message: "Reminder deleted successfully" });
};

//================================== update reminder ==========================
export const updateReminder = async (req, res, next) => {
  const { reminderId } = req.query;
  const { reminderMsg, startDate, isTaken, frequency, dosage, duration } =
    req.body;

  // Find the reminder by its ID
  const reminder = await reminderModel.findById(reminderId);

  // Check if the reminder exists
  if (!reminder) {
    return next(new Error("Reminder not found", { cause: 404 }));
  }

  // Check if the reminder's prescription belongs to the logged-in user
  const prescription = await prescriptionModel.findOne({
    _id: reminder.prescriptionId,
    patientId: req.authUser._id,
  });

  if (!prescription) {
    return next(
      new Error("You are not authorized to update this reminder", {
        cause: 403,
      })
    );
  }

  // Update only the provided fields
  if (reminderMsg !== undefined) reminder.reminderMsg = reminderMsg;
  if (startDate !== undefined) reminder.startDate = startDate;
  if (isTaken !== undefined) reminder.isTaken = isTaken;
  if (frequency !== undefined) reminder.frequency = frequency;
  if (dosage !== undefined) reminder.dosage = dosage;
  if (duration !== undefined) reminder.duration = duration;

  // Save the updated reminder
  const updatedReminder = await reminder.save();

  res.status(200).json({
    message: "Reminder updated successfully",
    reminder: updatedReminder,
  });
};

//================================== get all reminders ==========================
export const getAllReminders = async (req, res, next) => {
  const userId = req.authUser._id;

  const prescriptions = await prescriptionModel.find({ patientId: userId });

  // Extract medicineIds from the prescriptions
  const medicineIds = prescriptions.flatMap(
    (prescription) => prescription.medicineId
  );

  // Find all reminders with medicineIds from the prescriptions
  const reminders = await reminderModel.find({
    medicineId: { $in: medicineIds },
  });

  // Populate the 'medicineId' field with the corresponding 'medicineName'
  const populatedReminders = await Promise.all(
    reminders.map(async (reminder) => {
      const medicine = await medicineModel.findById(reminder.medicineId);
      return {
        ...reminder.toObject(),
        medicineName: medicine ? medicine.medicineName : "Unknown", // Set medicineName or 'Unknown' if medicine not found
      };
    })
  );

  res.status(200).json({ message: "Success", reminders: populatedReminders });
};

//================================== search reminders ==========================
// export const searchReminders = async (req, res, next) => {
//   try {
//     const { searchQuery } = req.body;

//     const reminders = await reminderModel.find({
//       reminderMsg: { $regex: new RegExp(searchQuery, 'i') },

//     });

//     res.status(200).json({ message: 'Reminders found', reminders });
//   } catch (error) {
//     console.error('Error in searchReminders:', error);
//     next(error);
//   }
// };

// export const searchReminders = async (req, res, next) => {
//   try {
//     const { searchQuery, startDate, endDate } = req.body; // Include startDate and endDate in the request body

//     let query = { reminderMsg: { $regex: new RegExp(searchQuery, 'i') } }; // Initial query to search by reminderMsg

//     // Optionally add startDate and/or endDate to the query if provided
//     if (startDate) {
//       query.startDate = { $gte: startDate }; // Find reminders with startDate greater than or equal to the provided startDate
//     }
//     if (endDate) {
//       query.startDate = { ...query.startDate, $lte: endDate }; // Find reminders with startDate less than or equal to the provided endDate
//     }

//     const reminders = await reminderModel.find(query);

//     res.status(200).json({ message: 'Reminders found', reminders });
//   } catch (error) {
//     console.error('Error in searchReminders:', error);
//     next(error);
//   }
// };

export const searchReminders = async (req, res, next) => {
  try {
    const { searchQuery, startDate, endDate, frequency, dosage, duration } =
      req.body;

    let query = { reminderMsg: { $regex: new RegExp(searchQuery, "i") } };

    // Optionally add startDate and/or endDate to the query if provided
    if (startDate) {
      query.startDate = { $gte: startDate };
    }
    if (endDate) {
      query.startDate = { ...query.startDate, $lte: endDate };
    }

    // Optionally add frequency, dosage, and duration to the query if provided
    if (frequency) {
      query.frequency = frequency;
    }
    if (dosage) {
      query.dosage = dosage;
    }
    if (duration) {
      query.duration = duration;
    }

    const reminders = await reminderModel.find(query);

    res.status(200).json({ message: "Reminders found", reminders });
  } catch (error) {
    console.error("Error in searchReminders:", error);
    next(error);
  }
};

// !! REPORTS !! 
//================================== generate medication adherence report ==========================
export const medicationAdherenceReport = async (req, res, next) => {
  try {
    const userId = req.authUser._id;

    // Find all prescriptions for the given user ID
    const prescriptions = await prescriptionModel.find({ patientId: userId });

    if (!prescriptions || prescriptions.length === 0) {
      return next(new Error("No prescriptions found for the user.", { cause: 404 }));
    }

    // Initialize variables for adherence calculation
    let totalPrescriptions = prescriptions.length;
    let adherentMedications = 0;

    // Loop through each prescription
    for (const prescription of prescriptions) {
      // Find the corresponding reminder for the prescription
      const reminder = await reminderModel.findOne({ prescriptionId: prescription._id });

      // Check if reminder exists and isTaken is true
      if (reminder && reminder.isTaken) {
        adherentMedications++;
      }
    }

    // Calculate adherence percentage
    const adherencePercentage = (adherentMedications / totalPrescriptions) * 100;

    return res.status(200).json({
      totalPrescriptions,
      adherentMedications,
      adherencePercentage,
    });
  } catch (error) {
    return next(new Error(`Error generating medication adherence report: ${error.message}`));
  }
};


//================================== determine reminder medicines ==========================
export const determineReminderMedicines = async (req, res, next) => {
  try {
    const userId = req.authUser._id;

    // Find all prescriptions for the given user ID
    const prescriptions = await prescriptionModel.find({ patientId: userId });

    if (!prescriptions || prescriptions.length === 0) {
      return next(new Error("No prescriptions found for the user.", { cause: 404 }));
    }

    // Initialize arrays for storing reminder medicines and non-reminder medicines
    let reminderMedicines = [];
    let nonReminderMedicines = [];

    // Loop through each prescription
    for (const prescription of prescriptions) {
      // Find the corresponding reminder for the prescription
      const reminder = await reminderModel.findOne({ prescriptionId: prescription._id });

      // Find the medicine details for the prescription
      const medicine = await medicineModel.findById(prescription.medicineId);

      // Check if a reminder exists for the prescription
      if (reminder) {
        reminderMedicines.push({
          prescriptionId: prescription._id,
          medicineId: prescription.medicineId,
          medicineName: medicine ? medicine.medicineName : "Unknown",
          isReminder: true,
        });
      } else {
        nonReminderMedicines.push({
          prescriptionId: prescription._id,
          medicineId: prescription.medicineId,
          medicineName: medicine ? medicine.medicineName : "Unknown",
          isReminder: false,
        });
      }
    }

    return res.status(200).json({
      reminderMedicines,
      nonReminderMedicines,
    });
  } catch (error) {
    return next(new Error(`Error determining reminder medicines: ${error.message}`));
  }
};