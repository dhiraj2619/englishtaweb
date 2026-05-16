"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const storageKey = "englishta-admin-dashboard";

const modules = [
  { key: "dashboard", label: "Dashboard", description: "Track courses, webinars, enrollments, and inquiries." },
  { key: "courses", label: "Courses", description: "Add, edit, and delete courses." },
  { key: "users", label: "Leads", description: "Auto-captured course inquiries and webinar registrations." },
  { key: "testimonials", label: "Testimonials", description: "Manage student reviews shown on the website." },
  { key: "videos", label: "Videos", description: "Add YouTube learning and demo videos." },
  { key: "webinars", label: "Webinars", description: "Manage live and recorded webinar sessions." },
];

const emptyForms = {
  dashboard: {},
  courses: {
    name: "",
    thumbnail: "",
    shortDescription: "",
    longDescription: "",
    syllabus: "",
    allowBooking: "Yes",
    price: "",
    studentsEnrolled: "",
  },
  users: {
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
    youtubeIframe: "",
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
  dashboard: [],
  courses: [
    {
      _id: "course-1",
      name: "Spoken English Mastery",
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Daily speaking practice for beginners and intermediate learners.",
      longDescription: "A structured spoken English program with grammar, pronunciation, fluency, and confidence work.",
      syllabus: "Grammar basics, vocabulary, pronunciation, interview speaking",
      allowBooking: "Yes",
      price: "999",
      studentsEnrolled: "128",
    },
  ],
  users: [],
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
      _id: "video-1",
      title: "English Speaking Demo Class",
      youtubeIframe:
        '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="English Speaking Demo Class"></iframe>',
      visible: "Yes",
    },
  ],
  webinars: [
    {
      _id: "webinar-1",
      title: "How to Speak English Confidently",
      type: "Live",
      dateTime: "2026-05-20T18:00",
      link: "https://meet.google.com/demo",
      description: "A live webinar for students who want to improve speaking confidence.",
    },
  ],
};

const columns = {
  dashboard: [],
  courses: [
    ["name", "Course"],
    ["thumbnail", "Thumbnail"],
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
    ["course", "Course / Webinar"],
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
    ["youtubeIframe", "YouTube Thumbnail"],
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
  const [activeModule, setActiveModule] = useState("dashboard");
  const [data, setData] = useState(loadData);
  const [form, setForm] = useState(emptyForms.dashboard);
  const [editingId, setEditingId] = useState(null);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState("");
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosError, setVideosError] = useState("");
  const [webinarsLoading, setWebinarsLoading] = useState(false);
  const [webinarsError, setWebinarsError] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [dashboardError, setDashboardError] = useState("");
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailUploadError, setThumbnailUploadError] = useState("");
  const activeConfig = modules.find((item) => item.key === activeModule);

  const stats = useMemo(
    () => [
      { key: "coursesCount", label: "Courses", count: dashboardStats?.coursesCount ?? data.courses?.length ?? 0 },
      {
        key: "webinarsCount",
        label: "Webinars",
        count: dashboardStats?.webinarsCount ?? data.webinars?.length ?? 0,
      },
      {
        key: "courseInquiryCount",
        label: "Course Inquiries",
        count: dashboardStats?.courseInquiryCount ?? 0,
      },
      {
        key: "webinarRegistrationCount",
        label: "Webinar Students",
        count: dashboardStats?.webinarRegistrationCount ?? 0,
      },
      {
        key: "courseEnrollmentCount",
        label: "Course Enrollments",
        count: dashboardStats?.courseEnrollmentCount ?? 0,
      },
    ],
    [dashboardStats, data.courses?.length, data.webinars?.length],
  );

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function selectModule(moduleKey) {
    setActiveModule(moduleKey);
    setForm(emptyForms[moduleKey]);
    setEditingId(null);
    setThumbnailUploadError("");
    setVideosError("");
    setWebinarsError("");
    setUsersError("");
  }

  async function fetchCourses() {
    setCoursesLoading(true);
    setCoursesError("");

    try {
      const response = await fetch("/api/courses", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load courses.");
      }

      setData((current) => ({
        ...current,
        courses: payload.data,
      }));
    } catch (error) {
      setCoursesError(error.message || "Failed to load courses.");
    } finally {
      setCoursesLoading(false);
    }
  }

  async function fetchVideos() {
    setVideosLoading(true);
    setVideosError("");

    try {
      const response = await fetch("/api/youtube-videos", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load YouTube videos.");
      }

      setData((current) => ({
        ...current,
        videos: payload.data,
      }));
    } catch (error) {
      setVideosError(error.message || "Failed to load YouTube videos.");
    } finally {
      setVideosLoading(false);
    }
  }

  async function fetchWebinars() {
    setWebinarsLoading(true);
    setWebinarsError("");

    try {
      const response = await fetch("/api/webinars", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load webinars.");
      }

      setData((current) => ({
        ...current,
        webinars: payload.data,
      }));
    } catch (error) {
      setWebinarsError(error.message || "Failed to load webinars.");
    } finally {
      setWebinarsLoading(false);
    }
  }

  async function fetchUsers() {
    setUsersLoading(true);
    setUsersError("");

    try {
      const response = await fetch("/api/leads", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load leads.");
      }

      setData((current) => ({
        ...current,
        users: payload.data,
      }));
    } catch (error) {
      setUsersError(error.message || "Failed to load leads.");
    } finally {
      setUsersLoading(false);
    }
  }

  async function fetchDashboardStats() {
    setDashboardError("");

    try {
      const response = await fetch("/api/admin/stats", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load dashboard stats.");
      }

      setDashboardStats(payload.data);
    } catch (error) {
      setDashboardError(error.message || "Failed to load dashboard stats.");
    }
  }

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      fetchCourses();
      fetchVideos();
      fetchWebinars();
      fetchUsers();
      fetchDashboardStats();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data]);

  function resetForm() {
    setForm(emptyForms[activeModule]);
    setEditingId(null);
    setThumbnailUploadError("");
    setVideosError("");
    setWebinarsError("");
    setUsersError("");
  }

  async function uploadCourseThumbnail(file) {
    if (!file) {
      return;
    }

    setThumbnailUploading(true);
    setThumbnailUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/uploads/course-thumbnail", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to upload thumbnail.");
      }

      setForm((current) => ({
        ...current,
        thumbnail: payload.data.url,
      }));
    } catch (error) {
      setThumbnailUploadError(error.message || "Failed to upload thumbnail.");
    } finally {
      setThumbnailUploading(false);
    }
  }

  async function saveItem(event) {
    event.preventDefault();

    if (activeModule === "courses") {
      try {
        setCoursesError("");

        if (!form.thumbnail) {
          throw new Error("Please upload a course thumbnail first.");
        }

        const response = await fetch(editingId ? `/api/courses/${editingId}` : "/api/courses", {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Failed to save course.");
        }

        setData((current) => {
          const list = current.courses ?? [];

          return {
            ...current,
            courses: editingId
              ? list.map((item) => ((item._id ?? item.id) === editingId ? payload.data : item))
              : [payload.data, ...list],
          };
        });

        resetForm();
        await fetchDashboardStats();
      } catch (error) {
        setCoursesError(error.message || "Failed to save course.");
      }

      return;
    }

    if (activeModule === "videos") {
      try {
        setVideosError("");

        const response = await fetch(editingId ? `/api/youtube-videos/${editingId}` : "/api/youtube-videos", {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Failed to save YouTube video.");
        }

        setData((current) => {
          const list = current.videos ?? [];

          return {
            ...current,
            videos: editingId
              ? list.map((item) => ((item._id ?? item.id) === editingId ? payload.data : item))
              : [payload.data, ...list],
          };
        });

        resetForm();
        await fetchVideos();
      } catch (error) {
        setVideosError(error.message || "Failed to save YouTube video.");
      }

      return;
    }

    if (activeModule === "webinars") {
      try {
        setWebinarsError("");

        const response = await fetch(editingId ? `/api/webinars/${editingId}` : "/api/webinars", {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Failed to save webinar.");
        }

        setData((current) => {
          const list = current.webinars ?? [];

          return {
            ...current,
            webinars: editingId
              ? list.map((item) => ((item._id ?? item.id) === editingId ? payload.data : item))
              : [payload.data, ...list],
          };
        });

        resetForm();
        await fetchWebinars();
        await fetchDashboardStats();
      } catch (error) {
        setWebinarsError(error.message || "Failed to save webinar.");
      }

      return;
    }

    if (activeModule === "dashboard" || activeModule === "users") {
      return;
    }

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
    setEditingId(item._id ?? item.id);
  }

  async function deleteItem(id) {
    if (activeModule === "courses") {
      try {
        setCoursesError("");

        const response = await fetch(`/api/courses/${id}`, {
          method: "DELETE",
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Failed to delete course.");
        }

        setData((current) => ({
          ...current,
          courses: current.courses.filter((item) => (item._id ?? item.id) !== id),
        }));

        if (editingId === id) {
          resetForm();
        }

        await fetchDashboardStats();
      } catch (error) {
        setCoursesError(error.message || "Failed to delete course.");
      }

      return;
    }

    if (activeModule === "videos") {
      const confirmed = window.confirm("Delete this YouTube video?");

      if (!confirmed) {
        return;
      }

      try {
        setVideosError("");

        const response = await fetch(`/api/youtube-videos/${id}`, {
          method: "DELETE",
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Failed to delete YouTube video.");
        }

        setData((current) => ({
          ...current,
          videos: current.videos.filter((item) => (item._id ?? item.id) !== id),
        }));

        if (editingId === id) {
          resetForm();
        }

        await fetchVideos();
      } catch (error) {
        setVideosError(error.message || "Failed to delete YouTube video.");
      }

      return;
    }

    if (activeModule === "webinars") {
      const confirmed = window.confirm("Delete this webinar?");

      if (!confirmed) {
        return;
      }

      try {
        setWebinarsError("");

        const response = await fetch(`/api/webinars/${id}`, {
          method: "DELETE",
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Failed to delete webinar.");
        }

        setData((current) => ({
          ...current,
          webinars: current.webinars.filter((item) => (item._id ?? item.id) !== id),
        }));

        if (editingId === id) {
          resetForm();
        }

        await fetchWebinars();
        await fetchDashboardStats();
      } catch (error) {
        setWebinarsError(error.message || "Failed to delete webinar.");
      }

      return;
    }

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
                onClick={() => selectModule(module.key)}
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
              <button
                type="button"
                className="adminButton"
                onClick={async () => {
                  await fetch("/api/admin/logout", { method: "POST" });
                  window.location.href = "/admin/login";
                }}
              >
                Logout
              </button>
              <Link className="adminButton adminButtonGhost" href="/">
                View Website
              </Link>
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
              {activeModule !== "dashboard" && activeModule !== "users" ? (
                <button type="button" className="adminButton adminButtonAlt" onClick={resetForm}>
                  {activeModule === "videos" ? "New YouTube Video" : `New ${activeConfig.label.slice(0, -1)}`}
                </button>
              ) : null}
            </div>

            {activeModule === "dashboard" ? (
              <DashboardOverview stats={stats} error={dashboardError} />
            ) : null}

            {activeModule !== "dashboard" && activeModule !== "users" ? (
              <AdminForm
                moduleKey={activeModule}
                form={form}
                editingId={editingId}
                onChange={updateField}
                onSubmit={saveItem}
                onCancel={resetForm}
                onThumbnailUpload={uploadCourseThumbnail}
                thumbnailUploading={thumbnailUploading}
                thumbnailUploadError={thumbnailUploadError}
              />
            ) : null}

            {activeModule === "courses" && coursesError ? <div className="adminEmpty">{coursesError}</div> : null}
            {activeModule === "videos" && videosError ? <div className="adminEmpty">{videosError}</div> : null}
            {activeModule === "webinars" && webinarsError ? <div className="adminEmpty">{webinarsError}</div> : null}
            {activeModule === "users" && usersError ? <div className="adminEmpty">{usersError}</div> : null}

            {activeModule !== "dashboard" ? (
              <AdminTable
                moduleKey={activeModule}
                items={data[activeModule] ?? []}
                onEdit={editItem}
                onDelete={deleteItem}
                loading={
                  (activeModule === "courses" && coursesLoading) ||
                  (activeModule === "videos" && videosLoading) ||
                  (activeModule === "webinars" && webinarsLoading) ||
                  (activeModule === "users" && usersLoading)
                }
              />
            ) : null}
          </section>
        </main>
      </div>
    </div>
  );
}

function AdminForm({
  moduleKey,
  form,
  editingId,
  onChange,
  onSubmit,
  onCancel,
  onThumbnailUpload,
  thumbnailUploading,
  thumbnailUploadError,
}) {
  const fields = {
    dashboard: [],
    courses: [
      ["name", "Course Name", "input"],
      ["price", "Starting From Pricing", "input"],
      ["studentsEnrolled", "Students Enrolled", "input"],
      ["allowBooking", "Allow Booking Option", "select", ["Yes", "No"]],
      ["shortDescription", "Short Description", "textarea", "adminFull"],
      ["longDescription", "Long Description", "richtext", "adminFull"],
      ["syllabus", "Syllabus (Optional)", "richtext", "adminFull"],
    ],
    users: [],
    testimonials: [
      ["studentName", "Student Name", "input"],
      ["course", "Course", "input"],
      ["rating", "Rating", "select", ["5", "4", "3", "2", "1"]],
      ["visible", "Display on Website", "select", ["Yes", "No"]],
      ["review", "Review", "textarea", "adminFull"],
    ],
    videos: [
      ["title", "Video Title", "input"],
      ["youtubeIframe", "YouTube Iframe Embed Code", "textarea", "adminFull"],
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
      {moduleKey === "courses" ? (
        <div className="adminField adminFull">
          <label htmlFor="thumbnailFile">Course Thumbnail</label>
          <input
            id="thumbnailFile"
            type="file"
            accept="image/*"
            onChange={(event) => onThumbnailUpload?.(event.target.files?.[0])}
          />
          {thumbnailUploading ? <small>Uploading thumbnail...</small> : null}
          {thumbnailUploadError ? <small>{thumbnailUploadError}</small> : null}
          {form.thumbnail ? (
            <div style={{ marginTop: "12px" }}>
              <img
                src={form.thumbnail}
                alt="Course thumbnail preview"
                style={{ width: "180px", height: "110px", objectFit: "cover", borderRadius: "10px" }}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {fields[moduleKey].map(([name, label, type, optionsOrClass, maybeClass]) => {
        const options = Array.isArray(optionsOrClass) ? optionsOrClass : null;
        const fieldClass = typeof optionsOrClass === "string" ? optionsOrClass : maybeClass;

        return (
          <div className={`adminField ${fieldClass ?? ""}`} key={name}>
            <label htmlFor={name}>{label}</label>
            {type === "textarea" ? (
              <textarea id={name} value={form[name]} onChange={(event) => onChange(name, event.target.value)} />
            ) : type === "richtext" ? (
              <RichTextEditor id={name} value={form[name]} onChange={(value) => onChange(name, value)} />
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

function DashboardOverview({ stats, error }) {
  return (
    <div className="adminDashboardOverview">
      {error ? <div className="adminEmpty">{error}</div> : null}
      <div className="adminDashboardOverview__grid">
        {stats.map((stat) => (
          <article className="adminDashboardOverview__card" key={stat.key}>
            <span>{stat.label}</span>
            <strong>{stat.count}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}

function RichTextEditor({ id, value, onChange }) {
  const [editorModules, setEditorModules] = useState(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      import("@ckeditor/ckeditor5-react"),
      import("@ckeditor/ckeditor5-build-classic/build/ckeditor"),
    ])
      .then(([ckeditorModule, editorModule]) => {
        if (!isMounted) {
          return;
        }

        setEditorModules({
          CKEditor: ckeditorModule.CKEditor,
          ClassicEditor: editorModule.default || editorModule,
        });
      })
      .catch(() => {
        if (isMounted) {
          setEditorModules({ error: true });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (editorModules?.error) {
    return <div className="adminEmpty">CKEditor failed to load.</div>;
  }

  if (!editorModules) {
    return <div className="adminEmpty">Loading editor...</div>;
  }

  const { CKEditor, ClassicEditor } = editorModules;

  return (
    <div className="adminRichText">
      <CKEditor
        editor={ClassicEditor}
        data={value || ""}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "blockQuote",
            "undo",
            "redo",
          ],
        }}
        onChange={(_event, editor) => {
          onChange(editor.getData());
        }}
      />
      <input id={id} type="hidden" value={value || ""} readOnly />
    </div>
  );
}

function AdminTable({ moduleKey, items, onEdit, onDelete, loading }) {
  if (loading) {
    return <div className="adminEmpty">Loading records...</div>;
  }

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
            {moduleKey !== "users" ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id ?? item.id}>
              {columns[moduleKey].map(([key]) => (
                <td key={key}>
                  {key === "thumbnail" ? (
                    <img
                      src={item[key]}
                      alt={item.name ?? "Course thumbnail"}
                      style={{ width: "72px", height: "48px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  ) : key === "youtubeIframe" ? (
                    <div className="adminYoutubePreview" dangerouslySetInnerHTML={{ __html: item[key] }} />
                  ) : key === "phone" ? (
                    item.phone || item.mobile
                  ) : ["allowBooking", "visible", "status", "type"].includes(key) ? (
                    <span className="adminBadge">{item[key]}</span>
                  ) : (
                    item[key]
                  )}
                </td>
              ))}
              {moduleKey !== "users" ? (
                <td>
                  <div className="adminActions">
                    <button type="button" className="adminButton adminButtonGhost" onClick={() => onEdit(item)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="adminButton adminButtonDanger"
                      onClick={() => onDelete(item._id ?? item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
