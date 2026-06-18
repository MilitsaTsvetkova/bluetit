import { type Request, type Response } from 'express';
import { reviewService } from '../services/review.service';

export const reviewController = {
  getProductReviews: async (req: Request, res: Response) => {
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
      const reviews = await reviewService.getProductReviews(productId);

      res.json(reviews);
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      res
        .status((error as any).status || 500)
        .json({ error: (error as Error).message || 'Internal server error' });
    }
  },
  async summarizeReviews(req: Request, res: Response) {
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID.' });
      return;
    }
    try {
      const summary = await reviewService.summarizeReviews(productId);
      res.json({ summary });
    } catch (error) {
      console.error('Error summarizing product reviews:', error);
      res
        .status((error as any).status || 500)
        .json({ error: (error as Error).message || 'Internal server error' });
    }
  },
};
