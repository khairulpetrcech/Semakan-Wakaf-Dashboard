export interface WakafRecord {
  id: string;
  invoiceNo: string;
  phoneNo: string;
  donorName: string;
  amount: string;
  institutionName: string;
  notes: string;
  date: string;
  media: MediaItem[];
  deliveryInstitution?: string;
  deliveryDate?: string;
}

export interface MediaItem {
  type: 'image' | 'video' | 'telegram';
  url: string;
  caption?: string;
}

export type SearchType = 'invoice' | 'phone';