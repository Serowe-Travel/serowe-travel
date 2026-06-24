import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSiteImages } from "@/lib/queries";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const images = await getSiteImages();

  return (
    <>
      <Header logoSrc={images.logo} />
      <main className="flex-1">{children}</main>
      <Footer logoSrc={images.logo} />
    </>
  );
}
