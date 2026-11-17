import React, { useEffect, useMemo, useState } from "react";
import {
  GraduationCap, House, LayoutDashboard, Users, BookOpen, BarChart3,
  Plus, Search, Pencil, Trash2, Wallet, CheckCircle2, AlertCircle,
} from "lucide-react";
import "./App.css";

const DEFAULT_COURSES = [
  { id: "bca", name: "BCA", feePerSemester: 25000, semesters: 6 },
  { id: "btech", name: "BTech", feePerSemester: 50000, semesters: 8 },
  { id: "bba", name: "BBA", feePerSemester: 30000, semesters: 6 },
  { id: "mca", name: "MCA", feePerSemester: 40000, semesters: 4 },
  { id: "mba", name: "MBA", feePerSemester: 60000, semesters: 4 },
];
const DEFAULT_STUDENTS = [
  { id: "sample-1", name: "Rahul Sharma", email: "rahul@example.com", courseId: "bca", status: "Active", cgpa: 8.4, feePaid: 25000 },
  { id: "sample-2", name: "Priya Singh", email: "priya@example.com", courseId: "btech", status: "Active", cgpa: 9.1, feePaid: 100000 },
  { id: "sample-3", name: "Aman Verma", email: "aman@example.com", courseId: "bba", status: "Inactive", cgpa: 7.3, feePaid: 0 },
];
const CURRENCY = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const money = (value) => CURRENCY.format(Number(value) || 0);
const makeId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
const readStored = (key) => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
};
const blankStudent = { name: "", email: "", courseId: "", status: "Active", cgpa: "", feePaid: "0" };
const blankCourse = { name: "", feePerSemester: "", semesters: "" };

export default function App() {
  const [page, setPage] = useState("Home");
  const [courses, setCourses] = useState(() => {
    const stored = readStored("edumanager_courses");
    if (!Array.isArray(stored)) return DEFAULT_COURSES;
    return stored.map((c) => typeof c === "string"
      ? { id: makeId(), name: c, feePerSemester: 0, semesters: 1 }
      : { ...c, id: c.id || makeId(), feePerSemester: Number(c.feePerSemester) || 0, semesters: Number(c.semesters) || 1 });
  });
  const [students, setStudents] = useState(() => {
    const stored = readStored("edumanager_students") ?? readStored("students");
    if (!Array.isArray(stored)) return DEFAULT_STUDENTS;
    return stored.map((s) => ({
      ...s, id: s.id ?? makeId(), courseId: s.courseId || s.course || "",
      status: s.status || "Active", cgpa: s.cgpa ?? "", feePaid: Number(s.feePaid) || 0,
    }));
  });
  const [studentForm, setStudentForm] = useState(blankStudent);
  const [editingStudent, setEditingStudent] = useState(null);
  const [courseForm, setCourseForm] = useState(blankCourse);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => { localStorage.setItem("edumanager_courses", JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem("edumanager_students", JSON.stringify(students)); }, [students]);

  const courseFor = (student) => courses.find((c) => String(c.id) === String(student.courseId) || c.name === student.courseId);
  const totalFee = (course) => course ? Number(course.feePerSemester) * Number(course.semesters) : 0;
  const dueFor = (student) => Math.max(0, totalFee(courseFor(student)) - Number(student.feePaid || 0));
  const paidStatus = (student) => {
    const fee = totalFee(courseFor(student));
    return fee <= 0 ? "Not configured" : dueFor(student) === 0 ? "Paid" : Number(student.feePaid) > 0 ? "Partially Paid" : "Unpaid";
  };
  const collected = students.reduce((sum, s) => sum + Number(s.feePaid || 0), 0);
  const outstanding = students.reduce((sum, s) => sum + dueFor(s), 0);
  const averageCgpa = (() => {
    const valid = students.map((s) => Number(s.cgpa)).filter((n) => Number.isFinite(n) && n >= 0 && n <= 10);
    const withCgpa = students.filter((s) => s.cgpa !== "" && s.cgpa !== null && s.cgpa !== undefined);
    return withCgpa.length ? (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2) : "N/A";
  })();
  const courseCounts = useMemo(() => courses.map((course) => ({ ...course, count: students.filter((s) => String(s.courseId) === String(course.id) || s.courseId === course.name).length })), [courses, students]);
  const filteredStudents = students.filter((s) => {
    const query = search.trim().toLowerCase();
    const matchSearch = `${s.name} ${s.email} ${courseFor(s)?.name || s.courseId}`.toLowerCase().includes(query);
    const matchCourse = courseFilter === "All" || String(s.courseId) === String(courseFilter) || courseFor(s)?.id === courseFilter;
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchCourse && matchStatus;
  });

  function saveStudent(e) {
    e.preventDefault();
    const name = studentForm.name.trim();
    const email = studentForm.email.trim();
    const cgpa = studentForm.cgpa === "" ? "" : Number(studentForm.cgpa);
    const feePaid = Number(studentForm.feePaid);
    const selected = courses.find((c) => String(c.id) === String(studentForm.courseId));
    if (!name || !email || !selected) return alert("Please enter a name, email, and valid course.");
    if (studentForm.cgpa !== "" && (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 10)) return alert("CGPA must be between 0 and 10.");
    if (!Number.isFinite(feePaid) || feePaid < 0 || feePaid > totalFee(selected)) return alert(`Fees paid must be between ₹0 and ${money(totalFee(selected))}.`);
    const duplicate = students.some((s) => s.email.toLowerCase() === email.toLowerCase() && s.id !== editingStudent);
    if (duplicate) return alert("A student with this email already exists.");
    const entry = { name, email, courseId: selected.id, status: studentForm.status, cgpa, feePaid };
    if (editingStudent !== null) setStudents((prev) => prev.map((s) => s.id === editingStudent ? { ...s, ...entry } : s));
    else setStudents((prev) => [...prev, { id: makeId(), ...entry }]);
    setEditingStudent(null);
    setStudentForm(blankStudent);
  }
  function editStudent(s) {
    setEditingStudent(s.id);
    setStudentForm({ name: s.name, email: s.email, courseId: String(courseFor(s)?.id || ""), status: s.status, cgpa: s.cgpa ?? "", feePaid: String(s.feePaid || 0) });
    setPage("Students");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function deleteStudent(id) {
    if (!window.confirm("Delete this student permanently from this browser?")) return;
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (editingStudent === id) { setEditingStudent(null); setStudentForm(blankStudent); }
  }
  function saveCourse(e) {
    e.preventDefault();
    const name = courseForm.name.trim();
    const fee = Number(courseForm.feePerSemester);
    const semesters = Number(courseForm.semesters);
    if (!name || !Number.isFinite(fee) || fee <= 0 || !Number.isInteger(semesters) || semesters < 1 || semesters > 20) return alert("Enter a course name, positive semester fee, and duration of 1–20 semesters.");
    if (courses.some((c) => c.name.toLowerCase() === name.toLowerCase())) return alert("Course already exists.");
    setCourses((prev) => [...prev, { id: makeId(), name, feePerSemester: fee, semesters }]);
    setCourseForm(blankCourse);
  }
  function deleteCourse(course) {
    if (students.some((s) => String(s.courseId) === String(course.id) || s.courseId === course.name)) return alert("This course has enrolled students. Reassign or delete those students before deleting the course.");
    if (window.confirm(`Delete ${course.name}?`)) setCourses((prev) => prev.filter((c) => c.id !== course.id));
  }

  const nav = [
    { name: "Home", icon: House },
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Students", icon: Users },
    { name: "Courses", icon: BookOpen },
    { name: "Statistics", icon: BarChart3 },
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><GraduationCap size={32} /><h2>EduManager</h2></div>
        <p>Student Management System</p><hr />
        {nav.map(({ name, icon: Icon }) => (
          <button type="button" key={name} className={`nav-item ${page === name ? "active" : ""}`} onClick={() => setPage(name)}>
            <Icon size={19} /><span>{name}</span>
          </button>
        ))}
      </aside>

      <main className="main">
        <header><h1>{page}</h1><p>{({ Home: "Welcome to your student management workspace", Dashboard: "An overview of students and finances", Students: "Manage student records, grades, and payments", Courses: "Manage courses, semester fees, and duration", Statistics: "Explore enrollment and CGPA performance" })[page]}</p></header>

        {page === "Home" && <>
          <section className="home-hero"><div><span className="home-label">STUDENT MANAGEMENT SYSTEM</span><h2>Welcome to EduManager 🎓</h2><p>Manage students, courses, fees, and academic performance from one place.</p><button onClick={() => setPage("Students")}>Manage Students →</button></div><GraduationCap className="hero-icon" size={100}/></section>
          <div className="home-stats">
            <div className="home-stat-card"><Users size={26}/><h3>{students.length}</h3><p>Total Students</p></div>
            <div className="home-stat-card"><BookOpen size={26}/><h3>{courses.length}</h3><p>Available Courses</p></div>
            <div className="home-stat-card"><BarChart3 size={26}/><h3>{averageCgpa}</h3><p>Average CGPA</p></div>
          </div>
        </>}

        {page === "Dashboard" && <>
          <section className="stats">
            <div className="stat-card"><span>Total Students</span><strong>{students.length}</strong></div>
            <div className="stat-card"><span>Active Students</span><strong>{students.filter((s) => s.status === "Active").length}</strong></div>
            <div className="stat-card"><span>Courses</span><strong>{courses.length}</strong></div>
            <div className="stat-card"><span>Fees Collected</span><strong className="money-stat">{money(collected)}</strong></div>
            <div className="stat-card"><span>Outstanding Fees</span><strong className="money-stat">{money(outstanding)}</strong></div>
            <div className="stat-card"><span>Average CGPA</span><strong>{averageCgpa}</strong></div>
          </section>
          <section className="panel"><h2>Course Enrollment Overview</h2><p className="chart-description">Students enrolled in each course</p><div className="enrollment-chart">
            {courseCounts.map((c) => <div className="chart-row" key={c.id}><span className="chart-label">{c.name}</span><div className="chart-track"><div className="chart-fill" style={{ width: `${students.length ? c.count / students.length * 100 : 0}%` }} /></div><strong>{c.count}</strong></div>)}
            {!courses.length && <p>No courses added yet.</p>}
          </div></section>
        </>}

        {page === "Students" && <>
          <section className="panel"><h2>{editingStudent !== null ? "Edit Student" : "Add Student"}</h2>
            <form className="student-form" onSubmit={saveStudent}>
              <label>Full Name<input required placeholder="Student name" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}/></label>
              <label>Email<input required type="email" placeholder="student@example.com" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}/></label>
              <label>Course<select required value={studentForm.courseId} onChange={(e) => setStudentForm({ ...studentForm, courseId: e.target.value, feePaid: "0" })}><option value="">Select course</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
              <label>Enrollment Status<select value={studentForm.status} onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value })}><option>Active</option><option>Inactive</option><option>Graduated</option></select></label>
              <label>CGPA (0–10)<input type="number" min="0" max="10" step="0.01" placeholder="e.g. 8.5" value={studentForm.cgpa} onChange={(e) => setStudentForm({ ...studentForm, cgpa: e.target.value })}/></label>
              <label>Fees Paid (₹)<input type="number" min="0" step="1" value={studentForm.feePaid} onChange={(e) => setStudentForm({ ...studentForm, feePaid: e.target.value })}/></label>
              <div className="form-actions"><button type="submit"><Plus size={16}/>{editingStudent !== null ? "Update Student" : "Add Student"}</button>{editingStudent !== null && <button type="button" className="secondary-button" onClick={() => { setEditingStudent(null); setStudentForm(blankStudent); }}>Cancel</button>}</div>
            </form>
            <p className="hint">Fee status is calculated against the full course fee (fee per semester × number of semesters).</p>
          </section>
          <section className="panel"><div className="table-heading"><h2>Student Records ({filteredStudents.length})</h2><div className="student-filters"><input aria-label="Search students" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)}/><select aria-label="Filter by course" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}><option value="All">All Courses</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="All">All Statuses</option><option>Active</option><option>Inactive</option><option>Graduated</option></select></div></div>
            <div className="table-wrapper"><table><thead><tr><th>Name</th><th>Email</th><th>Course</th><th>Status</th><th>CGPA</th><th>Paid</th><th>Due</th><th>Fee Status</th><th>Actions</th></tr></thead><tbody>
              {filteredStudents.map((s) => <tr key={s.id}><td>{s.name}</td><td>{s.email}</td><td>{courseFor(s)?.name || s.courseId || "—"}</td><td><span className="status">{s.status}</span></td><td>{s.cgpa === "" || s.cgpa == null ? "—" : Number(s.cgpa).toFixed(2)}</td><td>{money(s.feePaid)}</td><td>{money(dueFor(s))}</td><td><span className={`fee-badge ${paidStatus(s) === "Paid" ? "paid" : "due"}`}>{paidStatus(s)}</span></td><td><div className="action-buttons"><button className="edit" onClick={() => editStudent(s)} aria-label={`Edit ${s.name}`}><Pencil size={15}/></button><button className="delete" onClick={() => deleteStudent(s.id)} aria-label={`Delete ${s.name}`}><Trash2 size={15}/></button></div></td></tr>)}
              {!filteredStudents.length && <tr><td colSpan="9">No students found.</td></tr>}
            </tbody></table></div>
          </section>
        </>}

        {page === "Courses" && <section className="panel"><h2>Course Management</h2><p className="chart-description">Set the semester fee and number of semesters for each course.</p>
          <form className="add-course-form" onSubmit={saveCourse}>
            <label>Course Name<input required placeholder="e.g. MSc Computer Science" value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}/></label>
            <label>Fee per Semester (₹)<input required type="number" min="1" step="1" placeholder="25000" value={courseForm.feePerSemester} onChange={(e) => setCourseForm({ ...courseForm, feePerSemester: e.target.value })}/></label>
            <label>Duration (Semesters)<input required type="number" min="1" max="20" step="1" placeholder="6" value={courseForm.semesters} onChange={(e) => setCourseForm({ ...courseForm, semesters: e.target.value })}/></label>
            <button type="submit"><Plus size={16}/> Add Course</button>
          </form>
          <div className="course-grid">{courseCounts.map((c) => <div className="course-card" key={c.id}><BookOpen size={27}/><h3>{c.name}</h3><p><strong>{c.count}</strong> students enrolled</p><p>Fee / semester: <strong>{money(c.feePerSemester)}</strong></p><p>Duration: <strong>{c.semesters} semesters</strong></p><p>Total course fee: <strong>{money(totalFee(c))}</strong></p><button className="delete course-delete" onClick={() => deleteCourse(c)}><Trash2 size={15}/> Delete Course</button></div>)}{!courses.length && <p>No courses yet. Add your first course above.</p>}</div>
        </section>}

        {page === "Statistics" && <>
          <section className="panel"><h2>Students by Course</h2><p className="chart-description">Share of all enrolled students by course</p><div className="enrollment-chart">{courseCounts.map((c) => { const pct = students.length ? c.count / students.length * 100 : 0; return <div className="chart-row" key={c.id}><span className="chart-label">{c.name}</span><div className="chart-track"><div className="chart-fill" style={{ width: `${pct}%` }}/></div><strong>{pct.toFixed(1)}%</strong></div>; })}</div></section>
          <section className="panel"><h2>Student CGPA Comparison</h2><p className="chart-description">CGPA out of 10 for students with recorded grades</p><div className="enrollment-chart">{students.filter((s) => s.cgpa !== "" && s.cgpa !== null && s.cgpa !== undefined && Number.isFinite(Number(s.cgpa))).map((s) => <div className="chart-row" key={s.id}><span className="chart-label student-chart-label" title={s.name}>{s.name}</span><div className="chart-track"><div className="chart-fill cgpa-fill" style={{ width: `${Math.max(0, Math.min(100, Number(s.cgpa) * 10))}%` }}/></div><strong>{Number(s.cgpa).toFixed(2)}</strong></div>)}{!students.some((s) => s.cgpa !== "" && s.cgpa != null) && <p>No CGPA data yet. Add a CGPA to a student to see the graph.</p>}</div></section>
          <section className="stats"><div className="stat-card"><span>Average CGPA</span><strong>{averageCgpa}</strong></div><div className="stat-card"><span>Fees Collected</span><strong className="money-stat">{money(collected)}</strong></div><div className="stat-card"><span>Fees Outstanding</span><strong className="money-stat">{money(outstanding)}</strong></div></section>
        </>}
      </main>
    </div>
  );
}
