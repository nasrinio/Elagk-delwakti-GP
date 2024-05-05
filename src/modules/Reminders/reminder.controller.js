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
      return next(
        new Error("No prescriptions found for the user.", { cause: 404 })
      );
    }

    // Initialize variables for adherence calculation
    let totalReminders = 0;
    let takenReminders = 0;

    // Loop through each prescription
    for (const prescription of prescriptions) {
      // Find all reminders for this prescription
      const reminders = await reminderModel.find({
        prescriptionId: prescription._id,
      });

      // Update the total reminders count
      totalReminders += reminders.length;

      // Count the number of reminders with isTaken set to true
      const takenCount = reminders.filter(
        (reminder) => reminder.isTaken === true
      ).length;
      takenReminders += takenCount;
    }

    // Calculate the percentage of taken reminders
    const adherencePercentage = (takenReminders / totalReminders) * 100 || 0;

    return res.status(200).json({
      totalReminders,
      takenReminders,
      adherencePercentage,
    });
  } catch (error) {
    return next(
      new Error(
        `Error generating medication adherence report: ${error.message}`
      )
    );
  }
};
//determineReminderMedicines
//================================== determine reminder medicines ==========================
export const determineReminderMedicines = async (req, res, next) => {
  try {
    const userId = req.authUser._id;

    // Find all prescriptions for the user and populate the medicineId field
    const prescriptions = await prescriptionModel
      .find({ patientId: userId })
      .populate("medicineId");

    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ message: "No prescriptions found for the user" });
    }

    // Initialize arrays for reminded and non-reminded medicines
    let remindedMedicines = [];
    let nonRemindedMedicines = [];

    // Loop through each prescription
    for (const prescription of prescriptions) {
      // Check if there are reminders for this prescription
      const reminders = await reminderModel.find({ prescriptionId: prescription._id });

      // Loop through each medicine in the prescription
      for (const medicine of prescription.medicineId) {
        // Check if there is a reminder associated with this medicine
        const hasReminder = reminders.some(reminder => reminder.medicineId.equals(medicine._id));

        // Add the medicine to the appropriate array based on whether it has a reminder
        if (hasReminder) {
          remindedMedicines.push({
            medicineId: medicine._id,
            medicineName: medicine.medicineName,
          });
        } else {
          nonRemindedMedicines.push({
            medicineId: medicine._id,
            medicineName: medicine.medicineName,
          });
        }
      }
    }

    // Return both arrays of reminded and non-reminded medicines
    res.status(200).json({ message: "Success", remindedMedicines, nonRemindedMedicines });
  } catch (error) {
    console.error("Error in getAllMedicineNames:", error);
    next(error);
  }
};



