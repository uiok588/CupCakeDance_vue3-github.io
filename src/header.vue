<script>
/* 
    組件所需資料：  
    <header
      :propsData="HeaderData"
      :permissionsData="permissionsData"
      :compId="['header']"
      :compData="{
        title: '工作室名稱',
        subTitle: 'Studio Name',
        input: '地址',
        img: 'Logo圖片',
        imgSrc: 'Logo圖片路徑',
        imgSrc_default: '/img/logo.png',
        imgHref: '社群網站',
        textarea: '備註',
        modalName: '編輯工作室資料',
      }"
    ></header>
  */
</script>

<script setup>
//reactive單筆響應式資料。
//defineProps接收資料。
//watch監聽資料。
import { ref, reactive, defineProps, watch } from "vue";
import { Modal } from "bootstrap";

//傳遞數據
const props = defineProps([
  "propsData",
  "permissionsData",
  "compId",
  "compData",
]);
const data = reactive({});

//默認數據
const defaultData = {
  title: props.compData.title,
  subTitle: props.compData.subTitle,
  input: props.compData.input,
  imgSrc: props.compData.imgSrc_default,
  imgHref: "",
  textarea: props.compData.textarea,
};

watch(
  () => props.propsData,
  (newValue) => {
    data.value = Object.keys(newValue).length > 0 ? newValue : defaultData;
  },
  { immediate: true }
);

//調整textarea高度
const adjustTextareaHeight = () => {
  let textareas = document.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 5}px`;
  });
};
</script>

<template>
  <header :id="props.compId">
    <!-- Content -->
    <div
      class="container d-flex flex-wrap align-items-center justify-content-center"
    >
      <a
        class="img_logo col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end px-5 py-5"
        :href="data.value.imgHref"
        target="'_blank'"
      >
        <img
          :src="data.value.imgSrc"
          :alt="data.value.title + ' Logo'"
          class="w-100"
        />
      </a>
      <section class="col-12 col-lg-6 pt-5 px-5">
        <span
          v-if="props.permissionsData.edit"
          class="btn_edit fs-6 shadow-sm"
          data-bs-toggle="modal"
          :data-bs-target="`#${props.compId}_editModal`"
          @click="adjustTextareaHeight()"
        >
          編輯<i class="bi bi-pencil fs-5 ms-2"></i>
        </span>
        <h1 class="fw-bold text-center text-lg-start">
          {{ data.value.title }}
        </h1>
        <h4 class="mb-4 fw-bold text-center text-lg-start">
          - {{ data.value.subTitle }}
        </h4>
        <span class="d-block w-100 text-center text-lg-start">{{
          data.value.input
        }}</span>
        <!--textarea的值可以完美呈現換行，需要用p標籤，搭配v-html及white-space: pre-wrap做使用。-->
        <p v-html="data.value.textarea" class="text-center text-lg-start"></p>
      </section>
    </div>
    <!-- Modal -->
    <div
      class="modal fade"
      :id="`${props.compId}_editModal`"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <form
        class="modal-dialog modal-dialog-centered"
        @submit.prevent="updateData()"
      >
        <div class="modal-content">
          <div class="modal-header justify-content-center">
            <h1 class="modal-tiftle fs-5 text-center" id="exampleModalLabel">
              <b>{{ props.compData.modalName }}</b>
            </h1>
          </div>
          <div class="modal-body">
            <div class="form-floating mb-3">
              <input
                id="name"
                type="text"
                required="required"
                class="form-control"
                :placeholder="`請輸入${props.compData.title}`"
                v-model="data.value.title"
              />
              <label for="name">{{ props.compData.title }}</label>
            </div>
            <div class="form-floating mb-3">
              <input
                id="nameEN"
                type="text"
                required="required"
                class="form-control"
                :placeholder="`請輸入${props.compData.subTitle}`"
                v-model="data.value.subTitle"
              />
              <label for="nameEN">{{ props.compData.subTitle }}</label>
            </div>
            <div class="form-floating mb-3">
              <input
                id="address"
                type="text"
                required="required"
                class="form-control"
                :placeholder="`請輸入${props.compData.input}`"
                v-model="data.value.input"
              />
              <label for="address">{{ props.compData.input }}</label>
            </div>
            <div class="form-floating mb-3">
              <input
                id="src_IG"
                type="text"
                class="form-control"
                :placeholder="`請輸入${props.compData.imgHref}`"
                v-model="data.value.imgHref"
              />
              <label for="src_IG">{{ props.compData.imgHref }}</label>
            </div>
            <div class="mb-3">
              <label for="img_photo" class="form-label ps-2">{{
                props.compData.img
              }}</label>
              <input
                id="img_photo"
                class="form-control"
                type="file"
                accept=".img,.png"
              />
            </div>
            <div class="form-floating mb-3">
              <textarea
                id="remark"
                type="text"
                class="form-control"
                :placeholder="`請輸入${props.compData.textarea}`"
                v-model="data.value.textarea"
                @input="adjustTextareaHeight"
              />
              <label for="remark">{{ props.compData.textarea }}</label>
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button
              id="btn_closeMD"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              關閉
            </button>
          </div>
        </div>
      </form>
    </div>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  background: rgb(240, 240, 240);
  padding: 2rem 0;

  .img_logo {
    width: 20rem;
  }

  section {
    position: relative;

    p {
      white-space: pre-wrap;
    }

    .btn_edit {
      position: absolute;
      right: 3rem;
      top: 0px;
      padding: 0.3rem 1rem;
      border: 2px solid rgb(211, 211, 211);
      border-radius: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: white;
      color: gray;
      cursor: pointer;

      &:hover {
        color: white;
        background: black;
      }
    }
  }
}
</style>
