const Octokit = require("@octokit/rest");
const octokit = Octokit({
    auth: process.env.GITHUB_AUTH_TOKEN
});
console.log(process.env.GITHUB_AUTH_TOKEN);
async function getPRData(owner, repo) {
    let data = {
        nodes: [],
        links: []
    };

    const pulls = await octokit.paginate('GET /repos/:owner/:repo/pulls', {
        owner: owner,
        repo: repo,
        state: 'all'
    });
    for (const pull of pulls) {
        const reviews = await octokit.paginate('GET /repos/:owner/:repo/pulls/:pull_number/reviews', {
            owner: owner,
            repo: repo,
            pull_number: pull.number
        });
        if (!data.nodes.find(({name}) => name === pull.user.login)) {
            data.nodes.push({'name': pull.user.login, 'PR comments': 0, 'PR approvals': 0});
        }
        for (const review of reviews) {
            if (!data.nodes.find(({name}) => name === review.user.login)) {
                data.nodes.push({'name': review.user.login, 'PR comments': 0, 'PR approvals': 0});
            }

            if (!data.links.find(({source, target}) => (source === review.user.login && target === pull.user.login) || (target === review.user.login && source === pull.user.login))) {
                data.links.push({
                    'source': review.user.login,
                    "target": pull.user.login,
                    "approvals": 0,
                    "request_changes": 0
                });
            }
            const nodeIndex = data.nodes.findIndex(({name}) => name === review.user.login);
            const linkIndex = data.links.findIndex(({source, target}) => (source === review.user.login && target === pull.user.login) || (target === review.user.login && source === pull.user.login));
            switch (review.state) {
                case 'APPROVED':
                    data.nodes[nodeIndex]["PR approvals"] += 1;
                    data.links[linkIndex]["approvals"] += 1;
                    break;
                case 'COMMENTED':
                    data.nodes[nodeIndex]["PR comments"] += 1;
                    break;
                case 'CHANGES_REQUESTED':
                    data.links[linkIndex]["request_changes"] += 1;
                    break;
                default:
                    console.log('Unhandled review state: ' + review.state);
                    break;
            }
        }
    }
    return data;
}

module.exports.getPRData = getPRData;