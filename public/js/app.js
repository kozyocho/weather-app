const clearButton = document.getElementById("js-clear-button");
//入力された文字列を取得
const inputField = document.getElementById("js-input-city");

window.onload = function () {
  const requestButton = document.getElementById("js-weather-request");
  requestButton.addEventListener("click", async function () {
    const cityName = inputField.value.trim();

    if (!cityName) {
      alert("都市を入力してください。");
      return;
    }

    // バツボタンを表示
    clearButton.style.display = "block";

    // /api/cities にリクエストを送り、サーバー内にある cityName.jsonのデータを受け取っている。
    const lnglat = await searchCitiesOnServer(cityName);
    console.log("緯度経度：" + lnglat);

    if (!lnglat) {
      alert("一致する都市が見つかりませんでした。");
      return;
    }

    try {
      //経度：longitude
      //緯度：latitude
      //api叩く
      //取得した緯度経度をクエリに付与して呼び出す
      const response = await fetch(`/weather?lnglat=${lnglat}`);

      if (!response.ok) {
        throw new Error("Failed to fetch weather");
      }
      const data = await response.json();
      //console.log("Weather data:", data);

      //気温を取得
      const temperature = data.weather.main.temp;

      //アイコンを取得
      const weatherIcon = data.weather.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@4x.png`;

      //取得したデータをHTMLにする
      setDataToHtml(temperature, iconUrl, cityName);
    } catch (error) {
      console.error(error);
    }
  });
};

clearButton.addEventListener("click", () => {
  inputField.value = ""; // 入力欄をクリア
  clearButton.style.display = "none"; // バツボタンを非表示
});

async function searchCitiesOnServer(cityName) {
  try {
    // サーバーの "/api/cities" から全データを取得
    const response = await fetch("/api/cities");
    if (!response.ok) {
      throw new Error("Failed to fetch city data from server.");
    }
    const allCities = await response.json();

    // 受け取った配列から部分一致検索
    const found = allCities.find((item) => item.name.includes(cityName));

    // 見つかったら lnglat を返す
    return found ? found.lnglat : null;
  } catch (error) {
    console.error(`サーバーからのデータ取得エラー： ${error}`);
    return null;
  }
}

//取得したデータをhtml要素に入れる
function setDataToHtml(temperature, icon, cityName) {
  let cityNameText = document.getElementById("js-city-name");
  let imageParent = document.getElementById("js-weather-image"); // アイコン画像の親要素
  let imgElement;

  if (imageParent.querySelector("img")) {
    //子要素に既にimgタグがあれば消す
    imgElement = imageParent.querySelector("img");
    imageParent.removeChild(imgElement);
  } else {
    imgElement = document.createElement("img");
  }
  let tempText = document.getElementById("js-temp");

  //入力された都市名を表示
  cityNameText.innerText = cityName;

  //アイコンを設定
  imgElement.src = icon;
  imgElement.alt = "天気のアイコン画像";
  imageParent.appendChild(imgElement);

  //気温を表示
  tempText.innerText = temperature + " ℃";
}
