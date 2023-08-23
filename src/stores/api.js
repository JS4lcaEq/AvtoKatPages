import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useApiOptions = defineStore('api', () => {
  const data = ref(null)
  const url = "assets/api_options.json"
  const meta = ref({url: url})

  async function load() {
    // console.log("store api load")
    if (!data.value) {
      // console.log("store api load: data is null")
      const response = await fetch(url);
      if (response.ok) {
        data.value = await response.json();
      }else{
        console.log("store api load ERROR:" + response.status + " while reading url:'assets/api_options.json'");
      }
    }
    // console.log("store api load: data returned")
    return data.value
  }



  return { data, meta, load }
})
