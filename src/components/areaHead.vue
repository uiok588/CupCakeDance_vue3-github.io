<script>
/* 
    組件所需資料：  
    <nav
      :permissionsData="permissionsData"
      :compID="['navTeacher']"
      :compData="{
        title: '標題',
      }"
    ></nav>
  */
</script>

<script setup>
//ref陣列響應式資料。
//defineProps接收資料。
//watch監聽資料。
import { ref, defineProps, watch } from "vue";

//每頁必要變數(傳遞數據定義、響應式變數、元件代稱抓取)
const props = defineProps(["permissionsData", "compID", "compData"]);
</script>

<template>
  <div>
    <h3
      :id="props.compID"
      class="d-block w-100 text-center mt-5 pt-5 mb-3 fw-semibold text-body-tertiary"
    >
      {{ props.compData.title }}<br />
      <i class="bi bi-chevron-down"></i>
    </h3>
  </div>
</template>

<style scoped></style>
