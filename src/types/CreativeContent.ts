
export interface CreativeContent {
  id: string;
  type: 'image' | 'quote' | 'concept' | 'video';
  title?: string;
  description?: string;
  content?: string;
  author?: string;
  imageUrl?: string;
  source?: string;
  category: string;
  tags?: string[];
  url?: string;
  createdAt: Date;
  isSaved?: boolean;
}
