export type PortfolioPost = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  image_url: string | null;
  video_url: string | null;
  created_at: string;
};

export type PortfolioPostInsert = Omit<PortfolioPost, "id" | "created_at">;

export type SiteUpdate = {
  id: string;
  /** English original — also the fallback when a translation is blank. */
  message: string;
  message_hi: string | null;
  message_hinglish: string | null;
  message_pa: string | null;
  kind: "update" | "tip";
  is_active: boolean;
  created_at: string;
};

export type SiteUpdateInsert = Omit<SiteUpdate, "id" | "created_at">;

export type SlideTopic = "claude" | "chatgpt" | "linkedin" | "news";

export type HomeSlide = {
  id: string;
  topic: SlideTopic;
  /** English original — also the fallback when a translation is blank. */
  title: string;
  title_hi: string | null;
  title_hinglish: string | null;
  title_pa: string | null;
  body: string | null;
  body_hi: string | null;
  body_hinglish: string | null;
  body_pa: string | null;
  image_url: string | null;
  link_url: string | null;
  /** Screenshot mode: show only the image, no title/description text on the card. */
  image_only: boolean;
  /** 'contain' shows the whole image; 'cover' fills the card and crops. */
  image_fit: ImageFit;
  title_size: TextSize;
  title_font: FontChoice;
  body_size: TextSize;
  body_font: FontChoice;
  is_active: boolean;
  created_at: string;
};

export type ImageFit = "contain" | "cover";
export type TextSize = "small" | "medium" | "large";
export type FontChoice = "sans" | "serif" | "mono";

export type HomeSlideInsert = Omit<HomeSlide, "id" | "created_at">;

export type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
  is_active: boolean;
  created_at: string;
};

export type ServiceImage = {
  /** Matches services.items[].id in the locale files. */
  service_id: string;
  image_url: string;
  is_active: boolean;
  updated_at: string;
};

export type Client = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  is_active: boolean;
  created_at: string;
};
