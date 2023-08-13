<script setup>
import { ref, reactive, computed } from "vue";

const url = { face: "assets/img/photo2.jpg", wallet: "assets/img/wallet.png" };
const developersList = ["Chevrolet", "Mercedes-Benz"];
const models = ["Tahoe", "G-Class", "Malibu"];
const carsList = [
  {
    id: 1,
    img: "assets/img/c1.jpg",
    AKHD: "AFN1583",
    developer: "Chevrolet",
    model: "Tahoe",
    year: 2015,
    price: 41500,
    VIN: "XUFSK**J2F3***200",
    equipment: "LTZ",
    enjene: "6.2P 408 AT6 4WD",
    mileage: 2200,
    ownersCount: 2,
  },
  {
    id: 2,
    img: "assets/img/c1.jpg",
    AKHD: "AFN2345",
    developer: "Chevrolet",
    model: "Tahoe",
    year: 2019,
    price: 49500,
    VIN: "DUFUK**D2D3***300",
    equipment: "LTZ",
    enjene: "6.2P 408 AT6 4WD",
    mileage: 1200,
    ownersCount: 0,
  },
  {
    id: 3,
    img: "assets/img/c1.jpg",
    AKHD: "FFN2295",
    developer: "Chevrolet",
    model: "Tahoe",
    year: 2019,
    price: 49500,
    VIN: "DUFUK**D2D3***300",
    equipment: "LTZ",
    enjene: "6.2P 408 AT6 4WD",
    mileage: 1200,
    ownersCount: 0,
  },
];
const currenciesList = [
  { name: "UDS", rate: 1 },
  { name: "UZS", rate: 12107.26 },
];
let currentCurrency = ref(currenciesList[0]);
const filter = ref({
  isNew: true,
  isSecondHands: true,
  AKHD: null,
  priceMin: 0,
  priceMax: 1000000,
});
const summ = 100500;

const filtered = computed(() => {
  const ret = [];
  carsList.forEach((element) => {
    if (
      ((element.ownersCount == 0 && filter.value.isNew) ||
        (element.ownersCount > 0 && filter.value.isSecondHands)) &&
      element.price * currentCurrency.value.rate > filter.value.priceMin && 
      element.price * currentCurrency.value.rate < filter.value.priceMax &&
      (!filter.value.AKHD || element.AKHD.indexOf(filter.value.AKHD) > -1)
    ) {
      ret.push(element);
    }
  });
  return ret;
});

function onClick(currency) {
  let oldMaxValue = filter.value.priceMax / currentCurrency.value.rate
  let oldMinValue = filter.value.priceMin / currentCurrency.value.rate
  currentCurrency.value = currency;
  filter.value.priceMax = oldMaxValue * currentCurrency.value.rate
  filter.value.priceMin = oldMinValue * currentCurrency.value.rate
  console.log(currency);
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
      <h3>Мои данные</h3>
      <a href="#">Изменить</a>
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
      <strong>{{ summ * currentCurrency.rate }}</strong>
      {{ currentCurrency.name }}
    </div>
    <div class="personal-date-block">
      <img :src="url.face" width="300" />
      <ul class="date">
        <li>Контактный телефон: +998 123 12 12</li>
        <li>Электронная почта: ravshan100500@gmail.com</li>
        <li>Ник: Ravshan</li>
        <li>Имя: Равшан</li>
        <li>Город: Ташкент</li>
      </ul>
      <ul class="links">
        <li><a href="#" class="font-black">Избранное</a></li>
        <li><a href="#" class="font-black">Сравнения</a></li>
        <li><a href="#" class="font-black">Сообщения</a></li>
        <li><a href="#" class="font-black">Поиски</a></li>
      </ul>
    </div>
    <h3>Мои объявления</h3>
    <h4>Фильтры</h4>
    <div class="filter-line">
      <span
        class="selectable"
        :class="{ selected: filter.isNew }"
        @click="onClickIsNew"
        >Новые</span
      >
      &nbsp;
      <span
        class="selectable"
        :class="{ selected: filter.isSecondHands }"
        @click="onClickIsSecondHands"
        >Бу</span
      >

      <div>
        Марка
        <ul>
          <li>Chevrolet</li>
          <li>Mercedes-Benz</li>
        </ul>
      </div>
      <div>
        Модель
        <ul>
          <li>Tahoe</li>
          <li>G-Class</li>
          <li>Malibu</li>
        </ul>
      </div>
      <input placeholder="AKHD" v-model="filter.AKHD" />
      <input placeholder="Цена от" v-model="filter.priceMin" />
      <input placeholder="Цена до" v-model="filter.priceMax" />
      <div>
        Оборудование
        <ul>
          <li>Литые диски</li>
          <li>Диаметр диска 20"</li>
          <li>Руль c отделкой кожей</li>
          <li>Розетка 220V</li>
          <li>Фронтальная подушка безопасности водителя</li>
        </ul>
      </div>
    </div>
    <h4>Активные</h4>
    <ul class="cars-list">
      <li v-for="item in filtered" :key="item.id">
        <img :src="item.img" width="400" />
        <div class="long">
          <h4>
            {{ item.developer }} {{ item.model }} {{ item.year }} за
            {{ item.price * currentCurrency.rate }} {{ currentCurrency.name }}
          </h4>
          <h4>AKHD: {{ item.AKHD }}</h4>
          <ul>
            <li>VIN: {{ item.VIN }}</li>
            <li>Комплектация: {{ item.equipment }}</li>
            <li>Двигатель: {{ item.enjene }}</li>
            <li>Пробег: {{ item.mileage }} км</li>
            <li>Число хозяев: {{ item.ownersCount }}</li>
          </ul>
        </div>
        <div>
          <a href="" class="font-black"><h4>Редактировать</h4></a>
          <a href="" class="font-black"><h4>Снять с продажи</h4></a>
          <ul>
            <li>В продаже с 28 июля 2023 г</li>
            <li>Просмотров всего: 100500</li>
            <li>Просмотров сегодня: 10050</li>
            <li>В избранном всего: 1200</li>
            <li>В избранном сегодня: 100</li>
          </ul>
        </div>
      </li>
    </ul>
    <!-- {{ filtered }} -->
    <h4 class="general_section__title">Архив</h4>
  </section>
</template>
