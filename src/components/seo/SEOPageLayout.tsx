import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LandingChatbot from "@/components/LandingChatbot";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

interface SEOPageLayoutProps {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  breadcrumbLabel: string;
  children: ReactNode;
}

const SEOPageLayout = ({
  title,
  description,
  keywords,
  canonicalUrl,
  breadcrumbLabel,
  children,
}: SEOPageLayoutProps) => {
  const fullTitle = `${title} | MedNurse`;
  const baseUrl = "https://mednurse.com";

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={`${baseUrl}${canonicalUrl}`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}${canonicalUrl}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      {/* Breadcrumb Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: breadcrumbLabel, url: canonicalUrl }
        ]}
      />

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main>
          {/* Breadcrumb */}
          <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {children}
        </main>

        <Footer />
        <LandingChatbot />
      </div>
    </>
  );
};

export default SEOPageLayout;
