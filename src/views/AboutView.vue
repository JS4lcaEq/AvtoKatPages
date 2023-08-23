<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import Gallery2 from "../components/Gallery2.vue";


const apiOptionsListAsync = ref([]);

import { useCars } from "@/stores/cars";
const Cars = useCars();

import { useCarsOptions } from "@/stores/carsOptions";
const CarsOptions = useCarsOptions();

import { useFilter } from "@/stores/filter";
const Filter = useFilter();

import { useDealer } from "@/stores/dealer";
const Dealer = useDealer();

onMounted(() => {
  Cars.load()
  CarsOptions.load()
  Filter.load()
  Dealer.load()
});

const galleryList = [
  { id: 1, url: "./assets/img/dealer-gallery-1.JPG", w: 560 },
  { id: 5, url: "./assets/img/dealer-gallery-5.JPG", w: 400 },
  { id: 2, url: "./assets/img/dealer-gallery-2.JPG", w: 560 },
  { id: 7, url: "./assets/img/dealer-gallery-7.JPG", w: 185 },
  { id: 3, url: "./assets/img/dealer-gallery-3.JPG", w: 560 },
  { id: 6, url: "./assets/img/dealer-gallery-6.JPG", w: 385 },
  { id: 8, url: "./assets/img/dealer-gallery-8.JPG", w: 320 },
  { id: 4, url: "./assets/img/dealer-gallery-4.JPG", w: 200 },
  { id: 9, url: "./assets/img/dealer-gallery-9.JPG", w: 320 },
];

</script>
<template>
  <div class="about">
    <h1>Debug page</h1>
    <h2>Dottet</h2>
    <div class="dotted-box">ABCabcАБВабв1234567890</div>
    <div class="dotted-box" style="color: #bbb">......................</div>
    <h2>Gallery</h2>
    <Gallery2 :images-list="galleryList" />

    <h2>Cars list from API</h2>
    <p>Cars.data = {{ Cars.data }}</p>

    <h2>Cars options list from API</h2>
    <p>CarsOptions.data = {{ CarsOptions.data }}</p>

    <h2>Filter from API</h2>
    <p>Filter.data = {{ Filter.data }}</p>

    <h2>Dealer from API</h2>
    <p>Dealer.data = {{ Dealer.data }}</p>    
  </div>
</template>

<style scoped>
.dotted-box {
  font-size: 18px;
  border: solid 1px #bbb;
}
</style>
