const API_KEY = `eb563bf813ce4e3484994073af51a24b`;
let newsList = [];

const menus = document.querySelectorAll(".list-inline li");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

const getLatesNews = async () => {
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
  console.log("ddd", newsList);
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log("category", category);
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("ddd", data);
  newsList = data.articles;
  render();
};

document.addEventListener("DOMContentLoaded", () => {
  attachEventListeners();
});

const attachEventListeners = () => {
  document
    .getElementById("search-toggle")
    .addEventListener("click", toggleSearchBox);

  document
    .getElementById("search-button")
    .addEventListener("click", getNewsByKeyword);

  document
    .getElementById("search-input")
    .addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        getNewsByKeyword();
      }
    });
};

const toggleSearchBox = () => {
  const searchBox = document.getElementById("search-box");
  searchBox.style.display =
    searchBox.style.display === "flex" ? "none" : "flex";
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value.trim();
  if (!keyword) return alert("검색어를 입력해주세요.");

  console.log("검색어:", keyword);

  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`
  );

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("검색 결과:", data);

    if (data.articles.length === 0) {
      alert("검색 결과가 없습니다.");
    }

    newsList = data.articles;
    render();
  } catch (error) {
    console.error("검색 중 오류 발생:", error);
  }
};

// 200자 이상이면 ... 표기
const truncateText = (text, limit) => {
  if (!text) return "내용 없음";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

// 시간 표기 변경
const formatTimeAgo = (dateString) => {
  return moment(dateString).fromNow();
};

const render = () => {
  const newsHTML = newsList
    .map((news) => {
      const imageUrl = news.urlToImage
        ? news.urlToImage
        : "https://breffee.net/data/editor/2210/20221013104826_fd5326c8ac17c04c88d91f03a8d313d8_5r8y.jpg";

      const source = news.source?.name ? news.source.name : "no source";

      const publishedTime = news.publishedAt
        ? formatTimeAgo(news.publishedAt)
        : "날짜 없음";

      return `<div class="row news">
                <div class="col-lg-4">
                    <img class="news-img-size"
                        src="${imageUrl}"
                        onerror="this.onerror=null; this.src='https://breffee.net/data/editor/2210/20221013104826_fd5326c8ac17c04c88d91f03a8d313d8_5r8y.jpg';" />
                        
                </div>
                <div class="col-lg-8">
                    <h2>${news.title}</h2>
                    <p class=news-description>${truncateText(
                      news.description,
                      200
                    )}</p>
                    <div>${source} * ${publishedTime}</div>
                </div>
            </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};
getLatesNews();
