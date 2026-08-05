import React, { useEffect } from 'react';
import { Business } from '../types';

interface SEOProps {
  business?: Business | null;
  searchQuery?: string;
  category?: string;
}

export const SEO: React.FC<SEOProps> = ({ business, searchQuery, category }) => {
  useEffect(() => {
    // 1. Dynamic Title
    let pageTitle = 'چی کجا | موتور جستجوی محلی کالا، خدمات و کسب‌وکارها';
    let pageDesc = 'موتور هوشمند جستجوی محلی کالا، خدمات، راسته‌های بازار و کسب‌وکارهای ایران با ساعات کاری و موقعیت زنده';

    if (business) {
      pageTitle = `چی کجا | ${business.name} (${business.category}) - تلفن و آدرس`;
      pageDesc = `${business.name} در ${business.address}. ${business.shortDescription || 'مشاهده ساعات کاری، تماس و مسیریابی زنده در چی کجا.'}`;
    } else if (searchQuery) {
      pageTitle = `چی کجا | جستجوی ${searchQuery} در نزدیک شما`;
      pageDesc = `نتایج جستجو برای ${searchQuery} - مشاغل، فروشگاه‌ها و خدمات نزدیک شما در چی کجا.`;
    } else if (category) {
      pageTitle = `چی کجا | اصناف و کسب‌وکارهای دسته ${category}`;
      pageDesc = `لیست کامل کسب‌وکارها و خدمات ${category} با آدرس، شماره تماس و وضعیت فعالیت در چی کجا.`;
    }

    document.title = pageTitle;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', pageDesc);

    // Update Open Graph Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', pageTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', pageDesc);

    // 2. Schema.org LocalBusiness JSON-LD Injection
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    if (business) {
      const jsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: business.name,
        description: business.shortDescription || business.activityTitle,
        telephone: business.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: business.address,
          addressLocality: business.city || 'تهران',
          addressCountry: 'IR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: business.lat,
          longitude: business.lng,
        },
        category: business.category,
        image: business.images && business.images.length > 0 ? business.images[0] : undefined,
      };

      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLdData);
      document.head.appendChild(script);
    }

    return () => {
      const script = document.getElementById('json-ld-schema');
      if (script) script.remove();
    };
  }, [business, searchQuery, category]);

  return null;
};
