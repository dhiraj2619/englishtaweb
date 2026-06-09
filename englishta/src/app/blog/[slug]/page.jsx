import { notFound } from "next/navigation";
import Link from "next/link";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";

export const dynamic = "force-dynamic";

const stripHtml = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const formatBlogDate = (dateValue) => {
  if (!dateValue) return "Latest";

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateValue));
  } catch {
    return "Latest";
  }
};

async function getBlog(slug) {
  await connectToDatabase();
  return Blog.findOne({ slug, visible: { $ne: "No" } }).lean();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog not found | Englishta",
    };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.shortDescription,
    keywords: blog.keywords || undefined,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.shortDescription,
      images: blog.thumbnail ? [{ url: blog.thumbnail }] : [],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const readTime = Math.max(1, Math.ceil(stripHtml(`${blog.shortDescription} ${blog.content}`).split(" ").filter(Boolean).length / 180));

  return (
    <>
      <Navbar />
      <main className="englishtaBlogDetail">
        <section className="englishtaBlogDetail__hero">
          <div className="container">
            <Link href="/" className="englishtaBlogDetail__back">
              <i className="fa-solid fa-arrow-left" aria-hidden="true" />
              Back to Home
            </Link>
            <div className="englishtaBlogDetail__head">
              <p>Englishta Blog</p>
              <h1>{blog.title}</h1>
              <div>
                <span>{formatBlogDate(blog.createdAt)}</span>
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </section>

        <section className="englishtaBlogDetail__body">
          <div className="container">
            <img className="englishtaBlogDetail__banner" src={blog.thumbnail} alt={blog.title} />
            <p className="englishtaBlogDetail__intro">{blog.shortDescription}</p>
            <article className="englishtaBlogDetail__content" dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
