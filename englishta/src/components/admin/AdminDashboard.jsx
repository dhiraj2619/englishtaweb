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
  { key: "skillCheckTests", label: "Skill Check Tests", description: "Create MCQ test sets for student skill checking." },
  { key: "reviews", label: "Reviews", description: "Manage testimonials and WhatsApp review screenshots." },
  { key: "demoLecture", label: "Demo Lecture Video", description: "Manage the single demo lecture video shown on the website." },
  { key: "videos", label: "Videos", description: "Add YouTube learning and demo videos." },
  { key: "webinars", label: "Webinars", description: "Manage live and recorded webinar sessions." },
];

const reviewTabs = [
  { key: "testimonials", label: "Testimonials" },
  { key: "whatsappReviews", label: "WhatsApp Reviews" },
];

const moduleIconNames = {
  dashboard: "home",
  courses: "book",
  webinarLeads: "users",
  courseLeads: "phone",
  users: "user",
  batches: "layers",
  skillCheckTests: "clipboard",
  reviews: "star",
  demoLecture: "play",
  videos: "film",
  webinars: "monitor",
  courseInquiryCount: "message",
  webinarRegistrationCount: "users",
  whatsAppReviewCount: "star",
  demoLectureCount: "play",
  courseEnrollmentCount: "graduate",
  coursesCount: "book",
  webinarsCount: "monitor",
  usersCount: "user",
  batchesCount: "layers",
  skillCheckTestsCount: "clipboard",
};

const dashboardChartPoints = [18, 42, 30, 55, 37, 64, 44];

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
    actualPrice: "",
    discountedPrice: "",
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
  skillCheckTests: {
    setCode: "A",
    title: "",
    description: "",
    timeLimitMinutes: "15",
    passingScore: "5",
    visible: "Yes",
    questions: [
      {
        question: "",
        category: "vocabulary",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
        marks: "1",
      },
    ],
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
      actualPrice: "4999",
      discountedPrice: "3999",
      price: "999",
      studentsEnrolled: "128",
      visible: "Yes",
    },
  ],
  webinarLeads: [],
  courseLeads: [],
  users: [],
  batches: [],
  skillCheckTests: [],
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
    ["actualPrice", "Actual Price"],
    ["discountedPrice", "Discounted Price"],
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
  skillCheckTests: [
    ["setCode", "Set"],
    ["title", "Test Title"],
    ["questions", "Questions"],
    ["timeLimitMinutes", "Time Limit"],
    ["passingScore", "Passing Score"],
    ["visible", "Visible"],
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
  progress: "Track Your Progress",
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
  const [skillCheckTestsLoading, setSkillCheckTestsLoading] = useState(false);
  const [skillCheckTestsError, setSkillCheckTestsError] = useState("");
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
      {
        key: "skillCheckTestsCount",
        label: "Skill Tests",
        count: data.skillCheckTests?.length ?? 0,
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
      data.skillCheckTests?.length,
    ],
  );

  const recentActivities = useMemo(() => {
    const latestCourse = data.courses?.[0];
    const latestWebinar = data.webinars?.[0];
    const latestUser = data.users?.[0];
    const latestLead = data.courseLeads?.[0] ?? data.webinarLeads?.[0];
    const latestReview = data.whatsappReviews?.[0] ?? data.testimonials?.[0];

    return [
      {
        icon: "book",
        title: latestCourse ? `New course "${latestCourse.name}"` : "Course catalog ready",
        detail: latestCourse?.shortDescription ?? "Create and manage spoken English courses.",
        time: "10:30 AM",
      },
      {
        icon: "monitor",
        title: latestWebinar ? `Webinar "${latestWebinar.title}" scheduled` : "Webinar module active",
        detail: latestWebinar?.dateTime ? `Scheduled for ${latestWebinar.dateTime}` : "Publish live and recorded webinar sessions.",
        time: "09:15 AM",
      },
      {
        icon: "user",
        title: latestUser ? "New user registered" : "Registered users",
        detail: latestUser ? `${latestUser.name ?? "Student"} joined the platform` : "Student registrations will appear here.",
        time: "08:40 AM",
      },
      {
        icon: "phone",
        title: latestLead ? "New lead received" : "Lead inbox ready",
        detail: latestLead ? `From ${latestLead.name ?? "website contact form"}` : "Course and webinar leads are tracked automatically.",
        time: "Yesterday",
      },
      {
        icon: "star",
        title: latestReview ? "Review received" : "Reviews module ready",
        detail: latestReview?.studentName
          ? `New review from ${latestReview.studentName}`
          : "WhatsApp reviews and testimonials are grouped here.",
        time: "Yesterday",
      },
    ];
  }, [data.courses, data.webinars, data.users, data.courseLeads, data.webinarLeads, data.whatsappReviews, data.testimonials]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function showToast(type, message) {
    setToast({ type, message });
  }

  function getNewRecordLabel() {
    if (currentModule === "videos") return "New YouTube Video";
    if (currentModule === "whatsappReviews") return "New WhatsApp Review";
    if (currentModule === "demoLecture") return "New Demo Lecture Video";
    if (currentModule === "batches") return "New Batch";
    if (currentModule === "skillCheckTests") return "New Skill Test";
    if (currentModule === "testimonials") return "New Testimonial";

    return `New ${activeConfig.label.slice(0, -1)}`;
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
    setSkillCheckTestsError("");
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
    setSkillCheckTestsError("");
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

  async function fetchSkillCheckTests() {
    setSkillCheckTestsLoading(true);
    setSkillCheckTestsError("");

    try {
      const response = await fetch("/api/skill-check-tests", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to load skill check tests.");
      }

      setData((current) => ({
        ...current,
        skillCheckTests: payload.data ?? [],
      }));
    } catch (error) {
      setSkillCheckTestsError(error.message || "Failed to load skill check tests.");
    } finally {
      setSkillCheckTestsLoading(false);
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
      fetchSkillCheckTests();
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
    setSkillCheckTestsError("");
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

    if (moduleKey === "skillCheckTests") {
      const testTitle = form.title?.trim() || "Skill check test";
      const actionLabel = editingId ? "updated" : "added";

      try {
        setSkillCheckTestsError("");

        if (!form.title?.trim()) {
          throw new Error("Test title is required.");
        }

        const questions = Array.isArray(form.questions) ? form.questions : [];

        if (!questions.length) {
          throw new Error("Please add at least one question.");
        }

        const response = await fetch(editingId ? `/api/skill-check-tests/${editingId}` : "/api/skill-check-tests", {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Failed to save skill check test.");
        }

        setData((current) => {
          const list = current.skillCheckTests ?? [];

          return {
            ...current,
            skillCheckTests: editingId
              ? list.map((item) => ((item._id ?? item.id) === editingId ? payload.data : item))
              : [payload.data, ...list],
          };
        });

        resetForm();
        await fetchSkillCheckTests();
        showToast("success", `${testTitle} ${actionLabel} success`);
      } catch (error) {
        const message = error.message || "Failed to save skill check test.";
        setSkillCheckTestsError(message);
        showToast("error", `${testTitle} ${actionLabel} failed: ${message}`);
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

    if (moduleKey === "skillCheckTests") {
      const confirmed = window.confirm("Delete this skill check test?");

      if (!confirmed) {
        return;
      }

      try {
        setSkillCheckTestsError("");

        const response = await fetch(`/api/skill-check-tests/${id}`, {
          method: "DELETE",
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Failed to delete skill check test.");
        }

        setData((current) => ({
          ...current,
          skillCheckTests: current.skillCheckTests.filter((item) => (item._id ?? item.id) !== id),
        }));

        if (editingId === id) {
          resetForm();
        }

        await fetchSkillCheckTests();
        showToast("success", "Skill check test deleted success");
      } catch (error) {
        const message = error.message || "Failed to delete skill check test.";
        setSkillCheckTestsError(message);
        showToast("error", `Skill check test delete failed: ${message}`);
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
                <span>
                  <AdminIcon name={moduleIconNames[module.key]} />
                  {module.label}
                </span>
                <span>
                  {module.key === "reviews"
                    ? (data.testimonials?.length ?? 0) + (data.whatsappReviews?.length ?? 0)
                    : data[module.key]?.length ?? 0}
                </span>
              </button>
            ))}
          </nav>

          <div className="adminPremiumCard">
            <AdminIcon name="crown" />
            <strong>Go Premium</strong>
            <p>Unlock analytics, automation, and sharper student insights.</p>
            <button type="button">Upgrade Now</button>
          </div>
        </aside>

        <main className="adminMain">
          <header className="adminTopbar">
            <div>
              <span className="adminTopbar__eyebrow">Welcome back, Admin!</span>
              <h1>Admin Dashboard</h1>
              <p>Manage courses, leads, testimonials, videos, and webinars from one place.</p>
            </div>
            <div className="adminActions">
              <Link className="adminButton adminButtonDark" href="/">
                View Website
                <AdminIcon name="external" />
              </Link>
              <button
                type="button"
                className="adminButton adminButtonAlt"
                onClick={() => {
                  if (activeModule === "dashboard") {
                    selectModule("courses");
                    return;
                  }
                  resetForm();
                }}
              >
                + Add New
              </button>
              <span className="adminNoticeBell">
                <AdminIcon name="bell" />
                <i>{stats.length}</i>
              </span>
              <span className="adminProfileChip">
                <img src="/assets/images/logo/logoenglishta.png" alt="" />
                Admin
              </span>
              <button
                type="button"
                className="adminButton adminButtonGhost"
                onClick={async () => {
                  await fetch("/api/admin/logout", { method: "POST" });
                  window.location.href = "/admin/login";
                }}
              >
                Logout
              </button>
            </div>
          </header>

          <section className="adminStatGrid" aria-label="Dashboard counts">
            {stats.map((stat) => (
              <div className="adminStatCard" key={stat.key}>
                <span className="adminStatCard__icon">
                  <AdminIcon name={moduleIconNames[stat.key]} />
                </span>
                <div>
                  <span>{stat.label}</span>
                  <strong>{stat.count}</strong>
                </div>
              </div>
            ))}
          </section>

          <section className={`adminPanel ${activeModule === "dashboard" ? "adminPanel--dashboard" : ""}`}>
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
                  {getNewRecordLabel()}
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
              <DashboardOverview stats={stats} error={dashboardError} recentActivities={recentActivities} />
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
            {currentModule === "skillCheckTests" && skillCheckTestsError ? (
              <div className="adminEmpty">{skillCheckTestsError}</div>
            ) : null}

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
                  (currentModule === "batches" && batchesLoading) ||
                  (currentModule === "skillCheckTests" && skillCheckTestsLoading)
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
      ["actualPrice", "Actual Price (Cut Mark)", "input"],
      ["discountedPrice", "Discounted Price", "input"],
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
    skillCheckTests: [
      ["setCode", "Test Set", "select", ["A", "B", "C", "D"]],
      ["title", "Test Title", "input"],
      ["timeLimitMinutes", "Time Limit (Minutes)", "number"],
      ["passingScore", "Passing Score", "number"],
      ["visible", "Display for Students", "select", ["Yes", "No"]],
      ["description", "Test Description", "textarea", "adminFull"],
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
      {moduleKey === "skillCheckTests" ? (
        <SkillCheckQuestionBuilder questions={form.questions ?? []} onChange={(questions) => onChange("questions", questions)} />
      ) : null}
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

function createEmptySkillQuestion() {
  return {
    question: "",
    category: "vocabulary",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    marks: "1",
  };
}

function SkillCheckQuestionBuilder({ questions, onChange }) {
  const normalizedQuestions = questions.length ? questions : [createEmptySkillQuestion()];

  function updateQuestion(index, field, value) {
    const nextQuestions = normalizedQuestions.map((question, questionIndex) =>
      questionIndex === index ? { ...question, [field]: value } : question,
    );
    onChange(nextQuestions);
  }

  function updateOption(questionIndex, optionIndex, value) {
    const nextQuestions = normalizedQuestions.map((question, currentQuestionIndex) => {
      if (currentQuestionIndex !== questionIndex) {
        return question;
      }

      const options = Array.isArray(question.options) ? [...question.options] : ["", "", "", ""];
      options[optionIndex] = value;

      return { ...question, options };
    });

    onChange(nextQuestions);
  }

  function addQuestion() {
    onChange([...normalizedQuestions, createEmptySkillQuestion()]);
  }

  function removeQuestion(index) {
    const nextQuestions = normalizedQuestions.filter((_, questionIndex) => questionIndex !== index);
    onChange(nextQuestions.length ? nextQuestions : [createEmptySkillQuestion()]);
  }

  return (
    <div className="adminSkillBuilder adminFull">
      <div className="adminSkillBuilderHeader">
        <div>
          <h3>MCQ Questions</h3>
          <p>Add options and choose the correct answer for auto-checking.</p>
        </div>
        <button type="button" className="adminButton adminButtonAlt" onClick={addQuestion}>
          Add Question
        </button>
      </div>

      {normalizedQuestions.map((question, questionIndex) => {
        const options = Array.isArray(question.options) && question.options.length ? question.options : ["", "", "", ""];

        return (
          <div className="adminSkillQuestion" key={question._id ?? questionIndex}>
            <div className="adminSkillQuestionTop">
              <strong>Question {questionIndex + 1}</strong>
              <button type="button" className="adminButton adminButtonDanger" onClick={() => removeQuestion(questionIndex)}>
                Remove
              </button>
            </div>

            <div className="adminField adminFull">
              <label htmlFor={`skill-question-${questionIndex}`}>Question Text</label>
              <textarea
                id={`skill-question-${questionIndex}`}
                value={question.question ?? ""}
                onChange={(event) => updateQuestion(questionIndex, "question", event.target.value)}
              />
            </div>

            <div className="adminSkillMeta">
              <div className="adminField">
                <label htmlFor={`skill-category-${questionIndex}`}>Category</label>
                <select
                  id={`skill-category-${questionIndex}`}
                  value={question.category ?? "vocabulary"}
                  onChange={(event) => updateQuestion(questionIndex, "category", event.target.value)}
                >
                  <option value="speaking">Speaking Assessment</option>
                  <option value="vocabulary">Vocabulary Test</option>
                  <option value="confidence">Confidence Check</option>
                  <option value="grammar">Grammar</option>
                </select>
              </div>

              <div className="adminField">
                <label htmlFor={`skill-marks-${questionIndex}`}>Marks</label>
                <input
                  id={`skill-marks-${questionIndex}`}
                  type="number"
                  min="1"
                  value={question.marks ?? "1"}
                  onChange={(event) => updateQuestion(questionIndex, "marks", event.target.value)}
                />
              </div>
            </div>

            <div className="adminSkillOptions">
              {options.map((option, optionIndex) => (
                <label className="adminSkillOption" key={optionIndex}>
                  <input
                    type="radio"
                    name={`correct-option-${questionIndex}`}
                    checked={Number(question.correctOptionIndex ?? 0) === optionIndex}
                    onChange={() => updateQuestion(questionIndex, "correctOptionIndex", optionIndex)}
                  />
                  <span>Option {optionIndex + 1}</span>
                  <input
                    type="text"
                    value={option}
                    onChange={(event) => updateOption(questionIndex, optionIndex, event.target.value)}
                    placeholder={`Enter option ${optionIndex + 1}`}
                  />
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DashboardOverview({ stats, error, recentActivities }) {
  const compactStats = [
    { label: "Total Enrollments", value: stats.find((stat) => stat.key === "courseEnrollmentCount")?.count ?? 0, change: "+20%" },
    {
      label: "Total Leads",
      value:
        (stats.find((stat) => stat.key === "courseInquiryCount")?.count ?? 0) +
        (stats.find((stat) => stat.key === "webinarRegistrationCount")?.count ?? 0),
      change: "+14%",
    },
    { label: "Total Students", value: stats.find((stat) => stat.key === "usersCount")?.count ?? 0, change: "+25%" },
    { label: "Total Revenue", value: "Rs 0", change: "-0%" },
  ];

  const chartPath = dashboardChartPoints
    .map((point, index) => `${index * 66 + 18},${84 - point}`)
    .join(" ");

  return (
    <div className="adminDashboardOverview">
      {error ? <div className="adminEmpty">{error}</div> : null}
      <div className="adminDashboardOverview__layout">
        <section className="adminAnalyticsCard">
          <div className="adminAnalyticsCard__head">
            <div>
              <h3>Dashboard Overview</h3>
              <p>Track weekly platform momentum at a glance.</p>
            </div>
            <button type="button">This Week</button>
          </div>

          <div className="adminMiniStats">
            {compactStats.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.change} vs last week</small>
              </article>
            ))}
          </div>

          <div className="adminChart" aria-label="Weekly overview chart">
            <svg viewBox="0 0 440 120" role="img" aria-hidden="true">
              <defs>
                <linearGradient id="adminChartFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#feb60c" stopOpacity="0.26" />
                  <stop offset="100%" stopColor="#feb60c" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`M18 100 L ${chartPath} L 414 100 Z`} fill="url(#adminChartFill)" />
              <polyline points={chartPath} fill="none" stroke="#feb60c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
              {dashboardChartPoints.map((point, index) => (
                <circle cx={index * 66 + 18} cy={84 - point} r="4" fill="#feb60c" key={`${point}-${index}`} />
              ))}
            </svg>
            <div className="adminChart__days">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="adminRecentCard">
          <div className="adminAnalyticsCard__head">
            <div>
              <h3>Recent Activities</h3>
              <p>Latest movement across your platform.</p>
            </div>
            <button type="button">View All</button>
          </div>

          <div className="adminRecentList">
            {recentActivities.map((activity) => (
              <article key={`${activity.title}-${activity.time}`}>
                <span>
                  <AdminIcon name={activity.icon} />
                </span>
                <div>
                  <strong>{activity.title}</strong>
                  <p>{activity.detail}</p>
                </div>
                <time>{activity.time}</time>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="adminMotivationBanner">
        <span>
          <AdminIcon name="trophy" />
        </span>
        <div>
          <strong>Great Job! You are doing awesome.</strong>
          <p>Keep going. Your platform is growing and making an impact.</p>
        </div>
        <button type="button">View Reports</button>
      </div>
    </div>
  );
}

function AdminIcon({ name }) {
  const icons = {
    home: (
      <>
        <path d="M4 10.5 12 4l8 6.5" />
        <path d="M6.5 10v9h11v-9" />
        <path d="M10 19v-5h4v5" />
      </>
    ),
    book: (
      <>
        <path d="M5 5.5c2.6-.9 4.9-.6 7 1.1v13c-2.1-1.7-4.4-2-7-1.1z" />
        <path d="M12 6.6c2.1-1.7 4.4-2 7-1.1v13c-2.6-.9-4.9-.6-7 1.1z" />
      </>
    ),
    monitor: (
      <>
        <rect x="4" y="5" width="16" height="11" rx="2" />
        <path d="M9 20h6" />
        <path d="M12 16v4" />
      </>
    ),
    message: (
      <>
        <path d="M5 6h14v10H9l-4 4z" />
        <path d="M9 10h6" />
        <path d="M9 13h4" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="9" r="3" />
        <circle cx="16" cy="10" r="2.5" />
        <path d="M4 19c.8-3 2.6-4.5 5-4.5S13.2 16 14 19" />
        <path d="M14 18.5c.6-2 1.8-3.1 3.6-3.1 1.6 0 2.9 1 3.4 3.1" />
      </>
    ),
    phone: (
      <>
        <path d="M7 5h4l1 4-2 1.2c1 2 2.4 3.4 4.3 4.3L16 12l4 1v4c0 1.1-.8 2-2 2C10 19 5 14 5 7c0-1.2.9-2 2-2z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 20c.8-4 3.2-6 7-6s6.2 2 7 6" />
      </>
    ),
    layers: (
      <>
        <path d="m12 4 8 4-8 4-8-4z" />
        <path d="m4 12 8 4 8-4" />
        <path d="m4 16 8 4 8-4" />
      </>
    ),
    clipboard: (
      <>
        <rect x="6" y="5" width="12" height="17" rx="2" />
        <path d="M9 5c.2-1.4 1.2-2 3-2s2.8.6 3 2v2H9z" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </>
    ),
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z" />,
    play: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m10 8 6 4-6 4z" />
      </>
    ),
    film: (
      <>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M8 5v14" />
        <path d="M16 5v14" />
        <path d="M4 10h4" />
        <path d="M16 10h4" />
        <path d="M4 15h4" />
        <path d="M16 15h4" />
      </>
    ),
    graduate: (
      <>
        <path d="m12 5 9 5-9 5-9-5z" />
        <path d="M7 13v4c2.8 2 7.2 2 10 0v-4" />
      </>
    ),
    crown: (
      <>
        <path d="m4 8 4 4 4-7 4 7 4-4-2 11H6z" />
        <path d="M6 21h12" />
      </>
    ),
    bell: (
      <>
        <path d="M6 17h12l-1.5-2v-4.5a4.5 4.5 0 0 0-9 0V15z" />
        <path d="M10 20h4" />
      </>
    ),
    external: (
      <>
        <path d="M9 5H5v14h14v-4" />
        <path d="M13 5h6v6" />
        <path d="m11 13 8-8" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 4h8v4c0 4-1.8 6-4 6S8 12 8 8z" />
        <path d="M8 6H5c0 3 1.5 5 4 5" />
        <path d="M16 6h3c0 3-1.5 5-4 5" />
        <path d="M12 14v4" />
        <path d="M8 20h8" />
      </>
    ),
  };

  return (
    <svg className="adminIcon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name] ?? icons.book}
    </svg>
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
                  ) : key === "questions" ? (
                    Array.isArray(item.questions) ? `${item.questions.length} Questions` : "0 Questions"
                  ) : key === "timeLimitMinutes" ? (
                    item[key] ? `${item[key]} min` : "-"
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
