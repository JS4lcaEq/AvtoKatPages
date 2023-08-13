<script setup>
import { RouterLink, RouterView } from "vue-router";

const url = { uz: "assets/img/AvtoKatUZ_logo_x200.png", 
            ae: "assets/img/AutoCatAE_logo_x200.png", 
            kz: "assets/img/AvtoKatKZ_logo_x200.png",
            face: "assets/img/photo2.jpg"  }


</script>

<template>
  <header>
    <a href="#">
      <img alt="logo" :src="url.uz" height="100" />
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
      </select>
    </label>

    <a href="#">Регистрация/Вход</a>
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
    <a href="#"><img :src="url.ae" height="30" /></a>
    <a href="#"><img :src="url.kz" height="30" /></a>
  </footer>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
  
</template>


