import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    marks: Number,
});

const Student = mongoose.models.Student || mongoose.model("Student", StudentSchema);
export default Student;
