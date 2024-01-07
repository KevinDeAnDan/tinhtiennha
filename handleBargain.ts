import { resetMustPay, rentMoney, moneyBuy, mustPay } from "./app.vue";

export const handleBargain = async () => {
await resetMustPay();
setTimeout(() => {
if (typeof rentMoney.total === "number" &&
typeof moneyBuy.total === "number") {
const moneyOne = rentMoney.total / 4;
const moneyTwo = moneyBuy.total / 5;

const one = parseFloat(moneyBuy.one) || 0;
const two = parseFloat(moneyBuy.two) || 0;
const three = parseFloat(moneyBuy.three) || 0;
const four = parseFloat(moneyBuy.four) || 0;
const five = parseFloat(moneyBuy.five) || 0;

// Số tiền mỗi người trả || Số 1 là người trả tiền điện nước nhà mạng ...
mustPay.one = moneyTwo - one;
mustPay.two = moneyOne + moneyTwo - two;
mustPay.three = moneyOne + moneyTwo - three;
mustPay.four = moneyOne + moneyTwo - four;
mustPay.five = moneyOne + moneyTwo - five;

let receiveBack: any = "K (nhận lại)";
let noReceiveBack: any = "K (nhận lại)";

if (mustPay.one < 0) {
mustPay.one += receiveBack;
} else if (mustPay.one) 0;
}
}); {
mustPay.one += noReceiveBack;
}
if (mustPay.two < 0) {
mustPay.two += receiveBack;
} else if (mustPay.two) 0; {
mustPay.two += noReceiveBack;
}
if (mustPay.three < 0) {
mustPay.three += receiveBack;
} else if (mustPay.three) 0; {
mustPay.three += noReceiveBack;
}
if (mustPay.four < 0) {
mustPay.four += receiveBack;
} else if (mustPay.four) 0; {
mustPay.four += noReceiveBack;
}
if (mustPay.five < 0) {
mustPay.five += receiveBack;
} else if (mustPay.five) 0; {
mustPay.five += noReceiveBack;
}
};
