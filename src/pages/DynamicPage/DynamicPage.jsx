import { useParams } from "react-router-dom";
import { useAppData } from "../../hooks/useAppData";
import PageRender from "../../components/PageRender/PageRender";
import NotFound from "../NotFound/NotFound";

function DynamicPage({ slug: fixedSlug }) {
  const { slug: paramSlug = "" } = useParams();
  const slug = fixedSlug !== undefined ? fixedSlug : paramSlug;
  const { data } = useAppData();
  const pages = data.pages || [];

  const page = pages.find((p) => p.slug === slug);

  if (!page || page.enabled === false) return <NotFound />;

  return <PageRender sections={page.sections} />;
}

export default DynamicPage;
