<script setup>
import { ref, reactive, computed, onMounted } from "vue";

import CarList from "../components/CarList.vue";
import Filter from "../components/Filter.vue";

import { useCars } from "@/stores/cars";
const Cars = useCars();

import { useCarsOptions } from "@/stores/carsOptions";
const CarsOptions = useCarsOptions();

const url = {
  face: "assets/img/person-photo1.jpg",
  wallet: "assets/img/wallet.png",
  order: "assets/img/order-asc.png",
};

const carsListAsync = ref([]);

const optionsListAsync = ref([]);

const optionsListAsyncIndex = ref({});

onMounted(async () => {
  console.log(`the component is now mounted.`);

  carsListAsync.value = await Cars.load();
  optionsListAsync.value = await CarsOptions.load();
  optionsListAsyncIndex.value = indexer(optionsListAsync.value);
});

const currenciesList = [
  { name: "USD", rate: 1 },
  { name: "UZS", rate: 12107.26 },
];

let currentCurrency = ref(currenciesList[0]);

function indexer(arr) {
  const ret = {};

  arr.forEach((element) => {
    ret[element.id] = element;
  });
  return ret;
}

const filter = ref(null);
const filterRaw = ref(null);

const summ = 100500;

const filtered = computed(() => {
  return carsListAsync.value;
});

const filteredActiv = computed(() => {
  if (filtered.value) {
    return filtered.value.filter((item) => !item.isArchiv);
  }
});

const filteredArchiv = computed(() => {
  if (filtered.value) {
    return filtered.value.filter((item) => item.isArchiv);
  }
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

function onChangeFilter(val) {
  console.log("onChangeFilter", val);


  filterRaw.value = JSON.stringify(val)
  filter.value = encodeURI( JSON.stringify(val));
  
  Cars.load(val).then((data) => {
    carsListAsync.value = data;
  });
}
</script>

<template>
  <section class="personal-area">
    <div class="head-line">
      <h3>МОИ ДАННЫЕ</h3>

      <div><button>Изменить</button></div>
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
          <span>Электронная почта</span> <span>ravshan100500@gmail.com</span>
        </li>
        <li><span>Ник</span> <span>Ravshan</span></li>
        <li><span>Имя</span> <span>Равшан</span></li>
        <li><span>Город</span> <span>Ташкент</span></li>
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
    <div class="debug"><p>{{ filter }}</p> <p>{{ filterRaw }}</p></div>
    <Filter :filter="{}" @on-change="onChangeFilter" />

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
    <CarList
      :car-list="filteredActiv"
      :car-option-list-index="optionsListAsyncIndex"
      :current-currency="currentCurrency"
    />
    <!-- /cars list -->

    <button class="inverse-button next-list-button">Еще</button>
    <h4 class="general_section__title">Архив</h4>

    <!-- cars list -->
    <CarList
      :car-list="filteredArchiv"
      :car-option-list-index="optionsListAsyncIndex"
      :current-currency="currentCurrency"
    />
    <!-- /cars list -->
  </section>
</template>
<style scoped>
.personal-area .debug {
  position: absolute;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11px;
  background-color: #fff;
  opacity: 0.3;
  margin-top: -80px;
  margin-left: 150px;
}
</style>
