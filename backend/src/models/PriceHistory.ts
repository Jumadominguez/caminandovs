import mongoose, { Document, Schema } from 'mongoose';

export interface IPriceHistory extends Document {
  productId: mongoose.Types.ObjectId;
  price: number;
  date: Date;
  supermarket: mongoose.Types.ObjectId;
  isOnSale?: boolean;
  salePrice?: number;
  createdAt: Date;
}

const PriceHistorySchema = new Schema<IPriceHistory>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  supermarket: {
    type: Schema.Types.ObjectId,
    ref: 'Supermarket',
    required: true
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

// Índices para optimización
PriceHistorySchema.index({ productId: 1, date: -1 });
PriceHistorySchema.index({ supermarket: 1, date: -1 });
PriceHistorySchema.index({ date: -1 });

export default mongoose.model<IPriceHistory>('PriceHistory', PriceHistorySchema);