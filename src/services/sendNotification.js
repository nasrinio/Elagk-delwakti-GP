import { medicineModel } from "../../DB/Models/medicine.model.js";
import { reminderModel } from "../../DB/Models/reminder.model.js";
import { userModel } from "../../DB/Models/user.model.js";
import { sendEmailService } from "./sendEmailService.js";
import { reminderTemplate } from "../utils/reminderTemplate.js";

export async function sendNotification(userId, reminderId) {
  try {
    console.log("Reminder ID:", reminderId); // Debugging: Log the reminderId
    // Get the reminder details based on the reminderId
    const reminder = await reminderModel.findById(reminderId);
    console.log("Retrieved Reminder:", reminder); // Debugging: Log the retrieved reminder

    // Check if the reminder exists and has a valid title
    if (!reminder || !reminder.reminderMsg) {
      throw new Error("Reminder not found or invalid title");
    }

    // Get the user details based on the userId (assuming you have a user model)
    const user = await userModel.findById(userId);

    // Check if the user exists and has a valid email
    if (!user || !user.email) {
      throw new Error("User not found or invalid email");
    }

    // Get the medicine details based on the medicineId from the reminder
    const medicine = await medicineModel.findById(reminder.medicineId);

    // Check if the medicine exists and has a valid name
    if (!medicine || !medicine.medicineName) {
      throw new Error("Medicine not found or invalid name");
    }

    // Send the notification using the email service
    const emailSent = sendEmailService({
      to: user.email,
      subject: "Reminder Notification",
      message: reminderTemplate({
        subject: medicine.medicineName,
      }),
    });
    if (!emailSent) {
      throw new Error("Failed to send notification email");
    }

    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
    // Handle any errors that occur during notification sending
    // You can log the error or perform any other error handling logic here
  }
}
