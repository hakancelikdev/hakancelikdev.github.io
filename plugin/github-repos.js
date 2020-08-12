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
        <hr/>
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
                        </span>
                        </ol>
                    </nav>
                    <br/>
                    <div class="mt-2">
                        <span class="Counter ml-1">Stars ${repo.stargazers_count}</span>
                        <span class="Counter ml-1">Forks ${repo.forks_count}</span>
                    </div>
                    <br/>
                    <div>
                        <span>${repo.description || ""}</span>
                    </div>
                    <div>
                    <span>
                            <svg height="16" class="octicon octicon-link flex-shrink-0 mr-2" mr="2" classes="flex-shrink-0" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg>
                            <a href="${repo.homepage}">${repo.homepage || ""}</a>
                        </span>
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
