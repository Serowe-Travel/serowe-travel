export type PackageStatus = "draft" | "published" | "archived";
export type PackageType =
  | "luxury"
  | "family"
  | "health"
  | "adventure"
  | "custom";

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
};

export type Package = {
  id: string;
  title: string;
  slug: string;
  type: PackageType;
  destination: string;
  duration: string | null;
  price: number | null;
  price_currency: string;
  description: string | null;
  inclusions: string[] | null;
  exclusions: string[] | null;
  itinerary: ItineraryDay[] | null;
  featured_image: string | null;
  gallery_images: string[] | null;
  status: PackageStatus;
  is_featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type EnquiryStatus = "new" | "in_progress" | "replied" | "closed";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  package_interest: string | null;
  status: EnquiryStatus;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  role: "admin" | "staff" | "viewer";
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: number;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  updated_at: string;
};
