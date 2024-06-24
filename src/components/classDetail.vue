<script>
  /* 
    組件所需資料：  
  */
</script>

<script setup>
//ref陣列響應式資料。
//defineProps接收資料。
//watch監聽資料。
import { ref, defineProps, watch } from "vue";
import { Modal } from "bootstrap";

//每頁必要變數(傳遞數據定義、響應式變數、元件代稱抓取)
const props = defineProps([
  "propsData",
  "permissionsData",
  "compId",
  "compData",
]);
const data = ref([]);

//默認數據
const defaultData = [
  {
  },
];
watch(
  () => props.propsData,
  (newValue) => {
    data.value = newValue && newValue.length ? newValue : defaultData;
  },
  { immediate: true }
);

</script>

<template>
  <section :id="props.compId">
  </section>
</template>

<style scoped>

</style>
