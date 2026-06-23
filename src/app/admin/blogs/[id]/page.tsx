import EditBlogPage from "@/components/pages/blogs/EditBlogPage";

interface EditBlogPageRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPageRoute({ params }: EditBlogPageRouteProps): Promise<React.JSX.Element> {
  const { id } = await params;
  return <EditBlogPage id={id} />;
}
