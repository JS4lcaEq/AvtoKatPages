<script setup>
import { ref, reactive, computed, onMounted } from "vue";

const windowelement = ref(null);
const windowWidth = ref(0);
const itemsList = ref(null);
const rightElement = ref(null);
const rightTargetMargin = ref(0);
const leftElement = ref(null);
const leftTargetMargin = ref(0);
const isAnimation = ref(false);
const currentMargin = ref(0);
const widthList = ref([]);
let direction = 0;

const props = defineProps({
  imagesList: {
    type: Array,
    required: true,
  },
});

function createList(arr, marginLeft) {
  let temp = 0;
  const ret = [];
  arr.forEach((e, index) => {
    const l = temp;
    temp += e.w;
    const r = temp;
    ret[index] = { l: l, r: r, w: e.w, id: e.id };
  });
  return ret;
}

function findRight(widthList, currentMargin, windowWidth) {
  return widthList.find(
    (e) =>
      e.l <= windowWidth + currentMargin && e.r > windowWidth + currentMargin
  );
}

function findLeft(widthList, currentMargin) {
  return widthList.find((e) => e.l < currentMargin && e.r >= currentMargin);
}

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

const totalWidth = computed(() => {
  let ret = 0;
  arr.value.forEach((item) => {
    ret += item.w;
  });
  return ret;
});

function onMoveLeft() {
  if (!isAnimation.value) {
    onGetWidth();
    isAnimation.value = true;
    currentMargin.value = leftTargetMargin.value;
    direction = 1;
  }
}
function onMoveRight() {
  if (!isAnimation.value) {
    onGetWidth();
    isAnimation.value = true;
    currentMargin.value = rightTargetMargin.value;
    direction = -1;
  }
}

function onTransitionEnd() {
  if (isAnimation.value) {
    isAnimation.value = false;

    if (direction == -1) {
      const targetId = rightElement.value.id;
      arr.value = moveArr(arr.value, direction);
      onGetWidth();
      const targetElement = widthList.value.find((e) => e.id == targetId);
      currentMargin.value = targetElement.r - windowWidth.value;
    }
    if (direction == 1 && leftElement.value) {
      const targetId = leftElement.value.id;
      arr.value = moveArr(arr.value, direction);
      onGetWidth();
      const targetElement = widthList.value.find((e) => e.id == targetId);
      currentMargin.value = targetElement.l;
    }
  }
}

onMounted(() => {
  currentMargin.value = arr.value[0].w + arr.value[1].w;
  window.addEventListener("resize", (event) => {
    const w = windowelement.value.offsetWidth;
    windowWidth.value = w;
  });
  windowWidth.value = windowelement.value.offsetWidth;
});

function onGetWidth() {
  widthList.value = createList(arr.value, currentMargin.value);
  rightElement.value = findRight(
    widthList.value,
    currentMargin.value,
    windowWidth.value
  );
  rightTargetMargin.value = rightElement.value.r - windowWidth.value;
  leftElement.value = findLeft(widthList.value, currentMargin.value);
  if(leftElement.value){
    leftTargetMargin.value = leftElement.value.l;
  }
  
}


</script>

<template>
  <div class="gallery">
    <div class="debug">
      currentMargin = {{ currentMargin }} isAnimation =
      {{ isAnimation }} windowWidth={{ windowWidth }}
      <button @click="onGetWidth">Get width</button>
      <p v-for="(e, index) in widthList" :key="index">{{ index }}{{ e }}</p>
      <p>
        rightElement = {{ rightElement }} rightTargetMargin=
        {{ rightTargetMargin }}
      </p>
      <p>
        leftElement = {{ leftElement }} leftTargetMargin= {{ leftTargetMargin }}
      </p>
    </div>
    <div class="button" @click="onMoveLeft">&lsaquo;</div>
    <div class="window" ref="windowelement">
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
            {{ item.id }} {{ item.w }}
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
  flex-shrink: 0;
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
  font-size: 22px;
  color: transparent;
  /* font-size: 10px; */
}

.items-list.animation-on {
  transition-property: margin-left;
  transition-duration: 0.4s;
}

.debug {
  display: none;
  position: fixed;
  width: 300px;
  height: 300px;
  border: 1px solid #000;
  background-color: #fff;
  top: 50%;
  left: 50%;
  opacity: 0.9;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
}

.debug button {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
}

p {
  margin: 0;
}
</style>
