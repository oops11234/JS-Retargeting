const elemFile = document.querySelector('#File');
const extendDays = 1;
let jsonData = [];
let storageValue = localStorage.getItem('storageString');
let cate = parseInt(getCookieValue('cate'), 10);
let dataUrl = setDateUrl();

(async () => {
  if (isNaN(cate)) {
    fetchData();
  } else {
    if (storageValue === null) {
      const result = await getJSONData();
      setLocalStorage(result);
      elemFile.innerHTML = contentStrMaker();
    } else {
      jsonData = JSON.parse(storageValue);
      elemFile.innerHTML = contentStrMaker();
    };
  };
  setListener();
})();

function setListener() {
  elemFile.addEventListener('click', setStorage);
};

async function getJSONData() {
  const res = await fetch(dataUrl);
  return await res.json();
};

async function fetchData() {
  const result = await getJSONData();
  result.forEach(item => jsonData.push(item));
  elemFile.innerHTML = contentStrMaker();
};

function getAlt(img) {
  return img.substring(0, img.indexOf('.'));
};

function contentStrMaker(contentStr = '') {
  jsonData.map(item => {
    contentStr += `
      <div class="file__content" >
            <a href="${item.url}" target="_blank" >
              <img 
                class="file__img" 
                src="./images/${item.src}" 
                alt="${getAlt(item.src)}" 
                width="550" 
                height="330"
                data-cate="${item.cate}">
            </a>
          </div>`;
  });
  return contentStr;
};

function setLocalStorage(res) {
  jsonData = [];
  res.forEach(item => jsonData.push(item));
  storageValue = JSON.stringify(jsonData);
  localStorage.setItem('storageString', storageValue);
};

function setCookieExp(day) {
  const exp = new Date();
  exp.setDate(exp.getDate() + day);
  return exp.toUTCString();
};

async function setStorage(e) {
  const self = e.target;
  if (self.nodeName === 'IMG' && isNaN(cate)) {
    cate = parseInt(self.dataset.cate, 10);
    dataUrl = setDateUrl();
    const result = await getJSONData();
    setLocalStorage(result);
    document.cookie = `cate=${cate};expires="+${setCookieExp(extendDays)}`;
  };
};

function getCookieValue(name) {
  const cookieArr = document.cookie.split(";");
  let _cookieValue = '';
  cookieArr.forEach(item => {
    if (item.match(name)) {
      _cookieValue = item.substring(item.indexOf('=') + 1, item.length);
    };
  });
  return _cookieValue;
};

function setDateUrl() {
  switch (cate) {
    case 1:
      return './dataPackage/technology.json';
    case 2:
      return './dataPackage/daily.json';
    case 3:
      return './dataPackage/food.json';
    case 4:
      return './dataPackage/activity.json';
    default:
      return './dataPackage/normal.json';
  };
};