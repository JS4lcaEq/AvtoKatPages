<script setup>
import { ref, reactive, computed, onMounted } from "vue";

import Gallery from "../components/Gallery.vue";
import CarList from "../components/CarList.vue";
import Filter from "../components/Filter.vue";

import { useCars } from "@/stores/cars";
const Cars = useCars();

import { useCarsOptions } from "@/stores/carsOptions";
const CarsOptions = useCarsOptions();

import { useDealer } from "@/stores/dealer";
const Dealer = useDealer();
const dealerInfo = ref({});

const url = {
  wallet: "assets/img/wallet.png",
  order: "assets/img/order-asc.png",
  award1: "assets/img/award-1.png",
  award2: "assets/img/award-2.png",
};

const carsListAsync = ref([]);

const optionsListAsync = ref([]);
const optionsListAsyncIndex = ref({});

onMounted(async () => {
  console.log(`the component is now mounted.`);

  carsListAsync.value = await Cars.load();
  optionsListAsync.value = await CarsOptions.load();
  dealerInfo.value = await Dealer.load();

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

const summ = 100500;

const filtered = computed(() => {
  return carsListAsync.value;
});

const filteredActiv = computed(() => {
  return filtered.value.filter((item) => !item.isArchiv);
});

function onClick(currency) {
  // if (filter.value.priceMax > 0) {
  //   let oldMaxValue = filter.value.priceMax / currentCurrency.value.rate;
  //   filter.value.priceMax = oldMaxValue * currency.rate;
  // }
  // if (filter.value.priceMin > 0) {
  //   let oldMinValue = filter.value.priceMin / currentCurrency.value.rate;
  //   filter.value.priceMin = oldMinValue * currency.rate;
  // }
  currentCurrency.value = currency;
}

const filter = ref(null);
const filterRaw = ref(null);

function onChangeFilter(val) {
  console.log("onChangeFilter", val);

  filterRaw.value = JSON.stringify(val);
  filter.value = encodeURI(JSON.stringify(val));

  Cars.load(val).then((data) => {
    carsListAsync.value = data;
  });
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
        <span>{{ dealerInfo.wallet * currentCurrency.rate }}</span>
        {{ currentCurrency.name }}
      </div>
    </div>

    <div class="personal-date-block">
      <img :src="dealerInfo.face" />
      <ul class="date">
        <li><span>Контактный телефон</span> <span>{{ dealerInfo.phone }}</span></li>
        <li>
          <span>Электронная почта</span> <span>{{ dealerInfo.email }}</span>
        </li>
        <li><span>Ник</span> <span>{{ dealerInfo.nic }}</span></li>
        <li><span>Имя</span> <span>{{ dealerInfo.name }}</span></li>
        <li><span>Город</span> <span>{{ dealerInfo.city }}</span></li>
      </ul>
      <ul class="links">
        <li><button>Избранное</button></li>
        <li><button>Сравнения</button></li>
        <li><button>Сообщения</button></li>
        <li><button>Поиски</button></li>
      </ul>
    </div>

    <div class="sub-head-line">
      <h3>О КОМПАНИИ (DealerID: {{ dealerInfo.dealerId }})</h3>
      &nbsp; &nbsp; <button>Изменить</button>
    </div>

    <Gallery
      :images-list="dealerInfo.galleryList"
      v-if="dealerInfo.galleryList"
    />
    <!-- galleryList -->

    <div class="showcase">
      <div>
        <h5>Описание для витрины</h5>
        <ul>
          <li v-for="e in dealerInfo.awardsList" :key="e">
            <img :src="url.award1" />{{ e }}
          </li>
        </ul>
        <ul>
          <li v-for="e in dealerInfo.awardsList2" :key="e">
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
          <li v-for="e in dealerInfo.regionDealersList" :key="e.text">
            {{ e.text }}
          </li>
        </ul>
      </div>
      <div>
        <h5>Соцсети для витрины</h5>
        <div
          class="social-network"
          v-for="e in dealerInfo.socialNetworks"
          :key="e.img"
        >
          <a :href="e.link"><img :src="e.img" />{{ e.text }}</a>
        </div>
      </div>
    </div>

    <h3>МОИ ОБЪЯВЛЕНИЯ</h3>
    <h4>Фильтры</h4>

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
