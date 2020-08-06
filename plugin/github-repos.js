function sortRepos(reposData) {
  let repos = reposData.filter(function (repo) {
    return !repo.private && !repo.fork;
  });
  repos.sort((repo1, repo2) => repo2.stargazers_count - repo1.stargazers_count);
  return repos;
}

const githubPlugin = (hook, vm) => {
  hook.doneEach(function () {
    if (vm.route.path !== "/") return "";
    let requests = [];
    for (let username of window.$docsify.githubRepos.username) {
      let apiUrl = `https://api.github.com/users/${username}/repos`;
      requests.push(axios.get(apiUrl));
    }
    Promise.all(requests).then(function (results) {
      let allRepos = [];
      for (result of results) for (repo of result.data) allRepos.push(repo);
      let html = ``;
      for (let repo of sortRepos(allRepos)) {
        html += `
            <div class="repos mt-3">
                    <nav aria-label="Breadcrumb">
                        <ol>
                            <svg class="octicon octicon-repo text-gray" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                                <path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
                            </svg>
                            <li class="breadcrumb-item ml-1"><a href="https://github.com/${
                              repo.owner.login
                            }">${repo.owner.login}</a></li>
                            <li class="breadcrumb-item"><a href="${
                              repo.html_url
                            }"><strong>${repo.name}</strong></a></li>
                            <span class="branch-name">
                            <svg width="10" height="16" viewBox="0 0 10 16" class="octicon octicon-git-branch" aria-hidden="true">
                                <path
                                fill-rule="evenodd"
                                d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 0 0-1-3.72C.88 1 0 1.89 0 3a2 2 0 0 0 1 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"
                                />
                            </svg>
                            <span class="ml-1">${repo.default_branch}</span>
                        </span>
                        </ol>
                    </nav>
                    <div>
                        <span>${repo.description || ""}</span>
                        <span>
                            <svg height="16" class="octicon octicon-link flex-shrink-0 mr-2" mr="2" classes="flex-shrink-0" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg>
                            <a href="${repo.homepage}">${repo.homepage}</a>
                        </span>
                    </div>
                    <div class="mt-2">
                        <span class="Counter ml-1">Forks ${repo.forks_count}</span>
                        <span class="State State--small State--green  mr-2" title="Status: open">
                        <svg class="octicon octicon-issue-opened" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
                            Issues ${repo.open_issues_count}
                        </span>
                        <span class="Counter ml-1">Stars ${repo.stargazers_count}</span>
                        <span class="Counter ml-1 bg-green text-white">${
                          repo.language
                        }</span>
                    </div>
            </div>
            `;
      }
      document
        .getElementById(window.$docsify.githubRepos.id)
        .insertAdjacentHTML("afterend", html);
    });
  });
};
window.$docsify.plugins.push(githubPlugin);
