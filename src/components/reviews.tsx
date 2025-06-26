import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import StarRating from './star-rating'
import ThumbnailGallery from "./thumbnail-gallery"
import { Rating } from "@prisma/client"
import { PopulatedRating } from "@/app/(store)/product/[slug]/page"

const PaginatedReviews = async ({ ratings, totalPages, currentPage }: { ratings: PopulatedRating[], totalPages: number, currentPage: number }) => {
    return (
        <div>
            {ratings
                .slice(0, 3)
                .map((rating, index) => {
                    const { title, description, images = [] } = rating.review as {
                        title: string;
                        description: string;
                        images: string[];
                    };
                    return <div key={index} className={`${index != (ratings.length - 1) && "border-b"} py-4`}>
                        <div className="flex items-center gap-2">
                            <StarRating rating={rating.rating!} />
                            <span className="font-medium">{title}</span>
                        </div>
                        <div className='text-base'>{description}</div>
                        <ThumbnailGallery images={images} />
                        <div className="flex items-center gap-2 mt-1">
                            <span className='text-xs'>by {rating.customer.firstName} {rating.customer.lastName}</span>
                            <span></span>
                        </div>
                    </div>
                })}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        {currentPage > 1 && <PaginationItem>
                            <PaginationPrevious

                                href={`?page=${currentPage - 1}`}
                            />
                        </PaginationItem>}

                        {Array.from({ length: totalPages }, (_, idx) => {
                            const page = idx + 1
                            return (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href={`?page=${page}`}
                                        isActive={currentPage === page}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        })}

                        {currentPage < totalPages && <PaginationItem>
                            <PaginationNext
                                href={`?page=${currentPage + 1}`}
                            />
                        </PaginationItem>}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}

export default PaginatedReviews