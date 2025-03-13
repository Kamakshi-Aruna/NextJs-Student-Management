import { NextResponse } from "next/server";
import {connectDB} from "@/app/lib/mongodb";
import Student from "@/app/models/Student";

// Connect to MongoDB
connectDB();

// Handle GET (Fetch all students)
export async function GET() {
    try {
        const students = await Student.find();
        return NextResponse.json({ students });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Handle POST (Add a student)
export async function POST(req) {
    try {
        const { name, email, subject, marks } = await req.json();
        const student = new Student({ name, email, subject, marks });
        await student.save();
        return NextResponse.json({ message: "Student added successfully", student });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Handle DELETE (Remove a student)
export async function DELETE(req) {
    try {
        const { id } = await req.json();
        await Student.findByIdAndDelete(id);
        return NextResponse.json({ message: "Student deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Handle PUT (Update a student)
export async function PUT(req) {
    try {
        const { id, name, email, subject, marks } = await req.json();
        await Student.findByIdAndUpdate(id, { name, email, subject, marks });
        return NextResponse.json({ message: "Student updated successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
