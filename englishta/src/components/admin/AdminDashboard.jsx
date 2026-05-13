"use client";

import { useEffect, useMemo, useState } from "react";

const storageKey = "englishta-admin-dashboard";

const modules = [
  { key: "courses", label: "Courses", description: "Add, edit, and delete courses." },
  { key: "users", label: "Users", description: "View inquiries, joiners, and webinar registrations." },
  { key: "testimonials", label: "Testimonials", description: "Manage student reviews shown on the website." },
  { key: "videos", label: "Videos", description: "Add YouTube learning and demo videos." },
  { key: "webinars", label: "Webinars", description: "Manage live and recorded webinar sessions." },
];

const emptyForms = {
  courses: {
    name: "",
    shortDescription: "",
    longDescription: "",
    syllabus: "",
    allowBooking: "Yes",
    price: "",
    studentsEnrolled: "",
  },
  users: {
    name: "",
    email: "",
    phone: "",
    source: "Inquiry",
    course: "",
    status: "New",
  },
  testimonials: {
    studentName: "",
    course: "",
    rating: "5",
    review: "",
    visible: "Yes",
  },
  videos: {
    title: "",
    youtubeUrl: "",
    category: "Learning",
    visible: "Yes",
  },
  webinars: {
    title: "",
    type: "Live",
    dateTime: "",
    link: "",
    description: "",
  },
};

const starterData = {
  courses: [
    {
      id: "course-1",
      name: "Spoken English Mastery",
      shortDescription: "Daily speaking practice for beginners and intermediate learners.",
      longDescription: "A structured spoken English program with grammar, pronunciation, fluency, and confidence work.",
      syllabus: "Grammar basics, vocabulary, pronunciation, interview speaking",
      allowBooking: "Yes",
      price: "999",
      studentsEnrolled: "128",
    },
  ],
  users: [
    {
      id: "user-1",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 98765 43210",
      source: "Course Joiner",
      course: "Spoken English Mastery",
      status: "Enrolled",
    },
  ],
  testimonials: [
    {
      id: "testimonial-1",
      studentName: "Amit Patil",
      course: "Spoken English Mastery",
      rating: "5",
      review: "The classes helped me speak with more confidence in interviews.",
      visible: "Yes",
    },
  ],
  videos: [
    {
      id: "video-1",
      title: "English Speaking Demo Class",
      youtubeUrl: "https://youtube.com/watch?v=demo",
      category: "Demo",
      visible: "Yes",
    },
  ],
  webinars: [
    {
      id: "webinar-1",
      title: "How to Speak English Confidently",
      type: "Live",
      dateTime: "2026-05-20T18:00",
      link: "https://meet.google.com/demo",
      description: "A live webinar for students who want to improve speaking confidence.",
    },
  ],
};

const columns = {
  courses: [
    ["name", "Course"],
    ["shortDescription", "Short Description"],
    ["allowBooking", "Booking"],
    ["price", "Starting From"],
    ["studentsEnrolled", "Students"],
  ],
  users: [
    ["name", "Name"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["source", "Source"],
    ["status", "Status"],
  ],
  testimonials: [
    ["studentName", "Student"],
    ["course", "Course"],
    ["rating", "Rating"],
    ["review", "Review"],
    ["visible", "Visible"],
  ],
  videos: [
    ["title", "Title"],
    ["youtubeUrl", "YouTube URL"],
    ["category", "Category"],
    ["visible", "Visible"],
  ],
  webinars: [
    ["title", "Title"],
    ["type", "Type"],
    ["dateTime", "Date & Time"],
    ["link", "Link"],
  ],
};

function loadData() {
  if (typeof window === "undefined") return starterData;

  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return starterData;

  try {
    return { ...starterData, ...JSON.parse(saved) };
  } catch {
    return starterData;
  }
}

function makeId(moduleKey) {
  return `${moduleKey}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function AdminDashboard() {
  const [activeModule, setActiveModule] = useState("courses");
  const [data, setData] = useState(starterData);
  const [form, setForm] = useState(emptyForms.courses);
  const [editingId, setEditingId] = useState(null);
  const activeConfig = modules.find((item) => item.key === activeModule);

  useEffect(() => {
    setData(loadData());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    setForm(emptyForms[activeModule]);
    setEditingId(null);
  }, [activeModule]);

  const stats = useMemo(
    () =>
      modules.map((module) => ({
        ...module,
        count: data[module.key]?.length ?? 0,
      })),
    [data],
  );

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForms[activeModule]);
    setEditingId(null);
  }

  function saveItem(event) {
    event.preventDefault();

    setData((current) => {
      const list = current[activeModule] ?? [];
      const nextItem = {
        ...form,
        id: editingId ?? makeId(activeModule),
      };

      return {
        ...current,
        [activeModule]: editingId
          ? list.map((item) => (item.id === editingId ? nextItem : item))
          : [nextItem, ...list],
      };
    });

    resetForm();
  }

  function editItem(item) {
    setForm(
      Object.keys(emptyForms[activeModule]).reduce(
        (next, key) => ({
          ...next,
          [key]: item[key] ?? "",
        }),
        {},
      ),
    );
    setEditingId(item.id);
  }

  function deleteItem(id) {
    setData((current) => ({
      ...current,
      [activeModule]: current[activeModule].filter((item) => item.id !== id),
    }));

    if (editingId === id) resetForm();
  }

  return (
    <div className="adminShell">
      <div className="adminLayout">
        <aside className="adminSidebar">
          <div className="adminBrand">
            <img src="/assets/images/logo/logoenglishta.png" alt="EnglishTa" />
            <div>
              <strong>EnglishTa</strong>
              <span>Admin Dashboard</span>
            </div>
          </div>

          <nav className="adminNav" aria-label="Admin modules">
            {modules.map((module) => (
              <button
                type="button"
                className={module.key === activeModule ? "isActive" : ""}
                onClick={() => setActiveModule(module.key)}
                key={module.key}
              >
                <span>{module.label}</span>
                <span>{data[module.key]?.length ?? 0}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="adminMain">
          <header className="adminTopbar">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage courses, users, testimonials, videos, and webinars from one place.</p>
            </div>
            <div className="adminActions">
              <a className="adminButton adminButtonGhost" href="/">
                View Website
              </a>
            </div>
          </header>

          <section className="adminStatGrid" aria-label="Dashboard counts">
            {stats.map((stat) => (
              <div className="adminStatCard" key={stat.key}>
                <span>{stat.label}</span>
                <strong>{stat.count}</strong>
              </div>
            ))}
          </section>

          <section className="adminPanel">
            <div className="adminPanelHeader">
              <div>
                <h2>{activeConfig.label} Management</h2>
                <p>{activeConfig.description}</p>
              </div>
              <button type="button" className="adminButton adminButtonAlt" onClick={resetForm}>
                New {activeConfig.label.slice(0, -1)}
              </button>
            </div>

            <AdminForm
              moduleKey={activeModule}
              form={form}
              editingId={editingId}
              onChange={updateField}
              onSubmit={saveItem}
              onCancel={resetForm}
            />

            <AdminTable
              moduleKey={activeModule}
              items={data[activeModule] ?? []}
              onEdit={editItem}
              onDelete={deleteItem}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

function AdminForm({ moduleKey, form, editingId, onChange, onSubmit, onCancel }) {
  const fields = {
    courses: [
      ["name", "Course Name", "input"],
      ["price", "Starting From Pricing", "input"],
      ["studentsEnrolled", "Students Enrolled", "input"],
      ["allowBooking", "Allow Booking Option", "select", ["Yes", "No"]],
      ["shortDescription", "Short Description", "textarea", "adminFull"],
      ["longDescription", "Long Description", "textarea", "adminFull"],
      ["syllabus", "Syllabus (Optional)", "textarea", "adminFull"],
    ],
    users: [
      ["name", "User Name", "input"],
      ["email", "Email", "input"],
      ["phone", "Phone", "input"],
      ["source", "User Type", "select", ["Inquiry", "Course Joiner", "Webinar Registration"]],
      ["course", "Course / Webinar", "input"],
      ["status", "Status", "select", ["New", "Contacted", "Enrolled", "Closed"]],
    ],
    testimonials: [
      ["studentName", "Student Name", "input"],
      ["course", "Course", "input"],
      ["rating", "Rating", "select", ["5", "4", "3", "2", "1"]],
      ["visible", "Display on Website", "select", ["Yes", "No"]],
      ["review", "Review", "textarea", "adminFull"],
    ],
    videos: [
      ["title", "Video Title", "input"],
      ["youtubeUrl", "YouTube URL", "input"],
      ["category", "Category", "select", ["Learning", "Demo", "Testimonial"]],
      ["visible", "Display on Website", "select", ["Yes", "No"]],
    ],
    webinars: [
      ["title", "Webinar Title", "input"],
      ["type", "Webinar Type", "select", ["Live", "Recorded"]],
      ["dateTime", "Date & Time", "datetime-local"],
      ["link", "Webinar / Recording Link", "input"],
      ["description", "Details", "textarea", "adminFull"],
    ],
  };

  return (
    <form className="adminForm" onSubmit={onSubmit}>
      {fields[moduleKey].map(([name, label, type, optionsOrClass, maybeClass]) => {
        const options = Array.isArray(optionsOrClass) ? optionsOrClass : null;
        const fieldClass = typeof optionsOrClass === "string" ? optionsOrClass : maybeClass;

        return (
          <div className={`adminField ${fieldClass ?? ""}`} key={name}>
            <label htmlFor={name}>{label}</label>
            {type === "textarea" ? (
              <textarea id={name} value={form[name]} onChange={(event) => onChange(name, event.target.value)} />
            ) : type === "select" ? (
              <select id={name} value={form[name]} onChange={(event) => onChange(name, event.target.value)}>
                {options.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={name}
                type={type}
                value={form[name]}
                onChange={(event) => onChange(name, event.target.value)}
                required={name !== "syllabus"}
              />
            )}
          </div>
        );
      })}
      <div className="adminActions adminFull">
        <button type="submit" className="adminButton">
          {editingId ? "Update" : "Add"} Record
        </button>
        {editingId ? (
          <button type="button" className="adminButton adminButtonGhost" onClick={onCancel}>
            Cancel Edit
          </button>
        ) : null}
      </div>
    </form>
  );
}

function AdminTable({ moduleKey, items, onEdit, onDelete }) {
  if (!items.length) {
    return <div className="adminEmpty">No records yet. Add the first one above.</div>;
  }

  return (
    <div className="adminTableWrap">
      <table className="adminTable">
        <thead>
          <tr>
            {columns[moduleKey].map(([, label]) => (
              <th key={label}>{label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {columns[moduleKey].map(([key]) => (
                <td key={key}>
                  {["allowBooking", "visible", "status", "type"].includes(key) ? (
                    <span className="adminBadge">{item[key]}</span>
                  ) : (
                    item[key]
                  )}
                </td>
              ))}
              <td>
                <div className="adminActions">
                  <button type="button" className="adminButton adminButtonGhost" onClick={() => onEdit(item)}>
                    Edit
                  </button>
                  <button type="button" className="adminButton adminButtonDanger" onClick={() => onDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
