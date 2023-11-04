// div where profile info appears
const overview = document.querySelector(".overview");
// github username
const username = "FayeVinyl";
// unordered list to display repos list
const repoList = document.querySelector(".repo-list");
// repo info section
const allReposContainer = document.querySelector(".repos");
// repo data section
const repoData = document.querySelector(".repo-data");
// back to repos button
const backToRepoGalleryButton = document.querySelector(".view-repos");
// search for repos
const filterInput = document.querySelector(".filter-repos");

// Fetch API JSON Data
const gitUserInfo = async function() {
  const userInfo = await fetch(`https://api.github.com/users/${username}`);
  const data = await userInfo.json();
  //console.log(data);
  displayUserInfo(data);
};
gitUserInfo();

//Fetch & Display User Information
const displayUserInfo = function (data) {
  const div = document.createElement("div");
  div.classList.add("user-info")
  div.innerHTML = `
    <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
    `;
    overview.append(div);
    gitRepos(username);
}

// Fetch repos
const gitRepos = async function (username) {
  const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await fetchRepos.json();
  displayRepos(repoData);
}

// Display info about 
const displayRepos = function (repos) {
  filterInput.classList.remove("hide");
  for (const repo of repos) {
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(repoItem);
  }
};

// get repo name
repoList.addEventListener("click", function (e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    getRepoInfo(repoName);
  }
});

//pull data from individual repos and languages
const getRepoInfo = async function(repoName) {
  const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
  const repoInfo = await fetchInfo.json();
  //console.log(repoInfo);

  // fetch languages
  const fetchLanguages = await fetch(repoInfo.languages_url);
  const languageData =await fetchLanguages.json();
  //console.log(languageData);

  // array of languages
  const languages = [];
  for(const language in languageData) {
    languages.push(language);
    //console.log(languages);
  }
  displayRepoInfo(repoInfo, languages);
};

// display specific repo info
const displayRepoInfo = async function(repoInfo, languages) {
  backToRepoGalleryButton.classList.remove("hide");
  repoData.innerHTML = "";
  repoData.classList.remove("hide");
  allReposContainer.classList.add("hide");
  const div = document.createElement("div");
  div.innerHTML = `
  <h3>Name: ${repoInfo.name}</h3>
  <p>Description: ${repoInfo.description}</p>
  <p>Default Branch: ${repoInfo.default_branch}</p>
  <p>Languages: ${languages.join(", ")}</p>
  <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
  `;
  repoData.append(div);
};

// Return to repo gallery button
backToRepoGalleryButton.addEventListener("click", function () {
  allReposContainer.classList.remove("hide");
  repoData.classList.add("hide");
  backToRepoGalleryButton.classList.add("hide");
});

// search through repos
filterInput.addEventListener("input", function(e) {
  const inputValue = e.target.value;
  //console.log(inputValue);
  const repos = document.querySelectorAll(".repo");
  const inputValueLower = inputValue.toLowerCase();

  for (const repo of repos) {
    const repoLower = repo.innerText.toLowerCase();
    if (repoLower.includes(inputValueLower)) {
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    }
  }
});