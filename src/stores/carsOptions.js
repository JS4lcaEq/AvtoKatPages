import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { useApiOptions } from '@/stores/api'

export const useCarsOptions = defineStore('carsOptions', () => {
  const ApiOptions = useApiOptions()
  const data = ref(null)

  async function load() {
    // console.log("store carsOptions load")
    let apiOptions = ApiOptions.date
    if (!apiOptions) {
      apiOptions = await ApiOptions.load()
    }
    const url = apiOptions.reguests.carsOptions.url
    const response = await fetch(url);
    if (response.ok){
      data.value = await response.json();
      // console.log("store carsOptions loaded")
      return data.value      
    }else{
      console.log("store cars load ERROR:" + response.status + " while reading url:'" +  url + "'");
    }

  }

  return { data, load }
})
