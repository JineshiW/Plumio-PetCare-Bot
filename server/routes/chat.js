const express = require("express");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Object to hold chat session data for each user
const sessions = {};

// Define the path to the receipts folder and create it if it doesn't exist
const receiptDir = path.join(__dirname, "../receipts");
if (!fs.existsSync(receiptDir)) {
  fs.mkdirSync(receiptDir, { recursive: true });
}

// Route to process incoming chat messages
router.post("/", async (req, res) => {
  const { userId, message } = req.body;

  // If the message is "restart chat", clear the current session and start over
  if (message === "restart chat") {
    delete sessions[userId];
    sessions[userId] = { step: 1 };
    return res.send({
      message:
        "Hello! I'm Plumio, your virtual assistant. Would you like to book an appointment for your pet today? (Yes/No)",
    });
  }

  // Retrieve existing session data or initialize a new session with step 1
  const session = sessions[userId] || { step: 1 };
  const userMessage = message.trim();

  // Switch-case to handle different stages of the chat flow
  switch (session.step) {
    case 1:
      res.send({
        message:
          "Hello! I'm Plumio, your virtual assistant. Would you like to book an appointment for your pet today? (Yes/No)",
      });
      session.step++; // Go to next step
      break;

    case 2:
      if (userMessage.toLowerCase().includes("yes")) {
        res.send({
          message:
            "Great! What type of pet do you have? (Dog, Cat, Parrot, Rabbit)",
        });
        session.step++; // Advance if user answers yes
      } else if (userMessage.toLowerCase().includes("no")) {
        res.send({
          message:
            "Okay, feel free to reach out if you need anything later! 😺🐶",
        });
        session.step = 1; // Reset session if user declines
      } else {
        res.send({
          message:
            "Sorry, I didn't quite understand. Please reply with 'Yes' or 'No'.",
        });
      }
      break;

    case 3:
      // Validate the pet type provided by the user
      if (["Dog", "Cat", "Parrot", "Rabbit"].includes(userMessage)) {
        session.petType = userMessage;
        res.send({
          message: `Got it! What's the name of your ${session.petType}?`,
        });
        session.step++; // Proceed to next step after valid pet type
      } else {
        res.send({
          message: "Please enter a valid pet type (Dog, Cat, Parrot, Rabbit).",
        });
      }
      break;

    case 4:
      // Save the pet's name and prompt for its breed
      session.petName = message;
      res.send({
        message: `Nice to meet ${session.petName}! What's the breed of your ${session.petType}?`,
      });
      session.step++;
      break;

    case 5:
      // Save the pet's breed and retrieve available locations from doctors matching the pet type
      session.petBreed = message;
      try {
        const locations = await Doctor.distinct("location", {
          petTypes: session.petType,
        });
        if (locations.length > 0) {
          res.send({
            message: `Where would you like to book your appointment? Please choose a location: ${locations.join(
              ", "
            )}`,
          });
          session.step++; // Proceed if locations are found
        } else {
          res.send({
            message: `Sorry, no available locations for ${session.petType} right now. Let me know if you'd like to try again later.`,
          });
          session.step = 3; // Return to pet type selection if no locations found
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).send({
          message:
            "Something went wrong while fetching locations. Please try again later.",
        });
      }
      break;

    case 6:
      // Save the chosen location and find doctors matching the pet type and location
      if (message && message.length > 0) {
        session.location = message;
        try {
          const doctors = await Doctor.find({
            petTypes: session.petType,
            location: session.location,
          });
          if (doctors.length > 0) {
            // Store doctor names from the results
            session.availableDoctors = doctors.map((doc) => doc.name);
            const doctorNames = doctors.map((doc) => doc.name).join(", ");
            res.send({
              message: `Here are the available doctors for ${session.petType} in ${session.location}: ${doctorNames}. Please choose a doctor.`,
            });
            session.step++; // Proceed after listing doctors
          } else {
            res.send({
              message: `Sorry, no doctors are available in ${session.location} for ${session.petType}. Try another location.`,
            });
          }
        } catch (error) {
          console.error("Error fetching doctors:", error);
          res.status(500).send({
            message:
              "An error occurred while fetching doctors. Please try again later.",
          });
        }
      } else {
        res.send({
          message: "Please choose a valid location from the list provided.",
        });
      }
      break;

    case 7:
      // Validate the doctor's name chosen by the user
      const doctorName = userMessage.trim();
      if (session.availableDoctors.includes(doctorName)) {
        session.selectedDoctor = doctorName;
        try {
          const doctor = await Doctor.findOne({
            name: session.selectedDoctor,
            location: session.location,
          });
          if (doctor && doctor.availableDates.length > 0) {
            res.send({
              message: `${
                session.selectedDoctor
              } is available on the following dates: ${doctor.availableDates.join(
                ", "
              )}. Please choose a date.`,
            });
            session.step++; // Proceed after valid doctor selection
          } else {
            res.send({
              message: `Unfortunately, Dr. ${session.selectedDoctor} doesn't have any available dates. Please choose another doctor.`,
            });
          }
        } catch (error) {
          console.error("Error fetching available dates:", error);
          res.status(500).send({
            message: "Something went wrong while checking available dates.",
          });
        }
      } else {
        res.send({
          message:
            "I couldn't find that doctor. Please choose from the available list.",
        });
      }
      break;

    case 8:
      // Save the selected date and retrieve available times from the doctor's schedule
      session.selectedDate = message;
      try {
        const doctor = await Doctor.findOne({
          name: session.selectedDoctor,
          location: session.location,
        });
        if (doctor && doctor.availableDates.includes(session.selectedDate)) {
          res.send({
            message: `Great! ${session.selectedDoctor} has available times on ${session.selectedDate}. Choose a time: 10:00 AM, 1:00 PM, or 3:00 PM.`,
          });
          session.step++; // Advance to the time selection step
        } else {
          res.send({
            message: `Sorry, that date isn't available. Please choose another date.`,
          });
        }
      } catch (error) {
        console.error("Error fetching available times:", error);
        res.status(500).send({
          message:
            "An error occurred while checking available times. Please try again later.",
        });
      }
      break;

    case 9:
      // Validate the chosen time from the list of available times
      const availableTimes = ["10:00 AM", "1:00 PM", "3:00 PM"];
      if (availableTimes.includes(message)) {
        session.selectedTime = message;

        // Randomly determine a consultation fee between 20 and 50
        const consultationFee = Math.floor(Math.random() * 31) + 20;
        const taxRate = 0.08;
        const taxAmount = parseFloat((consultationFee * taxRate).toFixed(2));
        const totalAmount = parseFloat(
          (consultationFee + taxAmount).toFixed(2)
        );

        // Create a new appointment document in the database
        await Appointment.create({
          doctorName: session.selectedDoctor,
          petType: session.petType,
          petName: session.petName,
          breed: session.petBreed,
          location: session.location,
          ownerId: userId,
          date: session.selectedDate,
          time: session.selectedTime,
          consultationFee: totalAmount,
        });

        // Confirm that the receipts directory exists before generating the receipt PDF
        if (!fs.existsSync(receiptDir)) {
          fs.mkdirSync(receiptDir, { recursive: true });
        }

        // Generate a PDF receipt for the appointment
        const doc = new PDFDocument();
        const pdfPath = path.join(receiptDir, `receipt_${userId}.pdf`);

        console.log("Generating receipt for user:", userId);

        const writeStream = fs.createWriteStream(pdfPath);
        doc.pipe(writeStream);

        doc.fontSize(18).text(" Plumio Receipt ", { align: "center" });
        doc.moveDown();

        // Set a monospaced font for consistent alignment in the receipt
        doc.font("Courier").fontSize(14);

        // Define a fixed label width for proper alignment
        const commonLabelWidth = 20;

        doc.text("Pet Type".padEnd(commonLabelWidth) + ": " + session.petType);
        doc.text("Pet Name".padEnd(commonLabelWidth) + ": " + session.petName);
        doc.text("Breed".padEnd(commonLabelWidth) + ": " + session.petBreed);
        doc.text(
          "Doctor".padEnd(commonLabelWidth) + ": " + session.selectedDoctor
        );
        doc.text("Location".padEnd(commonLabelWidth) + ": " + session.location);
        doc.text("Date".padEnd(commonLabelWidth) + ": " + session.selectedDate);
        doc.text("Time".padEnd(commonLabelWidth) + ": " + session.selectedTime);
        doc.text(
          "Consultation Fee".padEnd(commonLabelWidth) +
            ": $" +
            consultationFee.toFixed(2)
        );
        doc.text(
          "Tax (8%)".padEnd(commonLabelWidth) + ": $" + taxAmount.toFixed(2)
        );
        doc.text(
          "Total Amount".padEnd(commonLabelWidth) +
            ": $" +
            totalAmount.toFixed(2)
        );

        doc.moveDown();
        doc.text("Thank you for choosing Plumio!", { align: "center" });

        doc.end();

        // When the PDF generation is finished, send the receipt URL back to the client
        writeStream.on("finish", () => {
          console.log("Receipt saved at:", pdfPath);
          res.json({
            message: `Your appointment is confirmed! 🎉 You can download your receipt here`,
            receiptUrl: `http://localhost:5000/receipts/receipt_${userId}.pdf`,
          });
        });

        // If an error occurs while writing the PDF, notify the client
        writeStream.on("error", (err) => {
          console.error("Error saving receipt:", err);
          res.json({
            message:
              "Your appointment is confirmed, but we couldn't generate the receipt.",
          });
        });

        session.step = 1; // Reset the chat session after appointment completion
      } else {
        res.send({
          message: "Please choose a valid time: 10:00 AM, 1:00 PM, or 3:00 PM.",
        });
      }
      break;
  }

  // Save the updated session data for the user
  sessions[userId] = session;
});

// Route to serve the generated PDF receipt to the client
router.get("/receipt/:userId", (req, res) => {
  const { userId } = req.params;
  const receiptPath = path.join(receiptDir, `receipt_${userId}.pdf`);

  if (fs.existsSync(receiptPath)) {
    res.sendFile(receiptPath);
  } else {
    res.status(404).send({ message: "Receipt not found." });
  }
});

module.exports = router;
