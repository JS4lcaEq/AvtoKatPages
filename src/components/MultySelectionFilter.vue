<script setup>
import { ref, reactive, computed, watch, defineEmits } from "vue";

const emit = defineEmits(['onChange'])

const props = defineProps(["list", "label"]);
const opened = ref(false);
const tempList = ref(props.list);

function onMove(item) {
  item.selected = !item.selected;
  emit("onChange", tempList.value)
  if(tempList.value.filter((el) => !el.selected).length < 1){
    opened.value = false
    
  }
  isSelectableExists.value = tempList.value.filter((el) => !el.selected).length > 0
}

function onOpen(item) {
  if(isSelectableExists.value){
    opened.value = !opened.value;
  }
}

const isSelectableExists = ref(true);


function onMouseLeave() {
  opened.value = false;
}
</script>

<template>
  <div class="multy-selection-filter">
    <div v-if="opened" class="filter-add-list" @mouseleave="onMouseLeave">
      <!-- <span>Добавить </span>   -->
      <ul>
        <template v-for="item in tempList" :key="item">
          <li @click="onMove(item)" v-if="!item.selected">{{ item.name }}</li>
        </template>
      </ul>
    </div>    
    <span @click="onOpen">{{ props.label }} </span>
    <span @click="onOpen" v-if="isSelectableExists">&or;</span>
    


    <ul>
      <template v-for="item in tempList" :key="item">
        <li @click="onMove(item)" v-if="item.selected">{{ item.name }}</li>
      </template>
    </ul>
  </div>
</template>

<style scoped>
.filter-add-list {
  position: absolute;
  border: solid 1px #000;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  min-width: 100px;
}
.multy-selection-filter li, .multy-selection-filter > span {
  cursor: pointer;
}
</style>
