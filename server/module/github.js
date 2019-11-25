const axios = require('axios');
const logger = require('tracer').console();

/**
 * @param username {string} the username to request
 * @returns https://developer.github.com/v3/users/#get-a-single-user
 */
github.prototype.getUser = (username) => {
    return get(`/users/${username}`);
};

/**
 * @param repoOwner {string} repo owners
 * @param repoName {string} repo name
 * @param state {string} Either open, closed, or all to filter by state. Default: open
 * @param page
 * @param numPerPage
 * @returns https://developer.github.com/v3/pulls/#list-pull-requests
 */
github.prototype.listPRs = (repoOwner, repoName, state='open', page=1, numPerPage=30) => {
    return get(`/repos/${repoOwner}/${repoName}/pulls?state=${state}&page=${page}&per_page=${numPerPage}`);
};

/**
 * @param repoOwner {string} repo owners
 * @param repoName {string} repo name
 * @param prNumber {number} number indicating a PR
 * @returns https://developer.github.com/v3/pulls/#get-a-single-pull-request
 */
github.prototype.retrievePR = (repoOwner, repoName, prNumber) => {
    return get(`/repos/${repoOwner}/${repoName}/pulls/${prNumber}`);
};

/**
 * @param repoOwner {string} repo owners
 * @param repoName {string} repo name
 * @param prNumber {number} number indicating a PR
 * @returns https://developer.github.com/v3/pulls/review_requests/#list-review-requests
 */
github.prototype.listPRRequestedReviewer = (repoOwner, repoName, prNumber) => {
    return get(`/repos/${repoOwner}/${repoName}/pulls/${prNumber}/requested_reviewers`);
};

/**
 * @param repoOwner {string} repo owners
 * @param repoName {string} repo name
 * @param prNumber {number} number indicating a PR
 * @returns https://developer.github.com/v3/pulls/reviews/#list-reviews-on-a-pull-request
 */
github.prototype.listPRReviews = (repoOwner, repoName, prNumber) => {
    return get(`/repos/${repoOwner}/${repoName}/pulls/${prNumber}/reviews`);
};

/**
 * @param repoOwner {string} repo owners
 * @param repoName {string} repo name
 * @param prNumber {number} number indicating a PR
 * @param reviewId {number} review id
 * @returns https://developer.github.com/v3/pulls/reviews/#get-a-single-review
 */
github.prototype.retrivePRReview = (repoOwner, repoName, prNumber, reviewId) => {
    return get(`/repos/${repoOwner}/${repoName}/pulls/${prNumber}/reviews/${reviewId}`);
};

/**
 * @param repoOwner {string} repo owners
 * @param repoName {string} repo name
 * @param prNumber {number} number indicating a PR
 * @param reviewId {numbber} review id
 * @returns https://developer.github.com/v3/pulls/reviews/#get-comments-for-a-single-review
 */
github.prototype.listPRReviewComments = (repoOwner, repoName, prNumber, reviewId) => {
    return get(`/repos/${repoOwner}/${repoName}/pulls/${prNumber}/reviews/${reviewId}/comments`);
};

/**
 * @param repoOwner {string} repo owners
 * @param repoName {string} repo name
 * @returns https://developer.github.com/v3/pulls/comments/#list-comments-in-a-repository
 */
github.prototype.listPRComments = (repoOwner, repoName) => {
    return get(`/repos/${repoOwner}/${repoName}/pulls/comments`);
};

/**
 * @param repoOwner {string} repo owners
 * @param repoName {string} repo name
 * @param commentId {number} comment id
 * @returns https://developer.github.com/v3/pulls/comments/#get-a-single-comment
 */
github.prototype.listPRComments = (repoOwner, repoName, commentId) => {
    return get(`/repos/${repoOwner}/${repoName}/pulls/comments/${commentId}`);
};


// Helpers
let githubRequest = null;

function github() {
    githubRequest = axios.create({
        baseURL: "https://api.github.com",
        timeout: 5000,
        headers: {Accept: "application/vnd.github.v3.full+json"}
    });
}

/**
 * make a get request to the provided github endpoint
 * @param {string} url a github endpoint to request
 */
function get(url) {
    return new Promise((resolve, reject) => {
        githubRequest.get(url).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(logError(err));
        });
    });
}

function logError(err) {
    logger.error("--- GITHUB REQUEST ERROR --- ");
    logger.error(err);
    logger.error("---   FINISHED LOGGING   ---");
    return err;
}

module.exports = github;
