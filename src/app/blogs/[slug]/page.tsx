import BlogDetailPage from "@/components/pages/blogs/BlogDetailPage";

interface BlogDetailRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogDetailRoute({ params }: BlogDetailRouteProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  return <BlogDetailPage slug={slug} />;
}
