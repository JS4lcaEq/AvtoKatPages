import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { useApiOptions } from '@/stores/api'

export const useFilter = defineStore('filter', () => {
  const ApiOptions = useApiOptions()
  const data = ref(null)

  async function load() {
    // console.log("store filter load")
    let apiOptions = ApiOptions.date
    if (!apiOptions) {
      apiOptions = await ApiOptions.load()
    }
    const url = apiOptions.reguests.developerModelFilter.url
    const response = await fetch(url);
    if (response.ok){
      data.value = await response.json();
      // console.log("store filter loaded")
      return data.value      
    }else{
      console.log("store filter load ERROR:" + response.status + " while reading url:'" +  url + "'");
    }

  }

  return { data, load }
})
