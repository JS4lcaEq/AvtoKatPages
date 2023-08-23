<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";


const maketUrl = computed(() => {
  let ret = null
  if(useRoute().name == "personalArea") ret = "url(./assets/img/AvtoCat-1_p1.jpg)"
  if(useRoute().name == "dealerArea") ret = "url(./assets/img/AvtoCat-1_p2.jpg)"
  return ret;
})

const url = {
  uz: "assets/img/AvtoKatUZ_logo_x200.png",
  ae: "assets/img/AutoCatAE_logo_x200.png",
  kz: "assets/img/AvtoKatKZ_logo_x200.png",
  face: "assets/img/photo2.jpg",
  logo: "assets/img/logo2.png",
  maket: "url(../img/AvtoCat-1_p1.jpg)"
};

const isDesignMaketWisible = ref(false);
const isWidthVisible = ref(false) 

function onDesign() {
  isDesignMaketWisible.value = !isDesignMaketWisible.value;
}

function onWidth(val){
  isWidthVisible.value = !isWidthVisible.value
}


</script>

<template>
  <header>
    <a href="#">
      <h1>AvtoKat</h1>
      <div id="logo"></div>
      <img alt="logo" :src="url.logo" />
    </a>

    <label class="grow"
      >Страна:
      <select>
        <option>Россия</option>
        <option>Узбекистан</option>
      </select>
    </label>
    <label
      >Язык:
      <select>
        <option>русский</option>
        <option>узбекский</option>
        <option>английский</option>
      </select>
    </label>

    <!-- <a href="#">Равшан Корп</a> -->
    <span>Равшан Корп</span>
  </header>
  <main>
    <RouterView />
  </main>
  <footer>
    <div>
      <a href="#">О нас</a>
      <p>
        © 2023, AutoCat<br />
        All Rights Reserved
      </p>
    </div>
    <div>
      <a href="#"><img :src="url.ae" height="35" /></a>
      <a href="#"><img :src="url.kz" height="35" /></a>
      <a href="#" style="display: block; text-align: right; margin-top: 5px"
        ><img alt="logo" :src="url.uz" height="50"
      /></a>
    </div>
  </footer>
  <nav>
    Navigation:
    <RouterLink to="/">Personal Design Maket</RouterLink> &nbsp;
    <RouterLink to="/dealer">Dealer Design Maket</RouterLink> &nbsp;
    <RouterLink to="/about">debug page</RouterLink> ; &nbsp;

    design: <span @click="onDesign">maket</span>, <span @click="onWidth">width</span> ;
    maketUrl: {{ maketUrl }}
  </nav>
  <div id="maket" v-if="isDesignMaketWisible" :style="{'background-image': maketUrl}"></div>
  <div id="measurer" v-if="isWidthVisible">
    <div class="w-1">width &gt;= 1200px</div>
    <div class="w-2">width &gt;= 1500px</div>
    <div class="w-3">width &gt;= 1800px</div>
  </div>
</template>


