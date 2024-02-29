// fetchMetrics.js
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const orgName = process.env.ORG_NAME;

async function fetchMetrics() {
  const repos = await octokit.paginate(octokit.rest.repos.listForOrg, {
    org: orgName,
    type: 'public',
  });

  for (const repo of repos) {
    const stats = await octokit.rest.repos.getParticipationStats({
      owner: orgName,
      repo: repo.name,
    });

    console.log(`Participation metrics for ${repo.name}:`, stats.data);
  }
}

fetchMetrics().catch(console.error);