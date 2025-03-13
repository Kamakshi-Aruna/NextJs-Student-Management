import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function BarChartComponent({ students }) {
    // Aggregate students with the same marks
    const aggregatedData = students.reduce((acc, student) => {
        const existingEntry = acc.find((entry) => entry.marks === student.marks);
        if (existingEntry) {
            existingEntry.count += 1; // Increment count for duplicates
            existingEntry.names.push(student.name); // Add student name
        } else {
            acc.push({ marks: student.marks, count: 1, names: [student.name] });
        }
        return acc;
    }, []);

    // Calculate some basic statistics
    const totalStudents = students.length;
    const avgMarks = totalStudents > 0
        ? (students.reduce((sum, student) => sum + student.marks, 0) / totalStudents).toFixed(1)
        : 0;

    const customTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-md shadow-lg border border-gray-200">
                    <p className="text-sm font-bold text-gray-800">{payload[0].payload.marks} Marks</p>
                    <p className="text-sm text-gray-600">Count: {payload[0].value}</p>
                    <div className="mt-1 max-h-28 overflow-y-auto">
                        <p className="text-xs font-medium text-gray-700">Students:</p>
                        <p className="text-xs text-gray-600">{payload[0].payload.names.join(", ")}</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full max-w-7xl bg-white p-6 rounded-lg shadow-sm border border-gray-200">

            {/* Statistics cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="text-2xl font-bold text-blue-700">{totalStudents}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Average Marks</p>
                    <p className="text-2xl font-bold text-green-700">{avgMarks}</p>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-center">Student Marks Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aggregatedData}>
                    <XAxis dataKey="marks" />
                    <YAxis />
                    <Tooltip content={customTooltip} />
                    <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
