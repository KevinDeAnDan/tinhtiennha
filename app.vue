<script setup lang="ts">
import dayjs from "dayjs";
import html2canvas from "html2canvas";

// Thời gian -------------------------------------------------------
const currentDate = reactive({
  time: "",
  date: "",
  month: "",
  year: "",
  payHome: 0,
  payInternet: 0,
});

const updateTime = () => {
  currentDate.time = dayjs().format("HH:mm:ss");
  currentDate.date = dayjs().format("DD-MM-YYYY");

  // Lấy thông tin về tháng và năm
  currentDate.month = dayjs().format("MM"); // Lấy thông tin về tháng
  const currentMonth = parseInt(currentDate.month);
  currentDate.year = dayjs().format("YYYY"); // Lấy thông tin về năm

  const monthsPayHome = [2, 5, 8, 11];
  const monthsPayInternet = [5, 10];

  let nextPaymentHomeMonth = monthsPayHome.find(
    (month) => month > currentMonth
  );
  let nextPaymentInternetMonth = monthsPayInternet.find(
    (month) => month > currentMonth
  );

  if (!nextPaymentHomeMonth) {
    nextPaymentHomeMonth = monthsPayHome[0]; // Nếu đã vượt qua tất cả các tháng trong năm, thì chọn tháng đầu tiên trong danh sách làm tháng kế tiếp
  }

  if (!nextPaymentInternetMonth) {
    nextPaymentInternetMonth = monthsPayInternet[0]; // Nếu đã vượt qua tất cả các tháng trong năm, thì chọn tháng đầu tiên trong danh sách làm tháng kế tiếp
  }
  currentDate.payHome = nextPaymentHomeMonth;
  currentDate.payInternet = nextPaymentInternetMonth;
};
// -----------------------------------------------------------------
// Ẩn/ Hiện Button -------------------------------------------------
interface CurrentToggle {
  moneyHome: Ref<boolean>;
  moneyInternet: Ref<boolean>;
}

const currentToggle = reactive({
  moneyHome: false,
  moneyInternet: false,
});

const handleToggle = (key: keyof CurrentToggle, value: boolean) => {
  currentToggle[key] = value;
};
// -----------------------------------------------------------------

// Số tiền sinh hoạt -----------------------------------------------
const rentMoney = reactive({
  electronic: "",
  water: "",
  home: "",
  internet: "",
  total: 0,
});

const totalAutoMoney = () => {
  const electronic = parseFloat(rentMoney.electronic) || 0;
  const water = parseFloat(rentMoney.water) || 0;
  const home = parseFloat(rentMoney.home) || 0;
  const internet = parseFloat(rentMoney.internet) || 0;

  rentMoney.total = electronic + water + home + internet;
};
//------------------------------------------------------------------
// Số tiền đồ -----------------------------------------------
const moneyBuy = reactive({
  one: "",
  two: "",
  three: "",
  four: "",
  five: "",
  total: 0,
});

const totalAutoMoneyBuy = () => {
  const one = parseFloat(moneyBuy.one) || 0;
  const two = parseFloat(moneyBuy.two) || 0;
  const three = parseFloat(moneyBuy.three) || 0;
  const four = parseFloat(moneyBuy.four) || 0;
  const five = parseFloat(moneyBuy.five) || 0;

  moneyBuy.total = one + two + three + four + five;
};
//------------------------------------------------------------------
// LoadData --------------------------------------------------------
onMounted(() => {
  setInterval(() => {
    updateTime();
    totalAutoMoney();
    totalAutoMoneyBuy();
  }, 1000);
});
// -----------------------------------------------------------------

// Trả giá

const mustPay = reactive({
  one: 0,
  two: 0,
  three: 0,
  four: 0,
  five: 0,
});

const resetMustPay = () => {
  mustPay.one = 0;
  mustPay.two = 0;
  mustPay.three = 0;
  mustPay.four = 0;
  mustPay.five = 0;
};

const handleBargain = async () => {
  await resetMustPay();
  setTimeout(() => {
    if (
      typeof rentMoney.total === "number" &&
      typeof moneyBuy.total === "number"
    ) {
      const moneyOne = rentMoney.total / 4;
      const moneyTwo = moneyBuy.total / 5;

      const one = parseFloat(moneyBuy.one) || 0;
      const two = parseFloat(moneyBuy.two) || 0;
      const three = parseFloat(moneyBuy.three) || 0;
      const four = parseFloat(moneyBuy.four) || 0;
      const five = parseFloat(moneyBuy.five) || 0;

      // Số tiền mỗi người trả || Số 1 là người trả tiền điện nước nhà mạng ...
      mustPay.one = parseFloat((moneyTwo - one).toFixed(2));
      mustPay.two = parseFloat((moneyOne + moneyTwo - two).toFixed(2));
      mustPay.three = parseFloat((moneyOne + moneyTwo - three).toFixed(2));
      mustPay.four = parseFloat((moneyOne + moneyTwo - four).toFixed(2));
      mustPay.five = parseFloat((moneyOne + moneyTwo - five).toFixed(2));

      let receiveBack: any = "K (nhận lại)";
      let noReceiveBack: any = "K";

      if (mustPay.one < 0) {
        mustPay.one += receiveBack;
      } else if (mustPay.one > 0) {
        mustPay.one += noReceiveBack;
      }
      if (mustPay.two < 0) {
        mustPay.two += receiveBack;
      } else if (mustPay.two > 0) {
        mustPay.two += noReceiveBack;
      }
      if (mustPay.three < 0) {
        mustPay.three += receiveBack;
      } else if (mustPay.three > 0) {
        mustPay.three += noReceiveBack;
      }
      if (mustPay.four < 0) {
        mustPay.four += receiveBack;
      } else if (mustPay.four > 0) {
        mustPay.four += noReceiveBack;
      }
      if (mustPay.five < 0) {
        mustPay.five += receiveBack;
      } else if (mustPay.five > 0) {
        mustPay.five += noReceiveBack;
      }
    }
    showToast();
  }, 1000);
  setTimeout(() => {
    hideToast();
  }, 3000);
};

const captureScreen = async () => {
  try {
    const rowElement = document.querySelector(".wapper") as HTMLElement;

    if (rowElement) {
      const screenshot = await html2canvas(rowElement);
      const imageBase64 = screenshot.toDataURL("image/png");

      const img = new Image();
      img.src = imageBase64;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const item = new ClipboardItem({ "image/png": blob });
              navigator.clipboard.write([item]).then(
                () => {
                  console.log("Image copied to clipboard!");
                },
                (err) => {
                  console.error("Unable to copy image to clipboard:", err);
                }
              );
            } else {
              console.error("Blob is null");
            }
          });
        }
      };
    } else {
      console.error('No element with class "row" found');
    }
    showToastOther();
    setTimeout(() => {
      hideToastOther();
  }, 3000);
  } catch (error) {
    console.error(
      'Error capturing and copying the element with class "row":',
      error
    );
  }
};

const isActive = reactive({
  submit: false,
  check: false
})

const showToast = () => {
  isActive.submit = true;
};

const hideToast = () => {
  isActive.submit = false;
};

const showToastOther = () => {
  isActive.check = true;
};

const hideToastOther = () => {
  isActive.check = false;
};
</script>

<template>
  <div class="wapper d-flex justify-content-center align-items-center">
    <div class="row d-flex justify-content-center align-items-center">
      <div class="col-lg-3">
        <div class="card">
          <div class="card-body">
            <p class="card-title text-uppercase text-center">Tiền sinh hoạt</p>
            <div>
              <label class="mt-3 card-title">Tiền điện</label>
              <input
                type="text"
                class="form-control"
                id="input-electronic"
                placeholder="Nhập tiền điện"
                v-model="rentMoney.electronic"
              />
            </div>
            <div>
              <label class="mt-3 card-title">Tiền nước</label>
              <input
                type="text"
                class="form-control"
                id="input-water"
                placeholder="Nhập tiền nước"
                v-model="rentMoney.water"
              />
            </div>
            <div v-if="currentToggle.moneyHome">
              <label class="mt-3 card-title">Tiền nhà</label>
              <input
                type="text"
                class="form-control"
                id="input-home"
                placeholder="Nhập tiền nhà"
                v-model="rentMoney.home"
              />
            </div>
            <div v-if="currentToggle.moneyInternet">
              <label class="mt-3 card-title">Tiền Internet</label>
              <input
                type="text"
                class="form-control"
                id="input-internet"
                placeholder="Nhập tiền Internet"
                v-model="rentMoney.internet"
              />
            </div>
            <div class="mt-3">
              <btn
                v-if="!currentToggle.moneyHome"
                class="btn btn-primary w-100 mb-3"
                @click="handleToggle('moneyHome', true)"
                >Thêm tiền nhà</btn
              >
              <btn
                v-if="currentToggle.moneyHome"
                class="btn btn-secondary w-100 mb-3"
                @click="handleToggle('moneyHome', false)"
                >Ẩn tiền nhà</btn
              >
              <btn
                v-if="!currentToggle.moneyInternet"
                class="btn btn-primary w-100 mb-3"
                @click="handleToggle('moneyInternet', true)"
                >Thêm tiền Internet</btn
              >
              <btn
                v-if="currentToggle.moneyInternet"
                class="btn btn-secondary w-100 mb-3"
                @click="handleToggle('moneyInternet', false)"
                >Ẩn tiền Internet</btn
              >
            </div>
            <hr />
            <label class="mt-3 card-title"
              >Tổng cộng: {{ rentMoney.total }}K</label
            >
          </div>
        </div>
      </div>
      <div class="col-lg-3">
        <div class="card">
          <div class="card-body">
            <p class="card-title text-uppercase text-center">Tiền đồ đã mua</p>
            <div>
              <label class="mt-3 card-title">Đan</label>
              <input
                type="text"
                class="form-control"
                id="input-home"
                placeholder="Nhập số tiền"
                v-model="moneyBuy.one"
              />
            </div>
            <div>
              <label class="mt-3 card-title">Duy</label>
              <input
                type="text"
                class="form-control"
                id="input-home"
                placeholder="Nhập số tiền"
                v-model="moneyBuy.two"
              />
            </div>
            <div>
              <label class="mt-3 card-title">Hải</label>
              <input
                type="text"
                class="form-control"
                id="input-home"
                placeholder="Nhập số tiền"
                v-model="moneyBuy.three"
              />
            </div>
            <div>
              <label class="mt-3 card-title">Hùng</label>
              <input
                type="text"
                class="form-control"
                id="input-home"
                placeholder="Nhập số tiền"
                v-model="moneyBuy.four"
              />
            </div>
            <div>
              <label class="mt-3 card-title">Hào</label>
              <input
                type="text"
                class="form-control"
                id="input-home"
                placeholder="Nhập số tiền"
                v-model="moneyBuy.five"
              />
            </div>
            <hr />
            <label class="mt-3 card-title"
              >Tổng cộng: {{ moneyBuy.total }}K</label
            >
          </div>
        </div>
      </div>
      <div class="col-lg-3 d-flex justify-content-center align-items-center">
        <button
          class="btn btn-success w-100 btn-loader"
          @click="handleBargain"
          id="liveToastBtn"
        >
          <Icon class="icon" name="ri:exchange-dollar-line" /> Chuyển đổi
        </button>
      </div>
      <div class="col-lg-3">
        <div class="card">
          <div class="card-body">
            <p class="card-title text-uppercase text-center">
              Cái giá phải Trả <br />
              tháng {{ currentDate.month }}/{{ currentDate.year }}
            </p>
            <div class="alert alert-danger" role="alert">
              <span
                >Dự kiến thu tiền nhà: <br /><span class="text-danger fw-bold"
                  >15/{{ currentDate.payHome }}/{{ currentDate.year }}</span
                ></span
              ><br />
              <span
                >Dự kiến thu tiền Net: <br /><span class="text-danger fw-bold"
                  >1/{{ currentDate.payInternet }}/{{ currentDate.year }}</span
                ></span
              >
            </div>
            <div class="alert alert-primary" role="alert">
              <span class="fw-bold"></span> Đan {{ mustPay.one }}
            </div>
            <div class="alert alert-primary" role="alert">
              Duy {{ mustPay.two }}
            </div>
            <div class="alert alert-primary" role="alert">
              Hải {{ mustPay.three }}
            </div>
            <div class="alert alert-primary" role="alert">
              Hùng {{ mustPay.four }}
            </div>
            <div class="alert alert-primary" role="alert">
              Hào {{ mustPay.five }}
            </div>
            <hr />
            <div>
              <button class="btn btn-danger w-100" id="liveToast" @click="captureScreen">
                In hóa đơn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
    <div
      id="liveToast"
      class="toast"
      :class="isActive.submit ? 'show' : 'hide'"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div
        class="toast-body d-flex justify-content-between align-items-center btn btn-success"
      >
        <strong class="me-auto"
          ><Icon name="ri:checkbox-circle-line" /> Chuyển đổi thành công</strong
        >
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
          @click="hideToast"
        ></button>
      </div>
    </div>
  </div>

  <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
    <div
      id="liveToast"
      class="toast"
      :class="isActive.check ? 'show' : 'hide'"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div
        class="toast-body d-flex justify-content-between align-items-center btn btn-danger"
      >
        <strong class="me-auto"
          ><Icon name="ri:checkbox-circle-line" /> In hóa đơn thành công</strong
        >
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
          @click="hideToastOther"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wapper {
  background-color: #f0f1f7;
  height: 100vh;
  padding: 20px;
}

.card {
  border: none;
  padding: 0.5rem;
}

.card-title {
  font-weight: 500;
}

.icon {
  font-size: 1.5rem;
}


@keyframes bounceInRight {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  25% {
    opacity: 0.6;
    transform: translateX(-15%);
  }
  50% {
    opacity: 1;
    transform: translateX(0);
  }
  70% {
    transform: translateX(-5%);
  }
  85% {
    transform: translateX(1%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

.toast {
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out;
}

.show {
  animation-name: bounceInRight;
}

.hide {
  animation-name: slideOutRight;
}
</style>
