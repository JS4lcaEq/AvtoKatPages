<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import MultySelectionFilter from "../components/MultySelectionFilter.vue";

import MSF from "../components/MultySelectionFilterV2.vue";

const url = {
  face: "assets/img/person-photo1.jpg",
  wallet: "assets/img/wallet.png",
};

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

function getSection(arr, start, end) {
  const ret = arr.filter((element, index) => index >= start && index <= end);
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
    (el) => (isOld && el.ownersCount > 0) || (isNew && el.ownersCount < 1)
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
      <h3>МОИ ДАННЫЕ</h3>

      <div><button>Изменить</button></div>
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
      <img :src="url.face" />
      <ul class="date">
        <li>Контактный телефон: +998 123 12 12</li>
        <li>Электронная почта: ravshan100500@gmail.com</li>
        <li>Ник: Ravshan</li>
        <li>Имя: Равшан</li>
        <li>Город: Ташкент</li>
      </ul>
      <ul class="links">
        <li><button>Избранное</button></li>
        <li><button>Сравнения</button></li>
        <li><button>Сообщения</button></li>
        <li><button>Поиски</button></li>
      </ul>
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
      <MultySelectionFilter label="Оборудование" :list="filter.equipment" />
    </div>
    <h4>Активные</h4>
    <ul class="cars-list">
      <li v-for="item in filteredActiv" :key="item.id">
        <div class="car-img" :style="'background-image: url(' + item.img + ')'">
          &nbsp;
        </div>

        <div class="long">
          <h5>
            {{ item.developer }} {{ item.model }} {{ item.year }} за
            {{ item.price * currentCurrency.rate }} {{ currentCurrency.name }}
          </h5>
          <div class="details-block">
            <div>
              <h5>AKHD: {{ item.AKHD }}</h5>
              <ul>
                <li>VIN: {{ item.VIN }}</li>
                <li>Комплектация: {{ item.equipment }}</li>
                <li>Двигатель: {{ item.enjene }}</li>
                <li>Пробег: {{ item.mileage }} км</li>
                <li>Число хозяев: {{ item.ownersCount }}</li>
              </ul>
            </div>
            <div class="options-list-block" >
              <ul class="first-option-list">
                <li
                  v-for="oItem in getSection(item.optionsList, 0, 5)"
                  :key="oItem"
                >
                  <span v-if="optionsListAsyncIndex[oItem]">{{ optionsListAsyncIndex[oItem].name }}</span>
                </li>
              </ul>
              <ul class="second-option-list">
                <li
                  v-for="oItem in getSection(item.optionsList, 6, 11)"
                  :key="oItem"
                >
                <span v-if="optionsListAsyncIndex[oItem]">{{ optionsListAsyncIndex[oItem].name }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>


        <div>
          <button class="inverse-button">Редактировать</button>
          <button>Снять с продажи</button>
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
    <ul class="cars-list">
      <li v-for="item in filteredArchiv" :key="item.id">
        <div
          class="car-img"
          :style="'background-image: url(' + item.img + ')'"
        ></div>

        <div class="long">
          <h5>
            {{ item.developer }} {{ item.model }} {{ item.year }} за
            {{ item.price * currentCurrency.rate }} {{ currentCurrency.name }}
          </h5>
          <div class="details-block">
            <div>
              <h5>AKHD: {{ item.AKHD }}</h5>
              <ul>
                <li>VIN: {{ item.VIN }}</li>
                <li>Комплектация: {{ item.equipment }}</li>
                <li>Двигатель: {{ item.enjene }}</li>
                <li>Пробег: {{ item.mileage }} км</li>
                <li>Число хозяев: {{ item.ownersCount }}</li>
              </ul>
            </div>
            <div class="options-list-block">
              <ul class="first-option-list">
                <li
                  v-for="oItem in getSection(item.optionsList, 0, 5)"
                  :key="oItem"
                >
                <span v-if="optionsListAsyncIndex[oItem]">{{ optionsListAsyncIndex[oItem].name }}</span>
                </li>
              </ul>
              <ul class="second-option-list">
                <li
                  v-for="oItem in getSection(item.optionsList, 6, 11)"
                  :key="oItem"
                >
                <span v-if="optionsListAsyncIndex[oItem]">{{ optionsListAsyncIndex[oItem].name }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <button class="inverse-button">Активировать</button>
        </div>
      </li>
    </ul>
  </section>
</template>
<style scoped>
</style>
