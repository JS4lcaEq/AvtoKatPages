<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import MultySelectionFilter from "../components/MultySelectionFilter.vue";

import MSF from "../components/MultySelectionFilterV2.vue";
import Gallery from "../components/Gallery.vue";

const galleryList = [
  { id: 1, url: "./assets/img/dealer-gallery-1.JPG", w: 560 },
  { id: 5, url: "./assets/img/dealer-gallery-5.JPG", w: 190 },
  { id: 2, url: "./assets/img/dealer-gallery-2.JPG", w: 560 },
  { id: 7, url: "./assets/img/dealer-gallery-7.JPG", w: 185 },
  { id: 3, url: "./assets/img/dealer-gallery-3.JPG", w: 560 },
  { id: 6, url: "./assets/img/dealer-gallery-6.JPG", w: 185 },
  { id: 8, url: "./assets/img/dealer-gallery-8.JPG", w: 320 },
  { id: 4, url: "./assets/img/dealer-gallery-4.JPG", w: 200 },
  { id: 9, url: "./assets/img/dealer-gallery-9.JPG", w: 320 },
];

const awardsList = [
  "Royal Motors Tashkent City — официальный дилер Toyota в Узбекистане!",
  "Двукратный победитель премии «Автодилер года».",
  "2-е место в рейтинге продавцов поддержанных автомобилей по версии Forbes.",
];
const awardsList2 = [
  "21 год на рынке",
  "26 городов присутствия",
  "более 5 000 автомобилей на сайте",
  "5 000 сотрудников в компании.",
];

const regionDealersList = [
  { link: "#", text: "DealerID 123123. Royal Motors Lexus" },
  { link: "#", text: "DealerID 121212. Royal Motors Land Rover" },
  { link: "#", text: "DealerID 111111. Royal Motors BMW" },
];

const url = {
  face: "assets/img/dealer-photo1.jpg",
  wallet: "assets/img/wallet.png",
  order: "assets/img/order-asc.png",
  award1: "assets/img/award-1.png",
  award2: "assets/img/award-2.png",
};

const socialNetworks = [
  { img: "assets/img/sovial-network-1.png", link: "#", text: "website.uz" },
  { img: "assets/img/sovial-network-2.png", link: "#", text: "Instagram" },
  { img: "assets/img/sovial-network-3.png", link: "#", text: "Telegram" },
  { img: "assets/img/sovial-network-4.png", link: "#", text: "Facebook" },
  { img: "assets/img/sovial-network-5.png", link: "#", text: "Yandex maps" },
  { img: "assets/img/sovial-network-6.png", link: "#", text: "Google maps" },
  { img: "assets/img/sovial-network-7.png", link: "#", text: "2Gis maps" },
];

const carsListAsync = ref([]);

const optionsListAsync = ref([]);

const optionsListAsyncIndex = ref({});

const developersListAsync = ref([]);

const modelsListAsync = ref([]);

onMounted(async () => {
  console.log(`the component is now mounted.`);
  const res = await fetch("assets/cars_list.json");
  carsListAsync.value = await res.json();
  developersListAsync.value = genDevelopersList(carsListAsync.value);
  modelsListAsync.value = genModelsList(carsListAsync.value);
  const res1 = await fetch("assets/option_list.json");
  optionsListAsync.value = await res1.json();
  optionsListAsyncIndex.value = indexer(optionsListAsync.value);
});

const currenciesList = [
  { name: "USD", rate: 1 },
  { name: "UZS", rate: 12107.26 },
];

let currentCurrency = ref(currenciesList[0]);

function crossingArr(arrA, arrB, propName) {
  const ret = arrA.filter(
    (a) => arrB.filter((b) => b[propName] == a[propName]).length > 0
  );
}

function getSection(arr, start, end) {
  const ret = arr.filter(
    (element, index) => index >= start && index <= end && index < arr.length
  );
  return ret;
}

function indexer(arr) {
  const ret = {};

  arr.forEach((element) => {
    ret[element.id] = element;
  });
  return ret;
}

function genDevelopersList(arr) {
  console.log("genDevelopersList arr.length:", arr.length);
  return [...new Set(arr.map((item) => item.developer))]
    .sort()
    .map((item, index) => {
      return { id: index, name: item, selected: false };
    });
}

function genModelsList(arr) {
  return [...new Set(arr.map((item) => item.model))]
    .sort()
    .map((item, index) => {
      return { id: index, name: item, selected: false };
    });
}

const filter = ref({
  isNew: true,
  isSecondHands: true,
  AKHD: null,
  priceMin: null,
  priceMax: null,

  equipment: [
    { name: "Литые диски", selected: false },
    { name: "Диаметр диска 20'", selected: false },
    { name: "Руль c отделкой кожей", selected: false },
    { name: "Розетка 220V", selected: false },
    { name: "Фронтальная подушка безопасности водителя", selected: false },
  ],
});

const summ = 100500;

function fOldNew(arr, isOld, isNew) {
  return arr.filter(
    (el) =>
      !el.isHidden &&
      ((isOld && el.ownersCount > 0) || (isNew && el.ownersCount < 1))
  );
}

function fMinPrice(arr, minVal) {
  return arr.filter(
    (el) => !minVal || el.price * currentCurrency.value.rate > minVal
  );
}

function fMaxPrice(arr, maxVal) {
  return arr.filter(
    (el) => !maxVal || el.price * currentCurrency.value.rate < maxVal
  );
}

function fAKHD(arr, AKHD) {
  return arr.filter((el) => !AKHD || el.AKHD.indexOf(AKHD) > -1);
}

function fDeveloper(arr, developers) {
  const selected = developers.filter((d) => d.selected);
  return arr.filter(
    (el) =>
      selected < 1 || selected.filter((d) => d.name == el.developer).length > 0
  );
}

function fModel(arr, models) {
  const selected = models.filter((d) => d.selected);
  return arr.filter(
    (el) =>
      selected < 1 || selected.filter((d) => d.name == el.model).length > 0
  );
}

const filtered = computed(() => {
  const ret = fModel(
    fDeveloper(
      fAKHD(
        fMaxPrice(
          fMinPrice(
            fOldNew(
              carsListAsync.value,
              filter.value.isSecondHands,
              filter.value.isNew
            ),
            filter.value.priceMin
          ),
          filter.value.priceMax
        ),
        filter.value.AKHD
      ),
      developersListAsync.value
    ),
    modelsListAsync.value
  );
  return ret;
});

const filteredActiv = computed(() => {
  return filtered.value.filter((item) => !item.isArchiv);
});

const filteredArchiv = computed(() => {
  return filtered.value.filter((item) => item.isArchiv);
});

function onClick(currency) {
  if (filter.value.priceMax > 0) {
    let oldMaxValue = filter.value.priceMax / currentCurrency.value.rate;
    filter.value.priceMax = oldMaxValue * currency.rate;
  }
  if (filter.value.priceMin > 0) {
    let oldMinValue = filter.value.priceMin / currentCurrency.value.rate;
    filter.value.priceMin = oldMinValue * currency.rate;
  }
  currentCurrency.value = currency;
}

function onClickIsNew() {
  filter.value.isNew = !filter.value.isNew;
}
function onClickIsSecondHands() {
  filter.value.isSecondHands = !filter.value.isSecondHands;
}
</script>

<template>
  <section class="personal-area">
    <div class="head-line">
      <h3 style="color: transparent">МОИ ДАННЫЕ</h3>

      <div>
        <button style="color: transparent; border-color: transparent">
          Изменить
        </button>
      </div>
      <div class="wallet-block">
        <label>
          Валюта:<span
            v-for="item in currenciesList"
            :key="item.name"
            @click="onClick(item)"
            class="selectable"
            :class="{ selected: item.name == currentCurrency.name }"
            >{{ item.name }}</span
          >
        </label>
        <img :src="url.wallet" />
        <span>{{ summ * currentCurrency.rate }}</span>
        {{ currentCurrency.name }}
      </div>
    </div>

    <div class="personal-date-block">
      <img :src="url.face" />
      <ul class="date">
        <li><span>Контактный телефон</span> <span>+998 123 12 12</span></li>
        <li>
          <span>Электронная почта</span> <span>royal_toyota@gmail.com</span>
        </li>
        <li><span>Ник</span> <span>RM_Toyota</span></li>
        <li><span>Имя</span> <span>RM_Motors Toyota</span></li>
        <li><span>Город</span> <span>Ташкент</span></li>
      </ul>
      <ul class="links">
        <li><button>Избранное</button></li>
        <li><button>Сравнения</button></li>
        <li><button>Сообщения</button></li>
        <li><button>Поиски</button></li>
      </ul>
    </div>

    <div class="sub-head-line">
      <h3>О КОМПАНИИ (DealerID: 100500)</h3>
      &nbsp; &nbsp; <button>Изменить</button>
    </div>

    <Gallery :images-list="galleryList" />

    <div class="showcase">
      <div>
        <h5>Описание для витрины</h5>
        <ul>
          <li v-for="e in awardsList" :key="e">
            <img :src="url.award1" />{{ e }}
          </li>
        </ul>
        <ul>
          <li v-for="e in awardsList2" :key="e">
            <img :src="url.award2" />{{ e }}
          </li>
        </ul>
        <p>&nbsp;</p>
        <h5>Партнерские дилерские центры</h5>
        <label
          ><input type="text" placeholder="Введите DealerID" />
          <button class="inverse-button">Поиск</button></label
        >
        <ul>
          <li v-for="e in regionDealersList" :key="e.text">{{ e.text }}</li>
        </ul>
      </div>
      <div>
        <h5>Соцсети для витрины</h5>
        <div class="social-network" v-for="e in socialNetworks" :key="e.img">
          <a :href="e.link"><img :src="e.img" />{{ e.text }}</a>
        </div>
      </div>
    </div>

    <h3>МОИ ОБЪЯВЛЕНИЯ</h3>
    <h4>Фильтры</h4>

    <div class="filter-line">
      <div>
        <span
          class="selectable"
          :class="{ selected: filter.isNew }"
          @click="onClickIsNew"
          >Новые</span
        >&nbsp;<span
          class="selectable"
          :class="{ selected: filter.isSecondHands }"
          @click="onClickIsSecondHands"
          >Бу</span
        >
      </div>
      <MSF label="Марка" :list="developersListAsync" />
      <MSF label="Модель" :list="modelsListAsync" />
      <div>
        AKHD
        <input placeholder="AKHD" v-model="filter.AKHD" />
      </div>
      <div>
        Цена от
        <input placeholder="Цена от" v-model="filter.priceMin" />
      </div>
      <div>
        Цена до
        <input placeholder="Цена до" v-model="filter.priceMax" />
      </div>
      <MSF label="Оборудование" :list="filter.equipment" class="last-item" />
    </div>

    <div class="car-list-header-line">
      <h4>Активные</h4>
      <div class="order-block">
        <img :src="url.order" />
        <span>Cортировка:</span> &nbsp;
        <span>по</span>
        <select>
          <option>дате</option>
          <option>просмотрам</option>
        </select>
      </div>
    </div>

    <!-- cars list -->
    <ul class="cars-list">
      <li
        v-for="(item, index) in filteredActiv"
        :key="item.id"
        :class="{ 'last-item': index == filteredActiv.length - 1 }"
      >
        <div class="car-img" :style="'background-image: url(' + item.img + ')'">
          &nbsp;
        </div>

        <div class="long">
          <h5>
            {{ item.developer }} {{ item.model }} {{ item.year }} за
            {{ item.price * currentCurrency.rate }} {{ currentCurrency.name }}
          </h5>
          <h5>AKHD: {{ item.AKHD }}</h5>
          <div class="details-block">
            <div>
              <ul class="params-list">
                <li>
                  <span>VIN</span> <span>{{ item.VIN }}</span>
                </li>
                <li>
                  <span>Комплектация</span> <span>{{ item.equipment }}</span>
                </li>
                <li>
                  <span>Двигатель</span> <span>{{ item.enjene }}</span>
                </li>
                <li>
                  <span>Пробег</span> <span>{{ item.mileage }} км</span>
                </li>
                <li>
                  <span>Число хозяев</span> <span>{{ item.ownersCount }}</span>
                </li>
              </ul>
            </div>
            <div class="options-list-block">
              <ul class="first-option-list">
                <template
                  v-for="oItem in getSection(item.optionsList, 0, 3)"
                  :key="oItem"
                >
                  <li v-if="optionsListAsyncIndex[oItem]">
                    {{ optionsListAsyncIndex[oItem].name }}
                  </li>
                </template>
              </ul>
              <ul class="second-option-list">
                <li
                  v-for="oItem in getSection(item.optionsList, 4, 7)"
                  :key="oItem"
                >
                  <span v-if="optionsListAsyncIndex[oItem]">{{
                    optionsListAsyncIndex[oItem].name
                  }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <button class="inverse-button">Редактировать</button>
          
          <h6>В продаже с 28 июля 2023 г</h6>
          <ul class="review-count-list">
            <li><span>Просмотров всего</span> <span>100500</span></li>
            <li><span>Просмотров сегодня</span> <span>10050</span></li>
            <li><span>В избранном всего</span> <span>1200</span></li>
            <li><span>В избранном сегодня</span> <span>100</span></li>
          </ul>
        </div>
      </li>
    </ul>
    <!-- /cars list -->

    <button class="inverse-button next-list-button">Еще</button>
  </section>
</template>
<style scoped>
.sub-head-line {
  display: flex;
  align-items: center;
}
.sub-head-line button {
  margin-left: 50px;
}
.showcase {
  display: flex;
  justify-content: space-between;
  padding: 30px 0 30px 0;
}

.showcase > div {
  width: 49%;
}

.showcase label {
  display: flex;
  align-items: center;
}
.showcase input {
  border: solid 1px #ccc;
  line-height: 34px;
  width: 280px;
  display: block;
  font-family: MartianMono-Regular;
  font-size: 14px;
  padding-left: 10px;
}

.showcase h5 {
  font-size: 28px;
  font-weight: normal;
}

.showcase li {
  /* margin: 5px 0; */
  line-height: 32px;
  font-size: 18px;
}

.showcase li img {
  margin: 0 10px -5px 0;
}

.showcase .social-network {
  width: 160px;
  height: 90px;
  border: 1px solid #ccc;
  margin: 5px;
  display: inline-block;
  padding: 9px 0 0 14px;
}

.showcase .social-network img {
  display: block;
}
</style>
