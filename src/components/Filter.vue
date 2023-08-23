<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import MSF from "../components/MultySelectionFilterV2.vue";

import { useFilter } from "@/stores/filter";
const Filter = useFilter();

import { useCarsOptions } from "@/stores/carsOptions";
const CarsOptions = useCarsOptions();

const developerModelFilter = ref([]);

const carsOptions = ref([]);

const emit = defineEmits(["onChange"]);



const props = defineProps({
  filter: {
    type: Object,
    required: true,
  },
});

const filter = ref({
  isNew: true,
  isSecondHands: true,
  AKHD: null,
  priceMin: null,
  priceMax: null,
  equipment: [],
});

const modelF = computed(() => {
  const ret = [];
  developerModelFilter.value.forEach((d) => {
    if (d.selected) {
      ret.push(...d.models);
    }
  });
  return ret;
});

function onClickIsNew() {
  filter.value.isNew = !filter.value.isNew;
  emit("onChange", filter.value);
}

function onClickIsSecondHands() {
  filter.value.isSecondHands = !filter.value.isSecondHands;
  emit("onChange", filter.value);
}

onMounted(async () => {
  developerModelFilter.value = await Filter.load();
  carsOptions.value = await CarsOptions.load();
  filter.value.developers = [];
  filter.value.models = [];
});

function onChangeDeveloper(val) {
  console.log("onChangeDeveloper", val);
  filter.value.developers = val;
  emit("onChange", filter.value);
}

function onChangeModel(val) {
  console.log("onChangeModel", val);
  filter.value.models = val;
  emit("onChange", filter.value);
}

function onChangeEquipment(val) {
  console.log("onChangeEquipment", val);
  filter.value.equipment = val;
  emit("onChange", filter.value);
}
function onChange(){
  emit("onChange", filter.value)
}

</script>
<template>
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
    <MSF
      label="Марка"
      :list="developerModelFilter"
      @on-change="onChangeDeveloper"
      dataFieldName="name"
    />
    <MSF
      label="Модель"
      :list="modelF"
      @on-change="onChangeModel"
      dataFieldName="name"
    />
    <div>
      AKHD
      <input placeholder="AKHD" v-model="filter.AKHD" @change="onChange" />
    </div>
    <div>
      Цена от
      <input placeholder="Цена от" v-model="filter.priceMin"  @change="onChange" />
    </div>
    <div>
      Цена до
      <input placeholder="Цена до" v-model="filter.priceMax"  @change="onChange" />
    </div>
    <MSF
      label="Оборудование"
      :list="carsOptions"
      class="last-item"
      @on-change="onChangeEquipment"
      dataFieldName="id"
    />
  </div>

  <!-- <p>filter = {{ filter }}</p> -->


</template>
<style scoped>
</style>