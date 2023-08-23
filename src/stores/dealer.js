import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { useApiOptions } from '@/stores/api'

export const useDealer = defineStore('dealer', () => {
  const ApiOptions = useApiOptions()
  const data = ref(null)

  async function load() {
    // console.log("store dealer load")
    let apiOptions = ApiOptions.data
    if (!apiOptions) {
      apiOptions = await ApiOptions.load()
    }
    const url =  apiOptions.reguests.dealer.url
    const response = await fetch(url);
    if (response.ok){
      data.value = await response.json();
      // console.log("store dealer loaded")
      return data.value      
    }else{
      console.log("store dealer load ERROR:" + response.status + " while reading url:'" +  url + "'");
    }

  }

  return { data, load }
})
