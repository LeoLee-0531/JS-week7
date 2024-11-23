let ticketList = [];

var chart = c3.generate({
  data: {
    columns: [],
    type: "donut",
  },
  donut: {
    title: "套票地區比重",
    width: 20,
    label: { show: false },
  },
});

// 透過 axios 取得遠端資料
axios
  .get(
    "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json"
  )
  .then(function (response) {
    ticketList = response.data.data;
    displayTickets(ticketList);
    regionStatistics();
  })
  .catch(function (error) {
    console.error("Error fetching data:", error);
    alert("無法獲取資料，請稍後再試");
  });

// 地區統計
function regionStatistics() {
  let regionData = {
    台北: 0,
    台中: 0,
    高雄: 0,
  };

  ticketList.forEach(function (item) {
    switch (item.area) {
      case "台北":
        regionData.台北 += 1;
        break;
      case "台中":
        regionData.台中 += 1;
        break;
      case "高雄":
        regionData.高雄 += 1;
        break;
    }
  });

  let regionArray = Object.entries(regionData);
  regionArray.forEach(function (item) {
    chart.load({
      columns: [item],
    });
  });
}

// 新增套票
const addTicketBtn = document.querySelector(".addTicket-btn");
addTicketBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (!validateTicketForm()) {
    alert("請輸入完整資訊");
    return;
  }

  const newTicket = createTicketObject();
  ticketList.push(newTicket);
  displayTickets(ticketList);
  alert("新增成功");
  clearInputFields();
});

// 表單驗證
function validateTicketForm() {
  const ticketName = document.querySelector("#ticketName").value;
  const image = document.querySelector("#ticketImgUrl").value;
  const area = document.querySelector("#ticketRegion").value;
  const description = document.querySelector("#ticketDescription").value;
  const group = document.querySelector("#ticketNum").value;
  const price = document.querySelector("#ticketPrice").value;
  const rate = document.querySelector("#ticketRate").value;

  return (
    ticketName !== "" &&
    image !== "" &&
    area !== "" &&
    description !== "" &&
    group !== "" &&
    price !== "" &&
    rate !== ""
  );
}

// 建立套票物件
function createTicketObject() {
  const id = ticketList.length;
  const ticketName = document.querySelector("#ticketName").value;
  const image = document.querySelector("#ticketImgUrl").value;
  const area = document.querySelector("#ticketRegion").value;
  const description = document.querySelector("#ticketDescription").value;
  const group = document.querySelector("#ticketNum").value;
  const price = document.querySelector("#ticketPrice").value;
  const rate = document.querySelector("#ticketRate").value;

  return {
    id: id,
    name: ticketName,
    imgUrl: image,
    area: area,
    description: description,
    group: group,
    price: price,
    rate: rate,
  };
}

// 清空輸入欄位
function clearInputFields() {
  document.querySelector(".addTicket-form").reset();
}

// 渲染套票
const ticketCard = document.querySelector(".ticketCard-area");
function displayTickets(tickets) {
  let str = "";
  tickets.forEach(function (item) {
    str += `
    <li class="ticketCard-box align-self-stretch">
      <div class="ticketCard">
        <div class="ticketCard-img">
          <a href="#">
            <img
              src="${item.imgUrl}"
              alt=""
            />
          </a>
          <div class="ticketCard-region">${item.area}</div>
          <div class="ticketCard-rank">${item.rate}</div>
        </div>
        <div class="ticketCard-content">
          <div>
            <h3>
              <a href="#" class="ticketCard-name">${item.name}</a>
            </h3>
            <p class="ticketCard-description">
              ${item.description}
            </p>
          </div>
          <div class="ticketCard-info">
            <p class="ticketCard-num">
              <span><i class="fas fa-exclamation-circle"></i></span>
              剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
            </p>
            <p class="ticketCard-price">
              TWD <span id="ticketCard-price">$${item.price}</span>
            </p>
          </div>
        </div>
      </li>
    </li>`;
  });

  ticketCard.innerHTML = str;
}

// 地區選擇
const regionSelect = document.querySelector(".regionSearch");
regionSelect.addEventListener("change", function (e) {
  const region = e.target.value;

  let filteredTickets = ticketList.filter((item) => {
    return region === "" || region === item.area;
  });

  displayTickets(filteredTickets);
});
