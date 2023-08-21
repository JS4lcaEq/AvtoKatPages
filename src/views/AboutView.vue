<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import Gallery2 from "../components/Gallery2.vue";

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
    <div class="dotted-box" style="color: #bbb;">......................</div>
    <h2>Gallery</h2>
    <Gallery2 :images-list="galleryList" />
  </div>
</template>

<style scoped>

.dotted-box{
font-size: 18px;
border: solid 1px #bbb
}



</style>
