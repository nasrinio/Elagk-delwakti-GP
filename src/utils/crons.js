import { reminderModel } from "../../DB/Models/reminder.model.js";
import { scheduleJob } from "node-schedule";
import { sendNotification } from "../services/sendNotification.js";
import { prescriptionModel } from "../../DB/Models/prescription.js";



export const reminderCronJob = () => {
  scheduleJob({ rule: "* * * * *", tz: "Africa/Cairo" }, async function () {
    console.log("Reminder cron job started");
    try {
      console.log("Getting current time in Africa/Cairo...");
      const currentTime = new Date();
      console.log("Current time:", currentTime);
      console.log(
        "Current time in Africa/Cairo:",
        currentTime.toLocaleString("en-US", { timeZone: "Africa/Cairo" })
      );

      console.log("Finding reminders that are due and not marked as taken...");
      const dueReminders = await reminderModel.find({
        startDate: { $lte: currentTime }, // Reminders with start date less than or equal to current time
        isTaken: false, // Not marked as taken
      });
      console.log("Number of due reminders:", dueReminders.length);

      console.log("Processing each due reminder and sending notifications...");
      for (const reminder of dueReminders) {
        console.log("Processing reminder:", reminder._id);
        // Get the prescription associated with the reminder
        console.log("Getting prescription...");
        const prescription = await prescriptionModel.findById(
          reminder.prescriptionId
        );
        if (prescription) {
          console.log("Found prescription:", prescription._id);

          // Send notification with user ID from the prescription
          console.log("Sending notification...");
          await sendNotification(prescription.patientId, reminder._id);
          console.log("Notification sent successfully");

          // Update the reminder status or perform any other necessary actions
          console.log("Updating reminder status...");
          reminder.isTaken = true;
          await reminder.save();
          console.log("Reminder updated");
        }
      }
    } catch (error) {
      console.error("Error in reminder cron job:", error);
    }
    console.log("Reminder cron job finished");
  });
};



// export const reminderCronJob = () => {
//   scheduleJob({ rule: "* * * * *", tz: "Africa/Cairo" }, async function () {
//     try {
//       console.log("Reminder cron job started");

//       // Get current time in the specified time zone
//       const currentTime = new Date();
//       console.log("Current time:", currentTime);
//       console.log(
//         "Current time in Africa/Cairo:",
//         currentTime.toLocaleString("en-US", { timeZone: "Africa/Cairo" })
//       );

//       // Find reminders that are due, not marked as taken, and within the duration
//       console.log("Finding due reminders...");
//       const dueReminders = await reminderModel.find({
//         startDate: { $lte: currentTime }, // Reminders with start date less than or equal to current time
//         isTaken: false, // Not marked as taken
//       });
//       console.log(`Found ${dueReminders.length} due reminders`);

//       // Process each due reminder and send notifications
//       for (const reminder of dueReminders) {
//         console.log("Processing reminder:", reminder._id);

//         // Calculate the number of times the medicine should be taken in a day
//         const frequency = reminder.frequency;
//         const duration = reminder.duration; // Added duration field

//         const createdAt = new Date(reminder.createdAt);
//         const expirationDate = new Date(
//           createdAt.getTime() + duration * 24 * 60 * 60 * 1000
//         );

//         if (currentTime > expirationDate) {
//           console.log("Reminder duration expired");
//           // Perform actions for expired reminders, if needed
//           continue; // Skip processing expired reminders
//         }

//         // Calculate the time difference in minutes from startDate to current time
//         const startTime = new Date(reminder.startDate);
//         const timeDiffMinutes = Math.ceil((currentTime - startTime) / (1000 * 60));

//         // Calculate the interval between each dose based on the frequency
//         const intervalMinutes = Math.floor(24 * 60 / frequency);

//         // Check if the current time falls within the frequency interval for the reminder
//         if (timeDiffMinutes % intervalMinutes === 0) {
//           console.log("Current time falls within the reminder interval");

//           // Get the prescription associated with the reminder
//           console.log("Getting prescription...");
//           const prescription = await prescriptionModel.findById(
//             reminder.prescriptionId
//           );
//           if (prescription) {
//             console.log("Prescription found:", prescription._id);

//             // Send notification with user ID from the prescription
//             console.log("Sending notification...");
//             await sendNotification(prescription.patientId, reminder._id);
//             console.log("Notification sent");

//             // Update the reminder status or perform any other necessary actions
//             console.log("Updating reminder status...");
//             reminder.isTaken = true;
//             await reminder.save();
//             console.log("Reminder status updated");
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error in reminder cron job:", error);
//     }
//   });
// };
