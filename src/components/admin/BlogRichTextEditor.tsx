import dynamic from "next/dynamic";

const BlogRichTextEditor = dynamic(() => import("./BlogRichTextEditorClient"), {
  ssr: false,
});

export default BlogRichTextEditor;
