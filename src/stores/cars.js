import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { useApiOptions } from '@/stores/api'

export const useCars = defineStore('cars', () => {
  const ApiOptions = useApiOptions()
  const data = ref(null)

  async function load(filter) {
    // console.log("store cars load")
    const filter_ = {}
    if(filter){
      filter_.body = JSON.stringify(filter)
    }

    let apiOptions = ApiOptions.data
    if (!apiOptions) {
      apiOptions = await ApiOptions.load()
    }
    const url =  apiOptions.reguests.cars.url
    const response = await fetch(url);
    if (response.ok){
      data.value = await response.json();
      // console.log("store cars loaded")
      return data.value      
    }else{
      console.log("store cars load ERROR:" + response.status + " while reading url:'" +  url + "'");
    }

  }

  return { data, load }
})
