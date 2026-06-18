import { llmClient } from '../llm/client';
import template from '../llm/prompts/summarize-reviews.txt';
import { productRepository } from '../repositories/product.repository';
import { reviewRepository } from '../repositories/review.repository';
export const reviewService = {
  getProductReviews: async (productId: number) => {
    const product = await productRepository.getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const reviews = await reviewRepository.getProductReviews(productId);
    const summary = await reviewRepository.getReviewSummary(productId);

    return {
      summary,
      reviews,
    };
  },
  summarizeReviews: async (productId: number) => {
    const product = await productRepository.getProductById(productId);
    if (!product) {
      throw new Error('Product does not exist.');
    }

    const existingSummary = await reviewRepository.getReviewSummary(productId);
    if (existingSummary) {
      return existingSummary;
    }
    const reviews = await reviewRepository.getProductReviews(productId, 10);
    if (reviews.length === 0) {
      throw new Error('No reviews found for this product');
    }

    const joinedReviews = reviews.map((r) => r.content).join('\n\n');

    const prompt = template.replace('{{reviews}}', joinedReviews);

    const { text: summary } = await llmClient.generateText({
      model: 'gpt-4o-mini',
      prompt,
      temperature: 0.2,
      maxTokens: 500,
    });

    await reviewRepository.storeReviewSummary(productId, summary);

    return summary;
  },
};
