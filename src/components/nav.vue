<script>
/* 
    組件所需資料：  
    <nav
      :propsData="TeacherData"
      :permissionsData="permissionsData"
      :compID="['navTeacher']"
      :compData="{
        title: '姓名',
        img: '照片',
        imgSrc: '照片路徑',
        imgSrc_default: '/img/Dancer.jpg',
        imgHref: '社群網站',
        modalName: '新增老師',
      }"
    ></nav>
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
    title: props.compData.title,
    imgSrc: props.compData.imgSrc_default,
    imgHref: "",
  },
];
watch(
  () => props.propsData,
  (newValue) => {
    data.value = newValue && newValue.length ? newValue : defaultData;
  },
  { immediate: true }
);

//新增卡片
const addCard = () => {
  const comp = $(`#${props.compId}`);
  const modal = comp.find(`#${props.compId}_addModal`);
  let newId = Number(data.value[data.value.length - 1].id) + 1;
  const newCard = {
    id: newId,
    title: modal.find("#title").val(),
    imgSrc: "",
    imgHref: modal.find("#imgHref").val(),
  };
  data.value.push(newCard);
  modal.find("#btn_closeMD").click();
  clearVal;
};

//清除modal資料
const clearVal = (btn) => {
  const form = $(btn).closest("form");
  form.find("input").val("");
};

//刪除卡片
const deleteCard = (card) => {
  const index = data.value.indexOf(card);
  data.value.splice(index, 1);
};
</script>

<template>
  <section :id="props.compId">
    <!-- nav -->
    <nav class="col-12 px-5">
      <a
        v-for="n in data"
        :key="n.id"
        :href="n.imgHref"
        :class="{ disabled: !n.imgHref }"
        class="card shadow-sm"
        target="_blank"
      >
        <input type="text" v-model="n.id" hidden />
        <i
          v-if="props.permissionsData.edit"
          class="icon-x-circle-fill position-absolute"
          @click.stop.prevent="() => deleteCard(n)"
        ></i>
        <div
          v-if="n.imgSrc == '' || n.imgSrc == null"
          class="img_container"
          :style="{
            backgroundImage: 'url(' + defaultData[0].imgSrc + ')',
          }"
          alt="未提供照片"
        ></div>
        <div
          v-else-if="n.imgSrc != '' && n.imgSrc != null"
          class="img_container"
          :style="{ backgroundImage: 'url(' + n.imgSrc + ')' }"
          :alt="`${n.title}照片`"
        ></div>
        <span class="fw-bold text-center py-1">{{ n.title }}</span>
      </a>
      <button
        v-if="props.permissionsData.edit"
        class="btn card shadow-sm addCard"
        data-bs-toggle="modal"
        :data-bs-target="`#${props.compId}_addModal`"
      >
        <div
          class="img_container"
          style="background-image: url('./img/addPerson.png')"
        ></div>
        <span class="fw-bold text-center py-1">新增老師</span>
      </button>
    </nav>
    <!-- modal -->
    <div
      class="modal fade"
      :id="`${props.compId}_addModal`"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <form
        class="modal-dialog modal-dialog-centered"
        @submit.prevent="addCard()"
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
                id="title"
                type="text"
                required="required"
                class="form-control"
                :placeholder="`請輸入${props.compData.title}`"
              />
              <label for="title">{{ props.compData.title }}</label>
            </div>

            <div class="form-floating mb-3">
              <input
                id="imgHref"
                type="text"
                class="form-control"
                :placeholder="`請輸入${props.compData.imgHref}`"
              />
              <label for="imgHref">{{ props.compData.imgHref }}</label>
            </div>

            <div class="mb-3">
              <label for="img_photo" class="form-label ps-2">{{
                props.compData.img
              }}</label>
              <input
                id="imgSrc"
                class="form-control"
                type="file"
                accept=".img,.png"
              />
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button
              id="btn_closeMD"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="clearVal($event.target)"
            >
              取消
            </button>
            <button class="btn btn-primary margin-auto" type="submit">
              新增
            </button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
section {
  background: rgb(240, 240, 240);

  nav {
    display: flex;
    background: rgb(168, 9, 96);
    padding: 1rem 3rem;
    max-width: 100vw;
    width: 100%;
    overflow: auto;

    &::-webkit-scrollbar {
      background-color: #ecc0c0;
      height: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #630146;
    }

    .card {
      display: flex;
      border: 2px solid rgb(255, 255, 255);
      border-radius: 5px;
      margin-right: 2rem;
      min-width: 12rem;
      width: 12rem;
      text-decoration: none;

      &:hover {
        border: 5px solid #ffdea0;

        span {
          background: #ffdea0;
        }
      }

      .icon-x-circle-fill {
        pointer-events: auto;
        font-size: 1.8rem;
        top: -20px;
        right: -15px;
        color: rgb(255, 255, 255);

        &:hover,
        &:active,
        &:focus {
          font-size: 2rem;
          top: -25px;
          right: -20px;
          color: rgb(0, 0, 0);
        }
      }

      &.addCard {
        padding: 0;

        span {
          width: 100%;
          background: white;
        }

        &:hover,
        &:active,
        &:focus {
          span {
            background: #ffdea0;
          }
        }
      }

      .img_container {
        width: 100%;
        aspect-ratio: 4 / 4.5;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
  }

  @media (max-width: 991.98px) {
    nav {
      height: 60vh;
      min-height: 65vw;
      display: flex;
      align-items: center;

      .card {
        min-width: 40vw;
        width: 40vw;
        height: fit-content;
      }
    }
  }
}
</style>
