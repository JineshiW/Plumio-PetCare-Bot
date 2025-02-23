const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Doctor = require("./models/Doctor");

// Load environment variables
dotenv.config();

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in .env!");
  process.exit(1);
}

// MongoDB Connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Function to Add Doctors
const addDoctors = async () => {
  const doctors = [
    {
      name: "Dr.Perera",
      petTypes: ["Dog", "Cat"],
      availableDates: ["2nd of October", "5th of November"],
      location: "Colombo",
    },
    {
      name: "Dr.Smith",
      petTypes: ["Dog"],
      availableDates: ["10th of December", "15th of December"],
      location: "Colombo",
    },
    {
      name: "Dr.Ravi",
      petTypes: ["Dog", "Cat"],
      availableDates: ["12th of December", "20th of December"],
      location: "Colombo",
    },
    {
      name: "Dr.Silva",
      petTypes: ["Dog", "Parrot"],
      availableDates: ["10th of December", "15th of December"],
      location: "Kandy",
    },
    {
      name: "Dr.Fernando",
      petTypes: ["Cat", "Rabbit"],
      availableDates: ["8th of September", "12th of September"],
      location: "Galle",
    },
    {
      name: "Dr.Jayasinghe",
      petTypes: ["Dog", "Cat", "Parrot"],
      availableDates: ["20th of October", "25th of October"],
      location: "Jaffna",
    },
    {
      name: "Dr.Rathnayake",
      petTypes: ["Rabbit", "Parrot"],
      availableDates: ["5th of November", "9th of November"],
      location: "Anuradhapura",
    },
    {
      name: "Dr.Bandara",
      petTypes: ["Dog", "Cat"],
      availableDates: ["1st of December", "6th of December"],
      location: "Negombo",
    },
    {
      name: "Dr.Wijesinghe",
      petTypes: ["Dog", "Rabbit"],
      availableDates: ["3rd of October", "7th of October"],
      location: "Kurunegala",
    },
    {
      name: "Dr.Wickramasinghe",
      petTypes: ["Cat", "Parrot"],
      availableDates: ["11th of December", "16th of December"],
      location: "Badulla",
    },
    {
      name: "Dr.Abeysekara",
      petTypes: ["Dog", "Cat", "Rabbit"],
      availableDates: ["9th of September", "14th of September"],
      location: "Ratnapura",
    },
    {
      name: "Dr.Dissanayake",
      petTypes: ["Parrot", "Rabbit"],
      availableDates: ["22nd of October", "28th of October"],
      location: "Matara",
    },
    {
      name: "Dr.Kumarasinghe",
      petTypes: ["Dog", "Cat"],
      availableDates: ["3rd of November", "7th of November"],
      location: "Colombo",
    },
    {
      name: "Dr.Priyankara",
      petTypes: ["Cat", "Rabbit"],
      availableDates: ["2nd of December", "7th of December"],
      location: "Galle",
    },
    {
      name: "Dr.Karunarathne",
      petTypes: ["Dog", "Rabbit"],
      availableDates: ["4th of October", "8th of October"],
      location: "Kurunegala",
    },
    {
      name: "Dr.Bandara",
      petTypes: ["Dog", "Cat"],
      availableDates: ["10th of October", "15th of October"],
      location: "Negombo",
    },
    {
      name: "Dr.Abhaywardene",
      petTypes: ["Parrot", "Rabbit"],
      availableDates: ["13th of November", "17th of November"],
      location: "Jaffna",
    },
    {
      name: "Dr.Hemachandra",
      petTypes: ["Dog", "Cat", "Rabbit"],
      availableDates: ["15th of October", "20th of October"],
      location: "Colombo",
    },
    {
      name: "Dr.Basnayake",
      petTypes: ["Cat", "Rabbit"],
      availableDates: ["2nd of November", "5th of November"],
      location: "Kandy",
    },
    {
      name: "Dr.Tharanga",
      petTypes: ["Dog", "Cat"],
      availableDates: ["10th of November", "15th of November"],
      location: "Ratnapura",
    },
    {
      name: "Dr.Umesh",
      petTypes: ["Rabbit", "Parrot"],
      availableDates: ["16th of November", "20th of November"],
      location: "Matara",
    },
    {
      name: "Dr.Harindra",
      petTypes: ["Cat", "Parrot"],
      availableDates: ["18th of December", "22nd of December"],
      location: "Badulla",
    },
    {
      name: "Dr.Shantha",
      petTypes: ["Dog", "Cat"],
      availableDates: ["2nd of December", "10th of December"],
      location: "Colombo",
    },
    {
      name: "Dr.Madhushika",
      petTypes: ["Dog", "Parrot"],
      availableDates: ["15th of December", "18th of December"],
      location: "Kandy",
    },
    {
      name: "Dr.Sathish",
      petTypes: ["Rabbit", "Parrot"],
      availableDates: ["20th of October", "25th of October"],
      location: "Kurunegala",
    },
    {
      name: "Dr.Mahesha",
      petTypes: ["Dog", "Rabbit"],
      availableDates: ["5th of October", "10th of October"],
      location: "Anuradhapura",
    },
    {
      name: "Dr.Yapa",
      petTypes: ["Dog", "Cat"],
      availableDates: ["9th of November", "13th of November"],
      location: "Galle",
    },
    {
      name: "Dr.Senaratne",
      petTypes: ["Cat", "Rabbit"],
      availableDates: ["22nd of November", "26th of November"],
      location: "Matara",
    },
    {
      name: "Dr.Wijayaratne",
      petTypes: ["Parrot", "Rabbit"],
      availableDates: ["29th of November", "4th of December"],
      location: "Ratnapura",
    },
    {
      name: "Dr.Jayakody",
      petTypes: ["Dog", "Parrot"],
      availableDates: ["10th of September", "14th of September"],
      location: "Kurunegala",
    },
    {
      name: "Dr.Wimalaratne",
      petTypes: ["Cat", "Dog"],
      availableDates: ["1st of October", "6th of October"],
      location: "Negombo",
    },
    {
      name: "Dr.Balapitiya",
      petTypes: ["Rabbit", "Cat"],
      availableDates: ["4th of December", "8th of December"],
      location: "Jaffna",
    },
    {
      name: "Dr.Padmasiri",
      petTypes: ["Dog", "Parrot"],
      availableDates: ["10th of September", "15th of September"],
      location: "Kandy",
    },
    {
      name: "Dr.Hemantha",
      petTypes: ["Dog", "Cat"],
      availableDates: ["20th of September", "25th of September"],
      location: "Badulla",
    },
  ];

  try {
    for (let doctorData of doctors) {
      console.log("Inserting doctor:", doctorData);
      const doctor = new Doctor(doctorData);
      await doctor.save();
      console.log("Doctor saved:", doctor);
    }
    console.log("All doctors added to the database!");
  } catch (error) {
    console.error("Error adding doctors:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Call the Function
addDoctors();
