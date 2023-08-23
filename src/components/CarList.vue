<script setup>
const props = defineProps({
  carList: {
    type: Array,
    required: true,
  },
  carOptionListIndex: {
    type: Object,
    required: true,
  },
  currentCurrency: {
    type: Object,
    required: true,
  }
});

function getSection(arr, start, end) {
  if (!arr) return [];
  const ret = arr.filter(
    (element, index) => index >= start && index <= end && index < arr.length
  );
  return ret;
}

</script>
<template>
    <ul class="cars-list">
      <li
        v-for="(item, index) in carList"
        :key="item.id"
        :class="{ 'last-item': index == carList.length - 1 }"
      >
        <div class="car-img" :style="'background-image: url(' + item.img + ')'">
          &nbsp;
        </div>

        <div class="long">
          <h5>
            {{ item.developer }} {{ item.model }} {{ item.year }} за
            {{ item.price }}
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
                  <span>Пробег</span> <span>{{ item.mileage }}</span>
                </li>
                <li>
                  <span>Число хозяев</span> <span>{{ item.ownersCount }}</span>
                </li>
              </ul>
            </div>
            <div class="options-list-block">
              <ul class="first-option-list">
                <template
                  v-for="oItem in getSection(item.optionsListMain, 0, 3)"
                  :key="oItem"
                >
                  <li v-if="carOptionListIndex[oItem]">
                    {{ carOptionListIndex[oItem].name }}
                  </li>
                </template>
              </ul>
              <ul class="second-option-list">
                <li
                  v-for="oItem in getSection(item.optionsListMain, 4, 7)"
                  :key="oItem"
                >
                  <span v-if="carOptionListIndex[oItem]">{{
                    carOptionListIndex[oItem].name
                  }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <button class="inverse-button">Редактировать</button>
          <button>Снять с продажи</button>
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

</template>
<style scoped>

</style>