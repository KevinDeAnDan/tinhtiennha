<script setup lang="ts">
import dayjs from "dayjs";

// Thời gian -------------------------------------------------------
const currentDate = reactive({
  time: "",
  date: "",
});

const updateTime = () => {
  currentDate.time = dayjs().format("HH:mm:ss");
  currentDate.date = dayjs().format("DD-MM-YYYY");
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
  await resetMustPay()
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

    mustPay.one = moneyTwo - one;
    mustPay.two = moneyOne + moneyTwo - two;
    mustPay.three = moneyOne + moneyTwo - three;
    mustPay.four = moneyOne + moneyTwo - four;
    mustPay.five = moneyOne + moneyTwo - five;
  }
}, 1000)
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
                class="btn btn-danger w-100 mb-3"
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
                class="btn btn-danger w-100 mb-3"
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
        <button class="btn btn-success w-100 btn-loader" @click="handleBargain">
          <Icon class="icon" name="ri:exchange-dollar-line" /> Chuyển đổi
        </button>
      </div>
      <div class="col-lg-3">
        <div class="card">
          <div class="card-body">
            <p class="card-title text-uppercase text-center mb-5">
              Cái giá phải trả
            </p>
            <div class="alert alert-primary" role="alert">
              Đan {{ mustPay.one }}K
            </div>
            <div class="alert alert-secondary" role="alert">
              Duy {{ mustPay.two }}K
            </div>
            <div class="alert alert-success" role="alert">
              Hải {{ mustPay.three }}K
            </div>
            <div class="alert alert-danger" role="alert">
              Hùng {{ mustPay.four }}K
            </div>
            <div class="alert alert-warning" role="alert">
              Hào {{ mustPay.five }}K
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wapper {
  background-color: #f0f1f7;
  height: 100vh;
}

.card {
  border: none;
  padding: 1rem;
}

.card-title {
  font-weight: 500;
}

.icon {
  font-size: 2rem;
}
</style>
