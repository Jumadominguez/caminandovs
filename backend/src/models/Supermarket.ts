import mongoose, { Document, Schema } from 'mongoose';

export interface ISupermarket extends Document {
  name: string;
  code: string; // 'carrefour', 'disco', 'jumbo', 'dia', 'vea'
  baseUrl: string;
  logo?: string;
  logoTransparent?: string; // Logo con fondo transparente
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string; // Sitio web oficial adicional
  businessHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    tiktok?: string;
  };
  metaData?: {
    foundedYear?: number;
    totalStores?: number;
    coverage?: string[]; // ['Buenos Aires', 'Córdoba', etc.]
    services?: string[]; // ['Delivery', 'Retiro en tienda', etc.]
    headquarters?: string; // Ciudad sede
    ceo?: string; // CEO o presidente
    parentCompany?: string; // Empresa matriz
    marketPosition?: string; // Posición en el mercado
    certifications?: string[]; // Certificaciones ISO, etc.
    sustainability?: {
      recycling?: boolean;
      renewableEnergy?: boolean;
      carbonFootprint?: string;
    };
  };
  contactInfo?: {
    mainOffice?: string;
    customerService?: string;
    whatsapp?: string;
    emergencyContact?: string;
  };
  isActive: boolean;
  lastScraped?: Date;
  totalProducts: number;
  totalCategories: number;
  createdAt: Date;
  updatedAt: Date;
}

const SupermarketSchema = new Schema<ISupermarket>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  baseUrl: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,
    trim: true
  },
  logoTransparent: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  website: {
    type: String,
    trim: true
  },
  businessHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String,
    linkedin: String,
    tiktok: String
  },
  metaData: {
    foundedYear: Number,
    totalStores: Number,
    coverage: [String],
    services: [String],
    headquarters: String,
    ceo: String,
    parentCompany: String,
    marketPosition: String,
    certifications: [String],
    sustainability: {
      recycling: Boolean,
      renewableEnergy: Boolean,
      carbonFootprint: String
    }
  },
  contactInfo: {
    mainOffice: String,
    customerService: String,
    whatsapp: String,
    emergencyContact: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastScraped: {
    type: Date
  },
  totalProducts: {
    type: Number,
    default: 0,
    min: 0
  },
  totalCategories: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Índices para optimización
SupermarketSchema.index({ isActive: 1 });

export default mongoose.model<ISupermarket>('Supermarket', SupermarketSchema);