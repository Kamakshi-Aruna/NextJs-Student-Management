'use client'

import {useState, useEffect} from "react";
import {BarChart3, Table, Search, Plus} from "lucide-react";
import BarChartComponent from "@/app/components/Barchart";
import StudentFormModal from "@/app/components/StudentFormModal";

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Default sort by marks in descending order (highest first)
    const [sortConfig, setSortConfig] = useState({key: 'marks', direction: 'descending'});
    const [currentPage, setCurrentPage] = useState(1);

    // View toggle state (table or bar)
    const [view, setView] = useState('table');

    const studentsPerPage = 5;

    useEffect(() => {
        fetchStudents();
    }, []);

    // Reset to first page when search or sort changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortConfig]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/students");
            const data = await res.json();
            setStudents(data.students);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async (newStudent) => {
        try {
            const res = await fetch("/api/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newStudent),
            });

            if (!res.ok) {
                throw new Error("Failed to add student");
            }

            // Refresh student list
            fetchStudents();

            // Close modal
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding student:", error);
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({key, direction});
    };

    const sortedStudents = [...students].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === 'marks') {
            return sortConfig.direction === 'ascending'
                ? parseInt(aValue) - parseInt(bValue)
                : parseInt(bValue) - parseInt(aValue);
        }

        return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

    const filteredStudents = sortedStudents.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSortIcon = (name) => {
        if (sortConfig.key !== name) return null;
        return sortConfig.direction === 'ascending' ? '↑' : '↓';
    };

    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
    const displayedStudents = filteredStudents.slice((currentPage - 1) * studentsPerPage, currentPage * studentsPerPage);

    return (
        <div className="container mx-auto p-6 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6 text-center">Student Management</h1>
            <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                </div>

                {/* View toggle buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg transition-colors">
                        <Plus size={16}/>
                        <span>Add Student</span>
                    </button>
                    <button
                        className={`p-2 rounded-lg flex items-center gap-1 ${view === 'table' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                        onClick={() => setView('table')}
                    >
                        <Table size={16}/>
                        <span className="text-sm">Table</span>
                    </button>
                    <button
                        className={`p-2 rounded-lg flex items-center gap-1 ${view === 'bar' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                        onClick={() => setView('bar')}
                    >
                        <BarChart3 size={16}/>
                        <span className="text-sm">Bar Chart</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto w-full max-w-7xl bg-white rounded-lg shadow-sm border border-gray-200">
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <div
                            className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {view === "table" ? (
                            <>
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="p-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
                                        <th className="p-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('email')}>Email {getSortIcon('email')}</th>
                                        <th className="p-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('subject')}>Subject {getSortIcon('subject')}</th>
                                        <th className="p-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('marks')}>
                                            Marks {getSortIcon('marks')}
                                            {sortConfig.key !== 'marks' &&
                                                <span className="ml-1 text-xs text-gray-400">(click to sort)</span>}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {displayedStudents.length > 0 ? (
                                        displayedStudents.map((student) => (
                                            <tr key={student._id}
                                                className="border-b hover:bg-gray-50 transition-colors">
                                                <td className="p-4">{student.name}</td>
                                                <td className="p-4 truncate max-w-[150px]">{student.email}</td>
                                                <td className="p-4">{student.subject}</td>
                                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        parseInt(student.marks) >= 80 ? 'bg-green-100 text-green-800' :
                                            parseInt(student.marks) >= 60 ? 'bg-blue-100 text-blue-800' :
                                                parseInt(student.marks) >= 40 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                    }`}>{student.marks}</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4"
                                                className="p-4 text-center text-gray-500">{searchTerm ? "No matching students found" : "No students available"}</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>

                                {/* Pagination controls - only show in table view */}
                                {totalPages > 0 && (
                                    <div className="flex justify-between items-center p-4 border-t">
                                        <div className="text-sm text-gray-500">
                                            Showing {((currentPage - 1) * studentsPerPage) + 1}-{Math.min(currentPage * studentsPerPage, filteredStudents.length)} of {filteredStudents.length}
                                        </div>
                                        <div className="flex space-x-1">
                                            {/* Previous button */}
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className={`px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                                            >
                                                &laquo;
                                            </button>

                                            {/* Page numbers */}
                                            {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        className={`mx-1 px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}

                                            {/* Next button */}
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                                className={`px-2 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                                            >
                                                &raquo;
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            // Bar chart view - using imported component with all filtered students
                            <BarChartComponent students={filteredStudents}/>
                        )}
                    </>
                )}
            </div>

            {/* Student Form Modal */}
            <StudentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddStudent}
            />
        </div>
    );
}