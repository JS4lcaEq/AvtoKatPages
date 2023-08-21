<script setup>
import { ref, reactive, computed, watch, defineEmits } from "vue";

const emit = defineEmits(["onChange"]);

const props = defineProps(["list", "label"]);

const isOpened = ref(false);

const himselfList = computed(() => {
  return [...props.list];
});

const src = computed(() => {
  return props.list.filter((i) => !i.selected);
});

const dstn = computed(() => {
  return props.list.filter((i) => i.selected);
});

const isSrcExists = computed(() => {
  return src.value.length > 0;
});

function move(item) {
  item.selected = !item.selected;
  if (src.value.length < 1) isOpened.value = false;
}

function open() {
  if (isOpened.value) {
    isOpened.value = false;
    return;
  }
  if (isSrcExists.value) {
    isOpened.value = true;
  }
}
</script>

<template>
  <div class="multy-selection-filter" :class="{ 'is-exists-src': isSrcExists }">
    <div v-if="isOpened" class="filter-add-list">
      <ul @mouseleave="isOpened = false">
        <li v-for="item in src" :key="item.id" @click="move(item)">
          {{ item.name }}
        </li>
      </ul>
    </div>
    <span @click="open" class="label"> {{ label }} </span>
    <span @click="open" class="arrow">&or;</span>

    <ul  class="filter-base-list">
      <li v-for="item in dstn" :key="item.id" @click="move(item)">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
li {
  cursor: pointer;
}
.is-exists-src .label, .is-exists-src .arrow {
  cursor: pointer;
}
.filter-add-list {
  position: absolute;
  z-index: 10;
  border: 1px solid #000;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  margin: 0 0 0 5px;
}
.arrow {
  display: none;
}
.is-exists-src .arrow {
  display: inline;
}
</style>
