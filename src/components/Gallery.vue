<script setup>
import { ref, reactive, computed, onMounted } from "vue";

const itemsList = ref(null);
const isAnimation = ref(false);
const currentMargin = ref(0);
let direction = 0;

const props = defineProps({
  imagesList: {
    type: Array,
    required: true,
  },
});

const arr = ref(props.imagesList);

function moveArr(arr, move) {
  const ret = [];
  arr.forEach((e, index) => {
    let newIndex = index + move;
    if (newIndex > arr.length - 1) newIndex = 0;
    if (newIndex < 0) newIndex = arr.length - 1;
    ret[newIndex] = e;
  });
  return ret;
}

function getMargin(centerIndex) {
  //console.log("centerIndex", centerIndex);
  let margin = 0;
  arr.value.forEach((e, index) => {
    if (index < centerIndex) {
      margin += e.w;
      //console.log("add", margin);
    }
    if (index == centerIndex) {
      margin += e.w / 2;
      //console.log("half", margin);
    }
  });
  return margin;
}

const totalWidth = computed(() => {
  let ret = 0;
  arr.value.forEach((item) => {
    ret += item.w;
  });
  return ret;
});

function onMoveLeft() {
  direction = 1;
  isAnimation.value = true;
  currentMargin.value = getMargin(3);
}
function onMoveRight() {
  direction = -1;
  isAnimation.value = true;
  currentMargin.value = getMargin(5);
}

function onTransitionEnd() {
  if (isAnimation.value) {
    isAnimation.value = false;
    arr.value = moveArr(arr.value, direction);
    currentMargin.value = getMargin(4);
  }
}

onMounted(() => {
  currentMargin.value = getMargin(4);
});
</script>

<template>
  <div class="gallery">
    <div class="debug">
      currentMargin = {{ currentMargin }} isAnimation = {{ isAnimation }}
    </div>
    <div class="button" @click="onMoveLeft">&lsaquo;</div>
    <div class="window">
      <div class="line" :style="{ width: totalWidth + 'px' }">
        <div
          class="items-list"
          :class="{ 'animation-on': isAnimation }"
          :style="{ marginLeft: '-' + currentMargin + 'px' }"
          @transitionend="onTransitionEnd"
          ref="itemsList"
        >
          <div
            v-for="item in arr"
            :key="item.id"
            :style="{
              width: item.w + 'px',
              backgroundImage: 'url(' + item.url + ')',
            }"
          >
            {{ item.id }}
          </div>
        </div>
      </div>
    </div>
    <div class="button" @click="onMoveRight">&rsaquo;</div>
  </div>
</template>

<style scoped>
.gallery {
  height: 315px;
  display: flex;
  margin-top: 10px;
}

.gallery .button {
  cursor: pointer;
  background-color: #0095b5;
  color: #fff;
  width: 65px;
  text-align: center;
  line-height: 315px;
  font-weight: bold;
  font-size: 42px;
  font-family: Arial, Helvetica, sans-serif;
}

.gallery .window {
  flex-grow: 10;
  align-content: center;
  overflow: hidden;
}

.gallery .line {
  height: 315px;
  margin-left: 50%;
  border-left: solid 1px #0095b5;
  /* width: 5000px; */
}

.gallery .line div {
  /* border: 1px solid #ccc; */
  text-align: center;
  line-height: 313px;
  height: 315px;
}

.items-list {
  display: flex;
}

.items-list div {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  color: transparent;
  /* font-size: 10px; */
}

.items-list.animation-on {
  transition-property: margin-left;
  transition-duration: 0.5s;
}

.debug {
  display: none;
  position: fixed;
  width: 300px;
  height: 300px;
  border: 1px solid #000;
  /* background-color: #0095b5; */
  top: 50%;
  left: 50%;
  opacity: 0.3;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
}

.debug button {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
}
</style>
