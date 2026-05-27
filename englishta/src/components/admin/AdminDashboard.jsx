"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const storageKey = "englishta-admin-dashboard";

const modules = [
  { key: "dashboard", label: "Dashboard", description: "Track courses, webinars, enrollments, and inquiries." },
  { key: "courses", label: "Courses", description: "Add, edit, and delete courses." },
  { key: "webinarLeads", label: "Webinar Leads", description: "Auto-captured webinar registrations from the website." },
  { key: "courseLeads", label: "Course Leads", description: "Auto-captured course enquiries and demo requests from the website." },
  { key: "users", label: "Users", description: "View registered students from the website." },
  { key: "batches", label: "Batches", description: "Create batches and assign students." },
  { key: "reviews", label: "Reviews", description: "Manage testimonials and WhatsApp review screenshots." },
  { key: "demoLecture", label: "Demo Lecture Video", description: "Manage the single demo lecture video shown on the website." },
  { key: "videos", label: "Videos", description: "Add YouTube learning and demo videos." },
  { key: "webinars", label: "Webinars", description: "Manage live and recorded webinar sessions." },
];

const reviewTabs = [
  { key: "testimonials", label: "Testimonials" },
  { key: "whatsappReviews", label: "WhatsApp Reviews" },
];

const emptyForms = {
  dashboard: {},
  courses: {
    name: "",
    courseMode: "live",
    thumbnail: "",
    shortDescription: "",
    longDescription: "",
    syllabus: "",
    timeline: "",
    languages: ["marathi", "hindi", "english"],
    allowBooking: "Yes",
    price: "",
    studentsEnrolled: "",
    visible: "Yes",
  },
  webinarLeads: {
    status: "New",
  },
  courseLeads: {
    status: "New",
  },
  users: {},
  batches: {
    name: "",
    studentIds: [],
  },
  testimonials: {
    studentName: "",
    course: "",
    rating: "5",
    review: "",
    visible: "Yes",
  },
  whatsappReviews: {
    image: "",
    displayOrder: "1",
    visible: "Yes",
  },
  demoLecture: {
    youtubeEmbedCode: "",
    thumbnail: "",
  },
  videos: {
    title: "",
    youtubeIframe: "",
    visible: "Yes",
  },
  webinars: {
    title: "",
    thumbnail: "",
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
      name: "Beginners-Promise Batch",
      courseMode: "live",
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Perfect for beginners who hesitate while speaking English.",
      longDescription: "A structured spoken English program with grammar, pronunciation, fluency, and confidence work.",
      syllabus: "Grammar basics, vocabulary, pronunciation, interview speaking",
      timeline: "8 weeks live online training with guided speaking practice.",
      languages: ["marathi", "hindi", "english"],
      allowBooking: "Yes",
      price: "999",
      studentsEnrolled: "128",
      visible: "Yes",
    },
  ],
  webinarLeads: [],
  courseLeads: [],
  users: [],
  batches: [],
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
  whatsappReviews: [],
  demoLecture: [],
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
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      type: "Live",
      dateTime: "2026-05-20T18:00",
      link: "https://meet.google.com/demo",
      description: "A live webinar for students who want to improve speaking confidence.",
      registrationsCount: 0,
    },
  ],
};

const columns = {
  dashboard: [],
  courses: [
    ["name", "Course"],
    ["courseMode", "Mode"],
    ["shortDescription", "Short Description"],
    ["visible", "Visible"],
    ["allowBooking", "Booking"],
  ],
  webinarLeads: [
    ["name", "Name"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["course", "Webinar"],
    ["preferredLanguage", "Language"],
    ["occupation", "Occupation"],
    ["city", "City"],
    ["status", "Status"],
  ],
  courseLeads: [
    ["name", "Name"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["course", "Course"],
    ["preferredLanguage", "Language"],
    ["occupation", "Occupation"],
    ["city", "City"],
    ["status", "Status"],
  ],
  users: [
    ["name", "Name"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["authProvider", "Provider"],
    ["createdAt", "Registered On"],
    ["lastLoginAt", "Last Login"],
  ],
  batches: [
    ["name", "Batch Name"],
    ["studentIds", "Assigned Students"],
    ["createdAt", "Created On"],
  ],
  testimonials: [
    ["studentName", "Student"],
    ["course", "Course"],
    ["rating", "Rating"],
    ["review", "Review"],
    ["visible", "Visible"],
  ],
  whatsappReviews: [
    ["image", "Image"],
    ["displayOrder", "Order"],
    ["visible", "Visible"],
  ],
  demoLecture: [
    ["thumbnail", "Thumbnail"],
    ["youtubeEmbedCode", "YouTube Embed Code"],
  ],
  videos: [
    ["title", "Title"],
    ["youtubeIframe", "YouTube Thumbnail"],
    ["visible", "Visible"],
  ],
  webinars: [
    ["title", "Title"],
    ["thumbnail", "Thumbnail"],
    ["type", "Type"],
    ["dateTime", "Date & Time"],
    ["link", "Link"],
    ["registrationsCount", "Registered Users"],
  ],
};

const languageLabels = {
  english: "English",
  hindi: "Hindi",
  marathi: "Marathi",
};

const courseModeLabels = {
  live: "Live Courses",
  recorded: "Recorded Courses",
  audio: "Audio Course",
  progress: "Check Your Progress",
};

function normalizeCourseRecord(course) {
  return {
    ...course,
    courseMode: course.courseMode || "live",
    timeline: course.timeline || "",
    languages: Array.isArray(course.languages) && course.languages.length ? course.languages : ["marathi", "hindi", "english"],
    visible: course.visible || "Yes",
  };
}

function normalizeDemoLectureRecord(video) {
  return {
    ...video,
    youtubeEmbedCode: video.youtubeEmbedCode || video.youtubeUrl || "",
    thumbnail: video.thumbnail || "",
  };
}

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
  const [activeReviewTab, setActiveReviewTab] = useState("testimonials");
  const [data, setData] = useState(loadData);
  const [form, setForm] = useState(emptyForms.dashboard);
  const [editingId, setEditingId] = useState(null);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState("");
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosError, setVideosError] = useState("");
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testimonialsError, setTestimonialsError] = useState("");
  const [whatsappReviewsLoading, setWhatsappReviewsLoading] = useState(false);
  const [whatsappReviewsError, setWhatsappReviewsError] = useState("");
  const [demoLectureLoading, setDemoLectureLoading] = useState(false);
  const [demoLectureError, setDemoLectureError] = useState("");
  const [webinarsLoading, setWebinarsLoading] = useState(false);
  const [webinarsError, setWebinarsError] = useState("");
  const [webinarLeadsLoading, setWebinarLeadsLoading] = useState(false);
  const [webinarLeadsError, setWebinarLeadsError] = useState("");
  const [courseLeadsLoading, setCourseLeadsLoading] = useState(false);
  const [courseLeadsError, setCourseLeadsError] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [batchesError, setBatchesError] = useState("");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [dashboardError, setDashboardError] = useState("");
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailUploadError, setThumbnailUploadError] = useState("");
  const [toast, setToast] = useState(null);
  const currentModule = activeModule === "reviews" ? activeReviewTab : activeModule;
  const activeConfig = modules.find((item) => item.key === activeModule);
  const demoLectureExists = (data.demoLecture ?? []).length > 0;
  const canCreateRecord =
    currentModule !== "demoLecture" || !demoLectureExists || Boolean(editingId);
  const showRecordForm =
    currentModule !== "dashboard" &&
    currentModule !== "webinarLeads" &&
    currentModule !== "courseLeads" &&
    currentModule !== "users" &&
    canCreateRecord;

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
        key: "whatsAppReviewCount",
        label: "WhatsApp Reviews",
        count: dashboardStats?.whatsAppReviewCount ?? data.whatsappReviews?.length ?? 0,
      },
      {
        key: "demoLectureCount",
        label: "Demo Lecture",
        count: data.demoLecture?.length ?? 0,
      },
      {
        key: "courseEnrollmentCount",
        label: "Course Enrollments",
        count: dashboardStats?.courseEnrollmentCount ?? 0,
      },
      {
        key: "usersCount",
        label: "Registered Users",
        count: data.users?.length ?? 0,
      },
      {
        key: "batchesCount",
        label: "Batches",
        count: data.batches?.length ?? 0,
      },
    ],
    [
      dashboardStats,
      data.courses?.length,
      data.webinars?.length,
      data.whatsappReviews?.length,
      data.demoLecture?.length,
      data.users?.length,
      data.batches?.length,
    ],
  );

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function showToast(type, message) {
    setToast({ type, message });
  }

  function selectModule(moduleKey) {
    setActiveModule(moduleKey);
    if (moduleKey === "reviews") {
      setActiveReviewTab("testimonials");
      setForm(emptyForms.testimonials);
    } else {
      setForm(emptyForms[moduleKey]);
    }
    setEditingId(null);
    setThumbnailUploadError("");
    setVideosError("");
    setTestimonialsError("");
    setWhatsappReviewsError("");
    setDemoLectureError("");
    setWebinarsError("");
    setWebinarLeadsError("");
    setCourseLeadsError("");
    setUsersError("");
    setBatchesError("");
  }

  function selectReviewTab(tabKey) {
    setActiveReviewTab(tabKey);
    setForm(emptyForms[tabKey]);
    setEditingId(null);
    setThumbnailUploadError("");
    setVideosError("");
    setTestimonialsError("");
    setWhatsappReviewsError("");
    setDemoLectureError("");
    setWebinarsError("");
    setWebinarLeadsError("");
    setCourseLeadsError("");
    setUsersError("");
    setBatchesError("");
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
        courses: (payload.data ?? []).map(normalizeCourseRecord),
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

  async function fetchTestimonials() {
    setTestimonialsLoading(true);
    setTestimonialsError("");

    try {
      const response = await fetch("/api/testimonials", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load testimonials.");
      }

      setData((current) => ({
        ...current,
        testimonials: payload.data,
      }));
    } catch (error) {
      setTestimonialsError(error.message || "Failed to load testimonials.");
    } finally {
      setTestimonialsLoading(false);
    }
  }

  async function fetchWhatsappReviews() {
    setWhatsappReviewsLoading(true);
    setWhatsappReviewsError("");

    try {
      const response = await fetch("/api/whatsapp-reviews", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load WhatsApp reviews.");
      }

      setData((current) => ({
        ...current,
        whatsappReviews: payload.data,
      }));
    } catch (error) {
      setWhatsappReviewsError(error.message || "Failed to load WhatsApp reviews.");
    } finally {
      setWhatsappReviewsLoading(false);
    }
  }

  async function fetchDemoLecture() {
    setDemoLectureLoading(true);
    setDemoLectureError("");

    try {
      const response = await fetch("/api/demo-lecture-video", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load demo lecture video.");
      }

      setData((current) => ({
        ...current,
        demoLecture: (payload.data ?? []).map(normalizeDemoLectureRecord),
      }));
    } catch (error) {
      setDemoLectureError(error.message || "Failed to load demo lecture video.");
    } finally {
      setDemoLectureLoading(false);
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

  async function fetchWebinarLeads() {
    setWebinarLeadsLoading(true);
    setWebinarLeadsError("");

    try {
      const response = await fetch("/api/webinar-registrations", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load webinar leads.");
      }

      setData((current) => ({
        ...current,
        webinarLeads: payload.data.map((item) => ({
          ...item,
          name: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
          phone: item.mobile || "",
          course: item.webinarTitle || "",
        })),
      }));
    } catch (error) {
      setWebinarLeadsError(error.message || "Failed to load webinar leads.");
    } finally {
      setWebinarLeadsLoading(false);
    }
  }

  async function fetchCourseLeads() {
    setCourseLeadsLoading(true);
    setCourseLeadsError("");

    try {
      const response = await fetch("/api/course-leads", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load course leads.");
      }

      setData((current) => ({
        ...current,
        courseLeads: payload.data.map((item) => ({
          ...item,
          name: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
          phone: item.mobile || "",
          course: item.courseName || "",
        })),
      }));
    } catch (error) {
      setCourseLeadsError(error.message || "Failed to load course leads.");
    } finally {
      setCourseLeadsLoading(false);
    }
  }

  async function fetchUsers() {
    setUsersLoading(true);
    setUsersError("");

    try {
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load users.");
      }

      setData((current) => ({
        ...current,
        users: payload.data ?? [],
      }));
    } catch (error) {
      setUsersError(error.message || "Failed to load users.");
    } finally {
      setUsersLoading(false);
    }
  }

  async function fetchBatches() {
    setBatchesLoading(true);
    setBatchesError("");

    try {
      const response = await fetch("/api/batches", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load batches.");
      }

      setData((current) => ({
        ...current,
        batches: payload.data ?? [],
      }));
    } catch (error) {
      setBatchesError(error.message || "Failed to load batches.");
    } finally {
      setBatchesLoading(false);
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
      fetchTestimonials();
      fetchWhatsappReviews();
      fetchDemoLecture();
      fetchWebinars();
      fetchWebinarLeads();
      fetchCourseLeads();
      fetchUsers();
      fetchBatches();
      fetchDashboardStats();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    if (!toast) return undefined;

    const timerId = window.setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => window.clearTimeout(timerId);
  }, [toast]);

  function resetForm() {
    setForm(emptyForms[currentModule]);
    setEditingId(null);
    setThumbnailUploadError("");
    setVideosError("");
    setTestimonialsError("");
    setWhatsappReviewsError("");
    setDemoLectureError("");
    setWebinarsError("");
    setWebinarLeadsError("");
    setCourseLeadsError("");
    setUsersError("");
    setBatchesError("");
  }

  async function uploadThumbnail(file, moduleKey = "courses") {
    if (!file) {
      return;
    }

    setThumbnailUploading(true);
    setThumbnailUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadEndpoint =
        moduleKey === "webinars"
          ? "/api/uploads/webinar-thumbnail"
          : moduleKey === "whatsappReviews"
            ? "/api/uploads/whatsapp-review"
            : moduleKey === "demoLecture"
              ? "/api/uploads/demo-lecture-thumbnail"
            : "/api/uploads/course-thumbnail";

      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to upload thumbnail.");
      }

      setForm((current) => ({
        ...current,
        ...(moduleKey === "whatsappReviews" ? { image: payload.data.url } : { thumbnail: payload.data.url }),
      }));
    } catch (error) {
      setThumbnailUploadError(error.message || "Failed to upload thumbnail.");
    } finally {
      setThumbnailUploading(false);
    }
  }

  async function saveItem(event) {
    event.preventDefault();
    const moduleKey = currentModule;

    if (moduleKey === "courses") {
      const courseName = form.name?.trim() || "Course";
      const actionLabel = editingId ? "updated" : "added";

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
          const savedCourse = normalizeCourseRecord(payload.data);

          return {
            ...current,
            courses: editingId
              ? list.map((item) => ((item._id ?? item.id) === editingId ? savedCourse : item))
              : [savedCourse, ...list],
          };
        });

        resetForm();
        await fetchCourses();
        await fetchDashboardStats();
        showToast("success", `Course ${courseName} ${actionLabel} success`);
      } catch (error) {
        const message = error.message || "Failed to save course.";
        setCoursesError(message);
        showToast("error", `Course ${courseName} ${actionLabel} failed: ${message}`);
      }

      return;
    }

    if (moduleKey === "videos") {
      const videoTitle = form.title?.trim() || "YouTube video";
      const actionLabel = editingId ? "updated" : "added";

      try {
        setVideosError("");

        if (!form.title?.trim() || !form.youtubeIframe?.trim()) {
          throw new Error("Title and YouTube iframe are required.");
        }

        const response = await fetch(editingId ? `/api/youtube-videos/${editingId}` : "/api/youtube-videos", {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title,
            youtubeIframe: form.youtubeIframe,
            visible: form.visible,
          }),
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || payload.error || "Failed to save YouTube video.");
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
        showToast("success", `Video ${videoTitle} ${actionLabel} success`);
      } catch (error) {
        const message = error.message || "Failed to save YouTube video.";
        setVideosError(message);
        showToast("error", `Video ${videoTitle} ${actionLabel} failed: ${message}`);
      }

      return;
    }

    if (moduleKey === "demoLecture") {
      const actionLabel = editingId ? "updated" : "added";

      try {
        setDemoLectureError("");

        if (!form.youtubeEmbedCode?.trim()) {
          throw new Error("YouTube embed code is required.");
        }

        if (!form.thumbnail) {
          throw new Error("Please upload a demo lecture thumbnail first.");
        }

        if (!editingId && (data.demoLecture ?? []).length >= 1) {
          throw new Error("Only one demo lecture video is allowed. Please edit or delete the existing record.");
        }

        const response = await fetch(editingId ? `/api/demo-lecture-video/${editingId}` : "/api/demo-lecture-video", {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            youtubeEmbedCode: form.youtubeEmbedCode,
            thumbnail: form.thumbnail,
          }),
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || payload.error || "Failed to save demo lecture video.");
        }

        setData((current) => {
          const list = current.demoLecture ?? [];

          return {
            ...current,
            demoLecture: editingId
              ? list.map((item) => ((item._id ?? item.id) === editingId ? payload.data : item))
              : [payload.data],
          };
        });

        resetForm();
        await fetchDemoLecture();
        showToast("success", `Demo lecture video ${actionLabel} success`);
      } catch (error) {
        const message = error.message || "Failed to save demo lecture video.";
        setDemoLectureError(message);
        showToast("error", `Demo lecture video ${actionLabel} failed: ${message}`);
      }

      return;
    }

    if (moduleKey === "testimonials") {
      try {
        setTestimonialsError("");

        const response = await fetch(editingId ? `/api/testimonials/${editingId}` : "/api/testimonials", {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Failed to save testimonial.");
        }

        setData((current) => {
          const list = current.testimonials ?? [];

          return {
            ...current,
            testimonials: editingId
              ? list.map((item) => ((item._id ?? item.id) === editingId ? payload.data : item))
              : [payload.data, ...list],
          };
        });

        resetForm();
        await fetchTestimonials();
      } catch (error) {
        setTestimonialsError(error.message || "Failed to save testimonial.");
      }

      return;
    }

    if (moduleKey === "whatsappReviews") {
      const actionLabel = editingId ? "updated" : "added";

      try {
        setWhatsappReviewsError("");

        if (!form.image) {
          throw new Error("Please upload a WhatsApp review image first.");
        }

        const displayOrder = Number(form.displayOrder);

        if (!Number.isInteger(displayOrder) || displayOrder < 1) {
          throw new Error("Please enter a valid display order.");
        }

        const duplicateOrder = (data.whatsappReviews ?? []).find((item) => {
          const itemId = item._id ?? item.id;
          return itemId !== editingId && Number(item.displayOrder) === displayOrder;
        });

        if (duplicateOrder) {
          throw new Error(`Display order ${displayOrder} is already used. Please choose a different order.`);
        }

        const response = await fetch(editingId ? `/api/whatsapp-reviews/${editingId}` : "/api/whatsapp-reviews", {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: form.image,
            displayOrder,
            visible: form.visible,
          }),
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || payload.error || "Failed to save WhatsApp review.");
        }

        setData((current) => {
          const list = current.whatsappReviews ?? [];

          return {
            ...current,
            whatsappReviews: editingId
              ? list.map((item) => ((item._id ?? item.id) === editingId ? payload.data : item))
              : [payload.data, ...list],
          };
        });

        resetForm();
        await fetchWhatsappReviews();
        await fetchDashboardStats();
        showToast("success", `WhatsApp review ${actionLabel} success`);
      } catch (error) {
        const message = error.message || "Failed to save WhatsApp review.";
        setWhatsappReviewsError(message);
        showToast("error", `WhatsApp review ${actionLabel} failed: ${message}`);
      }

      return;
    }

    if (moduleKey === "webinars") {
      try {
        setWebinarsError("");

        if (!form.thumbnail) {
          throw new Error("Please upload a webinar thumbnail first.");
        }

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

    if (moduleKey === "batches") {
      const batchName = form.name?.trim() || "Batch";
      const actionLabel = editingId ? "updated" : "added";

      try {
        setBatchesError("");

        if (!form.name?.trim()) {
          throw new Error("Batch name is required.");
        }

        const response = await fetch(editingId ? `/api/batches/${editingId}` : "/api/batches", {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            studentIds: Array.isArray(form.studentIds) ? form.studentIds : [],
          }),
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Failed to save batch.");
        }

        setData((current) => {
          const list = current.batches ?? [];

          return {
            ...current,
            batches: editingId
              ? list.map((item) => ((item._id ?? item.id) === editingId ? payload.data : item))
              : [payload.data, ...list],
          };
        });

        resetForm();
        await fetchBatches();
        showToast("success", `Batch ${batchName} ${actionLabel} success`);
      } catch (error) {
        const message = error.message || "Failed to save batch.";
        setBatchesError(message);
        showToast("error", `Batch ${batchName} ${actionLabel} failed: ${message}`);
      }

      return;
    }

    if (moduleKey === "dashboard" || moduleKey === "webinarLeads" || moduleKey === "courseLeads" || moduleKey === "users") {
      return;
    }

    setData((current) => {
      const list = current[moduleKey] ?? [];
      const nextItem = {
        ...form,
        id: editingId ?? makeId(moduleKey),
      };

      return {
        ...current,
        [moduleKey]: editingId
          ? list.map((item) => (item.id === editingId ? nextItem : item))
          : [nextItem, ...list],
      };
    });

    resetForm();
  }

  function editItem(item) {
    const moduleKey = currentModule;
    const defaults = emptyForms[moduleKey] ?? {};
    const sourceItem =
      moduleKey === "courses"
        ? normalizeCourseRecord(item)
        : moduleKey === "demoLecture"
          ? normalizeDemoLectureRecord(item)
          : moduleKey === "batches"
            ? { ...item, studentIds: (item.studentIds ?? []).map((student) => String(student._id ?? student.id ?? student)) }
            : item;

    setForm(
      Object.keys(defaults).reduce(
        (next, key) => ({
          ...next,
          [key]: sourceItem[key] ?? defaults[key] ?? "",
        }),
        {},
      ),
    );
    setEditingId(item._id ?? item.id);
  }

  async function deleteItem(id) {
    const moduleKey = currentModule;

    if (moduleKey === "courses") {
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

    if (moduleKey === "videos") {
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
        showToast("success", "YouTube video deleted success");
      } catch (error) {
        const message = error.message || "Failed to delete YouTube video.";
        setVideosError(message);
        showToast("error", `YouTube video delete failed: ${message}`);
      }

      return;
    }

    if (moduleKey === "demoLecture") {
      const confirmed = window.confirm("Delete this demo lecture video?");

      if (!confirmed) {
        return;
      }

      try {
        setDemoLectureError("");

        const response = await fetch(`/api/demo-lecture-video/${id}`, {
          method: "DELETE",
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Failed to delete demo lecture video.");
        }

        setData((current) => ({
          ...current,
          demoLecture: current.demoLecture.filter((item) => (item._id ?? item.id) !== id),
        }));

        if (editingId === id) {
          resetForm();
        }

        await fetchDemoLecture();
        showToast("success", "Demo lecture video deleted success");
      } catch (error) {
        const message = error.message || "Failed to delete demo lecture video.";
        setDemoLectureError(message);
        showToast("error", `Demo lecture video delete failed: ${message}`);
      }

      return;
    }

    if (moduleKey === "testimonials") {
      const confirmed = window.confirm("Delete this testimonial?");

      if (!confirmed) {
        return;
      }

      try {
        setTestimonialsError("");

        const response = await fetch(`/api/testimonials/${id}`, {
          method: "DELETE",
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Failed to delete testimonial.");
        }

        setData((current) => ({
          ...current,
          testimonials: current.testimonials.filter((item) => (item._id ?? item.id) !== id),
        }));

        if (editingId === id) {
          resetForm();
        }

        await fetchTestimonials();
      } catch (error) {
        setTestimonialsError(error.message || "Failed to delete testimonial.");
      }

      return;
    }

    if (moduleKey === "whatsappReviews") {
      const confirmed = window.confirm("Delete this WhatsApp review?");

      if (!confirmed) {
        return;
      }

      try {
        setWhatsappReviewsError("");

        const response = await fetch(`/api/whatsapp-reviews/${id}`, {
          method: "DELETE",
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Failed to delete WhatsApp review.");
        }

        setData((current) => ({
          ...current,
          whatsappReviews: current.whatsappReviews.filter((item) => (item._id ?? item.id) !== id),
        }));

        if (editingId === id) {
          resetForm();
        }

        await fetchWhatsappReviews();
        await fetchDashboardStats();
        showToast("success", "WhatsApp review deleted success");
      } catch (error) {
        const message = error.message || "Failed to delete WhatsApp review.";
        setWhatsappReviewsError(message);
        showToast("error", `WhatsApp review delete failed: ${message}`);
      }

      return;
    }

    if (moduleKey === "webinars") {
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

    if (moduleKey === "batches") {
      const confirmed = window.confirm("Delete this batch?");

      if (!confirmed) {
        return;
      }

      try {
        setBatchesError("");

        const response = await fetch(`/api/batches/${id}`, {
          method: "DELETE",
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Failed to delete batch.");
        }

        setData((current) => ({
          ...current,
          batches: current.batches.filter((item) => (item._id ?? item.id) !== id),
        }));

        if (editingId === id) {
          resetForm();
        }

        await fetchBatches();
        showToast("success", "Batch deleted success");
      } catch (error) {
        const message = error.message || "Failed to delete batch.";
        setBatchesError(message);
        showToast("error", `Batch delete failed: ${message}`);
      }

      return;
    }

    setData((current) => ({
      ...current,
      [moduleKey]: current[moduleKey].filter((item) => item.id !== id),
    }));

    if (editingId === id) resetForm();
  }

  return (
    <div className="adminShell">
      {toast ? (
        <div className={`adminToast adminToast--${toast.type}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      ) : null}
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
                <span>
                  {module.key === "reviews"
                    ? (data.testimonials?.length ?? 0) + (data.whatsappReviews?.length ?? 0)
                    : data[module.key]?.length ?? 0}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="adminMain">
          <header className="adminTopbar">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage courses, leads, testimonials, videos, and webinars from one place.</p>
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
              {currentModule !== "dashboard" &&
              currentModule !== "webinarLeads" &&
              currentModule !== "courseLeads" &&
              currentModule !== "users" &&
              (currentModule !== "demoLecture" || !demoLectureExists || editingId) ? (
                <button type="button" className="adminButton adminButtonAlt" onClick={resetForm}>
              {currentModule === "videos"
                ? "New YouTube Video"
                : currentModule === "whatsappReviews"
                  ? "New WhatsApp Review"
                  : currentModule === "demoLecture"
                    ? "New Demo Lecture Video"
                    : currentModule === "batches"
                      ? "New Batch"
                    : currentModule === "testimonials"
                      ? "New Testimonial"
                      : `New ${activeConfig.label.slice(0, -1)}`}
                </button>
              ) : null}
            </div>

            {activeModule === "reviews" ? (
              <div className="adminSubTabs" role="tablist" aria-label="Review sections">
                {reviewTabs.map((tab) => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeReviewTab === tab.key}
                    className={activeReviewTab === tab.key ? "isActive" : ""}
                    onClick={() => selectReviewTab(tab.key)}
                    key={tab.key}
                  >
                    <span>{tab.label}</span>
                    <strong>{data[tab.key]?.length ?? 0}</strong>
                  </button>
                ))}
              </div>
            ) : null}

            {activeModule === "dashboard" ? (
              <DashboardOverview stats={stats} error={dashboardError} />
            ) : null}

            {showRecordForm ? (
              <AdminForm
                moduleKey={currentModule}
                form={form}
                editingId={editingId}
                onChange={updateField}
                onSubmit={saveItem}
                onCancel={resetForm}
                onThumbnailUpload={uploadThumbnail}
                thumbnailUploading={thumbnailUploading}
                thumbnailUploadError={thumbnailUploadError}
                users={data.users ?? []}
              />
            ) : null}
            {currentModule === "demoLecture" && demoLectureExists && !editingId ? (
              <div className="adminEmpty">One demo lecture video is already added. Use Edit or Delete below.</div>
            ) : null}

            {currentModule === "courses" && coursesError ? <div className="adminEmpty">{coursesError}</div> : null}
            {currentModule === "videos" && videosError ? <div className="adminEmpty">{videosError}</div> : null}
            {currentModule === "testimonials" && testimonialsError ? <div className="adminEmpty">{testimonialsError}</div> : null}
            {currentModule === "whatsappReviews" && whatsappReviewsError ? (
              <div className="adminEmpty">{whatsappReviewsError}</div>
            ) : null}
            {currentModule === "demoLecture" && demoLectureError ? <div className="adminEmpty">{demoLectureError}</div> : null}
            {currentModule === "webinars" && webinarsError ? <div className="adminEmpty">{webinarsError}</div> : null}
            {currentModule === "webinarLeads" && webinarLeadsError ? <div className="adminEmpty">{webinarLeadsError}</div> : null}
            {currentModule === "courseLeads" && courseLeadsError ? <div className="adminEmpty">{courseLeadsError}</div> : null}
            {currentModule === "users" && usersError ? <div className="adminEmpty">{usersError}</div> : null}
            {currentModule === "batches" && batchesError ? <div className="adminEmpty">{batchesError}</div> : null}

            {activeModule !== "dashboard" ? (
              <AdminTable
                moduleKey={currentModule}
                items={data[currentModule] ?? []}
                onEdit={editItem}
                onDelete={deleteItem}
                loading={
                  (currentModule === "courses" && coursesLoading) ||
                  (currentModule === "videos" && videosLoading) ||
                  (currentModule === "testimonials" && testimonialsLoading) ||
                  (currentModule === "whatsappReviews" && whatsappReviewsLoading) ||
                  (currentModule === "demoLecture" && demoLectureLoading) ||
                  (currentModule === "webinars" && webinarsLoading) ||
                  (currentModule === "webinarLeads" && webinarLeadsLoading) ||
                  (currentModule === "courseLeads" && courseLeadsLoading) ||
                  (currentModule === "users" && usersLoading) ||
                  (currentModule === "batches" && batchesLoading)
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
  users,
}) {
  const fields = {
    dashboard: [],
    courses: [
      ["name", "Course Name", "input"],
      ["courseMode", "Course Mode", "select", Object.keys(courseModeLabels)],
      ["price", "Starting From Pricing", "input"],
      ["studentsEnrolled", "Students Enrolled", "input"],
      ["visible", "Display on Website", "select", ["Yes", "No"]],
      ["allowBooking", "Allow Booking Option", "select", ["Yes", "No"]],
      ["languages", "Languages", "checkboxes", Object.keys(languageLabels), "adminFull"],
      ["shortDescription", "Short Description", "textarea", "adminFull"],
      ["longDescription", "Long Description", "richtext", "adminFull"],
      ["timeline", "Course Timeline", "richtext", "adminFull"],
      ["syllabus", "Syllabus (Optional)", "richtext", "adminFull"],
    ],
    webinarLeads: [],
    courseLeads: [],
    users: [],
    batches: [
      ["name", "Batch Name", "input", "adminFull"],
      ["studentIds", "Assign Students", "studentSelector", "adminFull"],
    ],
    testimonials: [
      ["studentName", "Student Name", "input"],
      ["course", "Course", "input"],
      ["rating", "Rating", "select", ["5", "4", "3", "2", "1"]],
      ["visible", "Display on Website", "select", ["Yes", "No"]],
      ["review", "Review", "textarea", "adminFull"],
    ],
    whatsappReviews: [
      ["displayOrder", "Display Order", "number"],
      ["visible", "Display on Website", "select", ["Yes", "No"]],
    ],
    demoLecture: [
      ["youtubeEmbedCode", "YouTube Embed Code", "textarea", "adminFull"],
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
      {moduleKey === "courses" || moduleKey === "webinars" || moduleKey === "whatsappReviews" || moduleKey === "demoLecture" ? (
        <div className="adminField adminFull">
          <label htmlFor="thumbnailFile">
            {moduleKey === "webinars"
              ? "Webinar Thumbnail"
              : moduleKey === "whatsappReviews"
                ? "WhatsApp Review Image"
                : moduleKey === "demoLecture"
                  ? "Demo Lecture Thumbnail"
                  : "Course Thumbnail"}
          </label>
          <input
            id="thumbnailFile"
            type="file"
            accept="image/*"
            onChange={(event) => onThumbnailUpload?.(event.target.files?.[0], moduleKey)}
          />
          {thumbnailUploading ? <small>Uploading thumbnail...</small> : null}
          {thumbnailUploadError ? <small>{thumbnailUploadError}</small> : null}
          {form.thumbnail || form.image ? (
            <div style={{ marginTop: "12px" }}>
              <img
                src={form.thumbnail || form.image}
                alt={`${
                  moduleKey === "webinars"
                    ? "Webinar"
                    : moduleKey === "whatsappReviews"
                      ? "WhatsApp review"
                      : moduleKey === "demoLecture"
                        ? "Demo lecture"
                        : "Course"
                } preview`}
                style={{
                  width: moduleKey === "whatsappReviews" ? "150px" : "180px",
                  height: moduleKey === "whatsappReviews" ? "190px" : "110px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
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
                    {name === "courseMode" ? courseModeLabels[option] : option}
                  </option>
                ))}
              </select>
            ) : type === "studentSelector" ? (
              <div className="adminStudentSelector">
                {users?.length ? (
                  users.map((user) => {
                    const userId = String(user._id ?? user.id);
                    const checkedValues = Array.isArray(form[name]) ? form[name].map(String) : [];

                    return (
                      <label key={userId}>
                        <input
                          type="checkbox"
                          checked={checkedValues.includes(userId)}
                          onChange={(event) => {
                            const nextValues = event.target.checked
                              ? [...checkedValues, userId]
                              : checkedValues.filter((item) => item !== userId);
                            onChange(name, nextValues);
                          }}
                        />
                        <span>
                          <strong>{user.name || "Student"}</strong>
                          <small>{user.email}</small>
                        </span>
                      </label>
                    );
                  })
                ) : (
                  <div className="adminEmpty">No registered users yet.</div>
                )}
              </div>
            ) : type === "checkboxes" ? (
              <div className="adminCheckboxGroup">
                {options.map((option) => {
                  const checkedValues = Array.isArray(form[name]) ? form[name] : [];

                  return (
                    <label key={option}>
                      <input
                        type="checkbox"
                        checked={checkedValues.includes(option)}
                        onChange={(event) => {
                          const nextValues = event.target.checked
                            ? [...checkedValues, option]
                            : checkedValues.filter((item) => item !== option);
                          onChange(name, nextValues);
                        }}
                      />
                      <span>{languageLabels[option] || option}</span>
                    </label>
                  );
                })}
              </div>
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
  const showActions = !["webinarLeads", "courseLeads", "users"].includes(moduleKey);

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
            {showActions ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id ?? item.id}>
              {columns[moduleKey].map(([key]) => (
                <td key={key}>
                  {key === "thumbnail" || key === "image" ? (
                    <img
                      src={item[key]}
                      alt={item.name ?? item.title ?? "Preview"}
                      style={{
                        width: key === "image" ? "58px" : "72px",
                        height: key === "image" ? "72px" : "48px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : key === "youtubeIframe" ? (
                    <div className="adminYoutubePreview" dangerouslySetInnerHTML={{ __html: item[key] }} />
                  ) : key === "youtubeEmbedCode" ? (
                    <div className="adminYoutubePreview" dangerouslySetInnerHTML={{ __html: item[key] }} />
                  ) : key === "phone" ? (
                    item.phone || item.mobile
                  ) : key === "studentIds" ? (
                    Array.isArray(item.studentIds) && item.studentIds.length ? (
                      <div className="adminAssignedStudents">
                        {item.studentIds.map((student) => (
                          <span key={student._id ?? student.id ?? student.email ?? student}>
                            {typeof student === "object" ? student.name || student.email || "Student" : student}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )
                  ) : ["createdAt", "lastLoginAt", "dateTime"].includes(key) ? (
                    item[key] ? new Date(item[key]).toLocaleString("en-IN") : "-"
                  ) : key === "preferredLanguage" ? (
                    languageLabels[item[key]] || item[key] || "-"
                  ) : key === "courseMode" ? (
                    courseModeLabels[item[key]] || item[key] || "Live Courses"
                  ) : Array.isArray(item[key]) ? (
                    item[key].join(", ")
                  ) : typeof item[key] === "boolean" ? (
                    item[key] ? "Yes" : "No"
                  ) : ["allowBooking", "visible", "status", "type"].includes(key) ? (
                    <span className="adminBadge">{item[key]}</span>
                  ) : (
                    item[key]
                  )}
                </td>
              ))}
              {showActions ? (
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
