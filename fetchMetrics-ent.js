// fetchMetrics.js
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const enterpriseName = process.env.ENTERPRISE_NAME;

async function fetchMetrics() {
  const orgs = await octokit.paginate(octokit.rest.enterprise.getOrgs, {
    enterprise: enterpriseName,
  });

  for (const org of orgs) {
    const repos = await octokit.paginate(octokit.rest.repos.listForOrg, {
      org: org.login,
      type: 'public',
    });

    for (const repo of repos) {
      const stats = await octokit.rest.repos.getParticipationStats({
        owner: org.login,
        repo: repo.name,
      });

      console.log(`Participation metrics for ${org.login}/${repo.name}:`, stats.data);
    }
  }
}

fetchMetrics().catch(console.error);