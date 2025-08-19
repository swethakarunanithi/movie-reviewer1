import { reviewsData } from "./data.js";
const movieTitleInput = document.getElementById("movie-title-input");
const reviewInput = document.getElementById("review-input");
const submitBtn = document.getElementById("submit-review");
const reviewsFeed = document.getElementById("reviews-feed");
const stars = document.querySelectorAll(".star");

let selectedRating = 0;    

document.addEventListener("click", function (e) {
    if (e.target.dataset.rating) {
        starClick(e.target.dataset.rating);
    } else if (e.target.dataset.like) {
        likeClick(e.target.dataset.like);
    } else if (e.target.dataset.helpful) {
        helpfulClick(e.target.dataset.helpful);
    } else if (e.target.dataset.comments) {
        commentsClick(e.target.dataset.comments);
    }
});

function starClick(rating) {
    selectedRating = parseInt(rating);
    stars.forEach(function (star, index) {
        if (index < selectedRating) {
            star.classList.add("active");
        } else {
            star.classList.remove("active");
        }
    });
}


function likeClick(reviewId) {
    const targetReview = reviewsData.filter(function (review) {
        return review.id === reviewId;
    })[0];

    if (targetReview.isLiked) {
        targetReview.isLiked = false;
        targetReview.likes--;
    } else {
        targetReview.isLiked = true;
        targetReview.likes++;
    }
    view();
}


function helpfulClick(reviewId) {
    const targetReview = reviewsData.filter(function (review) {
        return review.id === reviewId;
    })[0];

    if (targetReview.isHelpful) {
        targetReview.isHelpful = false;
        targetReview.helpful--;
    } else {
        targetReview.isHelpful = true;
        targetReview.helpful++;
    }
    view();
}


function commentsClick(reviewId) {
    document.getElementById(`comments-${reviewId}`).classList.toggle("hidden");
}


submitBtn.addEventListener("click", function () {
    if (movieTitleInput.value && reviewInput.value && selectedRating > 0) {
        const newReview = {
            id: Date.now().toString(),
            movieTitle: movieTitleInput.value,
            reviewerName: "You",
            reviewerAvatar:
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
            rating: selectedRating,
            reviewText: reviewInput.value,
            likes: 0,
            helpful: 0,
            isLiked: false,
            isHelpful: false,
            comments: [],
        };

        reviewsData.unshift(newReview);

        // Clear form
        movieTitleInput.value = "";
        reviewInput.value = "";
        selectedRating = 0;
        stars.forEach(function (star) {
            star.classList.remove("active");
        });

        view();
    }
});


function getReviewsHTML() {
    let html = "";

    reviewsData.forEach(function (review) {
        let likeClass = review.isLiked ? "liked" : "";
        let helpfulClass = review.isHelpful ? "helpful" : "";

        
        let ratingHTML = "";
        for (let i = 1; i <= 5; i++) {
            if (i <= review.rating) {
                ratingHTML += '<i class="fas fa-star rating-star"></i>';
            } else {
                ratingHTML +=
                    '<i class="far fa-star rating-star" style="color: #ddd;"></i>';
            }
        }

       
        let commentsHTML = "";
        if (review.comments.length > 0) {
            review.comments.forEach(function (comment) {
                commentsHTML += `
                            <div class="comment">
                                <div class="comment-author">${comment.author}</div>
                                <div class="comment-text">${comment.text}</div>
                            </div>
                        `;
            });
        }

        html += `
                    <div class="review-card">
                        <div class="review-header">
                            <img src="${review.reviewerAvatar}" alt="${review.reviewerName}" class="reviewer-avatar">
                            <div class="reviewer-info">
                                <h3>${review.reviewerName}</h3>
                                <div class="movie-title">${review.movieTitle}</div>
                            </div>
                        </div>
                        <div class="rating-display">
                            ${ratingHTML}
                        </div>
                        <div class="review-text">${review.reviewText}</div>
                        <div class="review-actions">
                            <button class="action-btn ${likeClass}" data-like="${review.id}">
                                <i class="fas fa-heart"></i>
                                ${review.likes}
                            </button>
                            <button class="action-btn ${helpfulClass}" data-helpful="${review.id}">
                                <i class="fas fa-thumbs-up"></i>
                                ${review.helpful}
                            </button>
                            <button class="action-btn" data-comments="${review.id}">
                                <i class="fas fa-comment"></i>
                                ${review.comments.length}
                            </button>
                        </div>
                        <div class="comments-section hidden" id="comments-${review.id}">
                            ${commentsHTML}
                        </div>
                    </div>
                `;
    });

    return (
        html ||
        '<div class="no-reviews">No reviews yet. Be the first to review a movie!</div>'
    );
}


function view() {
    reviewsFeed.innerHTML = getReviewsHTML();
}
view();
