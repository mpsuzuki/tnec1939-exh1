function detectGitRepoInfo(config) {
  let default_branch = "main";
  if (config.branch)
    default_branch = config.branch;

  const url = window.location.href;

  // --- 1. raw.githack.com / gist.githack.com ---
  // https://raw.githack.com/username/repo/branch/...
  let m = url.match(
    /^https:\/\/[^\/]*githack\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\//
  );
  if (m) {
    return {
      hostType: "githack",
      username: m[1],
      repo: m[2],
      branch: m[3]
    };
  }

  // --- 2. GitHub Pages ---
  // https://username.github.io/repo/...
  m = url.match(/^https:\/\/([^\.]+)\.github\.io\/([^\/]+)\//);
  if (m) {
    return {
      hostType: "github-pages",
      username: m[1],
      repo: m[2],
      branch: default_branch
    };
  }

  return null;
}

async function getLatestHash(config) {
  gitRepoInfo = detectGitRepoInfo(config);

  if (!gitRepoInfo) return null;

  switch (gitRepoInfo.hostType) {
  case "github-pages":
    const api_url = [ "https://api.github.com/repos",
                      gitRepoInfo.username,
                      gitRepoInfo.repo,
                      "commits",
                      gitRepoInfo.branch ].join("/");
    const res = await fetch(api_url);
    const data = await res.json();
    return data.sha.substring(0, 10);
  default:
    return null;
  }
}
