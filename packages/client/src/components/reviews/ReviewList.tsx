import { useQuery } from '@tanstack/react-query';
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
  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery<GetReviewsResponse>({
    queryKey: ['reviews', productId],
    queryFn: () =>
      fetch(`/api/products/${productId}/reviews`).then((res) => res.json()),
  });

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
    return (
      <p className="text-red-500">Could not fetch reviews. Try again later!</p>
    );
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
