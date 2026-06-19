import { useMutation, useQuery } from '@tanstack/react-query';
import { HiSparkles } from 'react-icons/hi2';
import { Button } from '../ui/button';
import ReviewSkeleton from './ReviewSkeleton';
import StarRating from './StarRating';
import {
  reviewApi,
  type GetReviewsResponse,
  type SummarizeResponse,
} from './reviewsApi';

type ReviewListProps = {
  productId: number;
};

const ReviewList = ({ productId }: ReviewListProps) => {
  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery<GetReviewsResponse>({
    queryKey: ['reviews', productId],
    queryFn: () => reviewApi.fetchReviews(productId),
  });

  const {
    mutate: summarizeReviews,
    data: summaryData,
    isPending: isSummarizing,
    error: summaryError,
  } = useMutation<SummarizeResponse>({
    mutationFn: () => reviewApi.summarizeReviews(productId),
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

  if (reviews?.reviews.length === 0) {
    return null;
  }

  const currentSummary = reviews?.summary || summaryData?.summary;

  return (
    <div>
      <div className="mb-5">
        {currentSummary ? (
          <p>{currentSummary}</p>
        ) : (
          <div>
            <Button
              onClick={() => summarizeReviews()}
              disabled={isSummarizing}
              className="cursor-pointer"
            >
              <HiSparkles /> Summarize
            </Button>
            {isSummarizing && (
              <div className="py-3">
                <ReviewSkeleton />
              </div>
            )}
            {summaryError && (
              <p className="text-red-500">
                Could not summarize reviews. Try again!
              </p>
            )}
          </div>
        )}
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
