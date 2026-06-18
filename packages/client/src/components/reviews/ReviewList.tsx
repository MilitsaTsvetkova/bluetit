import { useEffect, useState } from 'react';
import ReviewSkeleton from './ReviewSkeleton';
import StarRating from './StarRating';

type ReviewListProps = {
  productId: number;
};

type Review = {
  id: number;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
};

type GetReviewsResponse = {
  summary: string | null;
  reviews: Review[];
};

const ReviewList = ({ productId }: ReviewListProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState<GetReviewsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/products/${productId}/reviews`);
        if (!response.ok) {
          throw new Error(`Error fetching reviews: ${response.statusText}`);
        }
        setIsLoading(true);
        const data: GetReviewsResponse = await response.json();
        setReviews(data);
      } catch (error) {
        console.error(error);
        setError((error as Error).message || 'Failed to load reviews.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3].map((key) => (
          <ReviewSkeleton key={key} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <div className="mb-5">
        <p>{reviews?.summary || 'No summary available.'}</p>
      </div>

      <div className="flex flex-col gap-5">
        {reviews?.reviews.map(({ id, author, rating, content }) => (
          <div key={id}>
            <div className="font-semibold">{author}</div>
            <div>
              <StarRating rating={rating} />
            </div>
            <p className="py-2">{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
