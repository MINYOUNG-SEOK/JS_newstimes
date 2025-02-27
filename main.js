const API_KEY = `eb563bf813ce4e3484994073af51a24b`;
let newsList = [];

const menus = document.querySelectorAll(".list-inline li");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
);
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNews = async () => {
  try {
    url.searchParams.set("page", page);
    url.searchParams.set("pageSize", pageSize);

    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("검색 결과가 없습니다.");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getLatesNews = async () => {
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );
  getNews();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
  );
  getNews();
};

document.addEventListener("DOMContentLoaded", () => {
  attachEventListeners();
});

const attachEventListeners = () => {
  // 검색 아이콘 클릭 시 검색창 토글
  document.getElementById("search-toggle").addEventListener("click", () => {
    const searchBox = document.getElementById("search-box");
    searchBox.classList.toggle("show"); // 검색창 표시/숨김
  });
  document
    .getElementById("search-button")
    .addEventListener("click", getNewsByKeyword);

  // 검색창에 엔터 클릭 시 검색 실행
  document
    .getElementById("search-input")
    .addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        getNewsByKeyword();
      }
    });

  // 햄버거 버튼 클릭 시 메뉴 토글
  document.getElementById("hamburger-toggle").addEventListener("click", () => {
    document.getElementById("side-menu").classList.add("show");
  });

  // 닫기 버튼 클릭 시 메뉴 닫기
  document.getElementById("close-menu").addEventListener("click", () => {
    document.getElementById("side-menu").classList.remove("show");
  });

  const categoryMenus = document.querySelectorAll(".nyt-menu li");
  categoryMenus.forEach((menu) =>
    menu.addEventListener("click", getNewsByCategory)
  );

  const sideMenuCategories = document.querySelectorAll(".side-menu ul li");
  sideMenuCategories.forEach((menu) =>
    menu.addEventListener("click", (event) => {
      getNewsByCategory(event);
      document.getElementById("side-menu").classList.remove("show");
    })
  );
};

const toggleSearchBox = () => {
  const searchBox = document.getElementById("search-box");
  searchBox.style.display =
    searchBox.style.display === "flex" ? "none" : "flex";
};

const getNewsByKeyword = async () => {
  const searchInput = document.getElementById("search-input");
  const keyword = searchInput.value.trim();

  if (!keyword) return alert("검색어를 입력해주세요.");

  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`
  );

  getNews();
  searchInput.value = "";
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

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
  </div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);

  const pageGroup = Math.ceil(page / groupSize);

  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  let paginationHTML = ``;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${i === page ? "active" : ""}"
                            onclick="moveToPage(${i})">
                            <a class="page-link">${i}</a>
                       </li>`;
  }
  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  console.log("movetoPage", pageNum);
  page = pageNum;
  getNews();
};
getLatesNews();
