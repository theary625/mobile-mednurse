interface ArticleSchemaProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
  authorCredentials?: string;
  url: string;
  imageUrl?: string;
}

const ArticleSchema = ({
  title,
  description,
  datePublished,
  dateModified,
  authorName = "MedNurse Clinical Team",
  authorCredentials = "Board Certified Pharmacotherapy Specialists and Critical Care Nurses",
  url,
  imageUrl = "https://mednurse.com/og-image.png",
}: ArticleSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      "@type": "Person",
      name: authorName,
      jobTitle: authorCredentials,
      worksFor: {
        "@type": "Organization",
        name: "MedNurse",
        url: "https://mednurse.com",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "MedNurse",
      url: "https://mednurse.com",
      logo: {
        "@type": "ImageObject",
        url: "https://mednurse.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: imageUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default ArticleSchema;
