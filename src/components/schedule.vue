<script>
/*
    組件所需資料：  
    <ScheduleComp
      v-for="n in ScheduleData"
      :propsData="n"
      :permissionsData="permissionsData"
      :compId="[`schedule_${n.month}_${n.classNum}`]"
      :compData="{
        className: '課程表標題',
        teacherSel: '選擇老師',
        class: '課程',
        teacherSel: '老師名字',
        teachers: TeacherData,
        month: '月份',
        classNum: '教師編號',
        week: '星期',
        time: '時間',
        color: '顏色',
        colorRemark: '顏色備註',
        add_modalName: '新增課程',
        edit_modalName: '編輯課程表',
        scheduleTitle: '標題',
        scheduleSubTitle: '副標',
        scheduleNote: '備註',
        note_modalName: '補充說明',
        delete_modalName: '提醒',
        deleteWarn:
          '該課程表確認刪除後，所有的課程皆一併刪除，確認要繼續執行刪除動作？',
      }"
      @deleteSchedule="deleteSchedule($event, parentParam)"
    ></ScheduleComp>
  */
</script>

<script setup>
//reactive單筆響應式資料。
//defineProps接收資料。
//watch監聽資料。
import { ref, reactive, defineProps, watch } from "vue";
import { Modal } from "bootstrap";

//導入組件
import ClassDetail from "./classDetail.vue";

//傳遞數據
const props = defineProps([
  "propsData",
  "permissionsData",
  "compId",
  "compData",
]);
const data = reactive({});
const selectedColor = ref([]);

//默認數據
const defaultData = {
  title: props.compData.title,
  month: props.compData.month,
  classNum: props.compData.classNum,
  subTitle: props.compData.subTitle,
  schedule: [],
};

watch(
  () => props.propsData,
  (newValue) => {
    newValue.schedule.sort((a, b) => {
      const timeA = getTimeValue(a.time);
      const timeB = getTimeValue(b.time);
      return timeA - timeB;
    });
    data.value = Object.keys(newValue).length > 0 ? newValue : defaultData;
  },
  { immediate: true }
);

//新增卡片
const addCard = () => {
  const comp = $(`#${props.compId}`);
  const modal = comp.find(`#${props.compId}_addModal`);
  const newCard = {
    class: modal.find("#className").val(),
    teacher: modal.find("#teacherSel").val(),
    week: modal.find("#weekSel").val(),
    time: modal.find("#time").val(),
    color: modal.find("#colorSel").val(),
  };
  data.value.schedule.push(newCard);
  modal.find("#btn_closeMD").click();
  clearVal();
};

//刪除卡片
const deleteCard = (card) => {
  const index = data.value.schedule.indexOf(card);
  data.value.schedule.splice(index, 1);
};

//清除modal資料
const clearVal = (btn) => {
  const form = $(btn).closest("form");
  form.find("input").val("");
  form.find("select").prop("selectedIndex", 0);
  selectedColor.value = [];
};

//辅助函数：時間資料轉換成數值 (ex：14:00 轉換成 1400）
function getTimeValue(timeString) {
  const [hour, minute] = timeString.split(":").map((segment) => {
    const num = Number(segment);
    return isNaN(num) ? 0 : num;
  });
  return hour * 100 + minute;
}

//調整textarea高度
const adjustTextareaHeight = () => {
  let textareas = document.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 5}px`;
  });
};

//組件所需職設定
//後端回傳值，點擊課程卡片，所需的值。
const permissionsData = {
  //管理權限
  id: "000",
  level: "1",
  edit: true,
};
</script>

<template>
  <section :id="props.compId" class="mb-5">
    <!-- Content -->
    <div class="container-lg">
      <div class="btnDiv">
        <span
          v-if="props.permissionsData.edit"
          class="btn btn_edit fs-6"
          data-bs-toggle="modal"
          :data-bs-target="`#${props.compId}_editModal`"
          >編輯<i class="bi bi-pencil fs-5 ms-2"></i
        ></span>
        <span
          v-if="props.permissionsData.edit"
          class="btn btn_add fs-6 shadow-sm"
          data-bs-toggle="modal"
          :data-bs-target="`#${props.compId}_addModal`"
          >新增<i class="bi bi-file-earmark-plus fs-5 ms-2"></i
        ></span>
        <span
          v-if="props.permissionsData.edit"
          class="btn btn_add fs-6 shadow-sm"
          data-bs-toggle="modal"
          :data-bs-target="`#${props.compId}_deleteModal`"
          >刪除<i class="bi bi-calendar2-x fs-5 ms-2"></i
        ></span>
        <span
          class="btn btn_note fs-6 shadow-sm"
          data-bs-toggle="modal"
          :data-bs-target="`#${props.compId}_noteModal`"
          >說明<i class="bi bi-journal-text fs-5 ms-2"></i
        ></span>
      </div>
      <div class="scheduleDiv pb-2">
        <h4 class="col-12 fw-bolder">{{ props.propsData.title }}</h4>
        <h6 class="col-12 text-dark secondary fw-normal">
          {{ props.propsData.subTitle }}
        </h6>
        <div
          class="weekDiv col-12 d-flex flex-wrap justify-content-between mb-2"
        >
          <div class="week">SUN</div>
          <div class="week">MON</div>
          <div class="week">TUE</div>
          <div class="week">WED</div>
          <div class="week">THU</div>
          <div class="week">FRI</div>
          <div class="week">SAT</div>
        </div>
        <div class="classDiv col-12 d-flex flex-wrap justify-content-between">
          <div
            class="week py-2"
            v-for="week in ['7', '1', '2', '3', '4', '5', '6']"
            :key="week"
          >
            <template v-for="n in data.value.schedule" :key="n.class">
              <button
                class="btn my-1 position-relative"
                v-if="n.week === week"
                :style="{ borderColor: n.color }"
              >
                <i
                  class="bi bi-x-circle-fill position-absolute"
                  :class="{ 'd-none': !props.permissionsData.edit }"
                  @click.stop.prevent="() => deleteCard(n)"
                ></i>
                <h6 class="fw-bold mb-1">{{ n.class }}</h6>
                <span class="fw-semibold mb-0">{{ n.teacher }}</span>
                <span>{{ n.time }}</span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- addModal -->
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
              <b>{{ props.compData.add_modalName }}</b>
            </h1>
          </div>
          <div class="modal-body">
            <div class="form-floating mb-3">
              <input
                id="className"
                type="text"
                required="required"
                class="form-control"
                :placeholder="`請輸入${props.compData.className}`"
              />
              <label for="className">{{ props.compData.className }}</label>
            </div>
            <div class="form-floating mb-3">
              <select
                id="teacherSel"
                class="form-select"
                aria-label="Floating label select example"
                required="required"
              >
                <option value="" selected disabled>
                  請選擇{{ props.compData.teacherSel }}
                </option>
                <option
                  :value="teacher.id"
                  v-for="teacher in props.compData.teachers"
                >
                  {{ teacher.title }}
                </option>
              </select>
              <label for="teacherSel">{{ props.compData.teacherSel }}</label>
            </div>
            <div class="form-floating mb-3">
              <select
                id="weekSel"
                class="form-select"
                aria-label="Floating label select example"
                required="required"
              >
                <option value="" selected disabled>
                  <span class="py-5">請選擇{{ props.compData.week }}</span>
                </option>
                <option
                  :value="week.value"
                  v-for="week in [
                    { value: '7', name: '日' },
                    { value: '1', name: '一' },
                    { value: '2', name: '二' },
                    { value: '3', name: '三' },
                    { value: '4', name: '四' },
                    { value: '5', name: '五' },
                    { value: '6', name: '六' },
                  ]"
                >
                  {{ week.name }}
                </option>
              </select>
              <label for="week">{{ props.compData.week }}</label>
            </div>
            <div class="form-floating mb-3">
              <input
                id="time"
                type="text"
                pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]-(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
                required="required"
                class="form-control"
                :placeholder="`請輸入${props.compData.time}`"
              />
              <label for="time"
                >{{ props.compData.time }} ( 範例：00:00-24:00 )</label
              >
            </div>
            <div class="form-floating mb-3">
              <select
                id="colorSel"
                class="form-select"
                aria-label="Floating label select example"
                required="required"
                v-model="selectedColor.value"
                :style="{ color: selectedColor.value }"
              >
                <option value="" selected disabled>
                  請選擇{{ props.compData.color }}
                </option>
                <option
                  :style="`color:${color.value};`"
                  :value="color.value"
                  v-for="color in [
                    { value: 'red', name: '紅色' },
                    { value: 'orange', name: '橘色' },
                    { value: 'yellow', name: '黃色' },
                    { value: 'green', name: '綠色' },
                    { value: 'blue', name: '藍色' },
                    { value: 'purple', name: '紫色' },
                    { value: 'brown', name: '咖啡色' },
                    { value: 'gray', name: '灰色' },
                    { value: 'silver', name: '銀色' },
                    { value: 'burlywood', name: '淺木色' },
                    { value: 'maroon', name: '栗色' },
                    { value: 'teal', name: '青色' },
                    { value: 'olive', name: '橄欖色' },
                    { value: 'navy', name: '海軍藍色' },
                    { value: 'blueviolet', name: '紫羅蘭色' },
                    { value: 'chocolate', name: '巧克力色' },
                    { value: 'coral', name: '珊瑚色' },
                    { value: 'fuchsia', name: '紫紅色' },
                    { value: 'lime', name: '萊姆色' },
                    { value: 'aqua', name: '海藍色' },
                  ]"
                >
                  ● {{ color.name }}
                </option>
              </select>
              <label for="week">{{ props.compData.color }}</label>
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
    <!-- editModal -->
    <div
      class="modal fade"
      :id="`${props.compId}_editModal`"
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
              <b>{{ props.compData.edit_modalName }}</b>
            </h1>
          </div>
          <div class="modal-body">
            <div class="form-floating mb-3">
              <input
                id="title"
                type="text"
                class="form-control"
                :placeholder="`請輸入${props.compData.scheduleTitle}`"
                v-model="data.value.title"
              />
              <label for="src_IG">{{ props.compData.scheduleTitle }}</label>
            </div>
            <div class="form-floating mb-3">
              <input
                id="subTitle"
                type="text"
                class="form-control"
                :placeholder="`請輸入${props.compData.scheduleSubTitle}`"
                v-model="data.value.subTitle"
              />
              <label for="src_IG">{{ props.compData.scheduleSubTitle }}</label>
            </div>
            <div class="form-floating mb-3">
              <textarea
                id="remark"
                type="text"
                class="form-control"
                :placeholder="`請輸入${props.compData.scheduleNote}`"
                v-model="data.value.note"
                @input="adjustTextareaHeight"
              />
              <label for="remark">{{ props.compData.scheduleNote }}</label>
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
    <!-- noteModal -->
    <div
      class="modal fade"
      :id="`${props.compId}_noteModal`"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header justify-content-center">
            <h1 class="modal-tiftle fs-5 text-center" id="exampleModalLabel">
              <b>{{ props.compData.note_modalName }}</b>
            </h1>
          </div>
          <div class="modal-body">
            <!--textarea的值可以完美呈現換行，需要用p標籤，搭配v-html及white-space: pre-wrap做使用。-->
            <p
              v-html="props.propsData.note"
              class="text-center text-lg-start"
              style="white-space: pre-wrap"
            ></p>
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
      </div>
    </div>
    <!-- deleteModal -->
    <div
      class="modal fade"
      :id="`${props.compId}_deleteModal`"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header justify-content-center bg-danger text-light">
            <h1 class="modal-tiftle fs-5 text-center" id="exampleModalLabel">
              <b>{{ props.compData.delete_modalName }}</b>
            </h1>
          </div>
          <div class="modal-body">
            <!--textarea的值可以完美呈現換行，需要用p標籤，搭配v-html及white-space: pre-wrap做使用。-->
            <p
              v-html="props.compData.deleteWarn"
              class="text-center text-lg-start"
              style="white-space: pre-wrap"
            ></p>
          </div>
          <div class="modal-footer justify-content-center">
            <button
              id="btn_closeMD"
              type="button"
              class="btn btn-secondary btn_closeMD"
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button
              class="btn btn-danger margin-auto"
              @click="$emit('deleteSchedule', props.propsData)"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  .container-lg {
    overflow-x: auto;
    position: relative;

    &::-webkit-scrollbar {
      height: 10px;
      background-color: rgb(240, 240, 240);
    }

    &::-webkit-scrollbar-thumb {
      background-color: gray;
    }

    .scheduleDiv {
      min-width: 860px;
    }

    .btnDiv {
      position: sticky;
      top: 48px;
      left: calc(100% - 310px);
      display: flex;
      justify-content: flex-end;
      width: 100%;

      span.btn {
        padding: 0.3rem 1rem;
        border: 2px solid rgb(211, 211, 211);
        border-radius: 50px;
        background: white;
        color: gray;
        cursor: pointer;

        &:not(:last-child) {
          margin-right: 1rem;
        }

        &:hover,
        &:active,
        &:focus {
          color: white;
          background: black;
        }

        &.btn_note {
          color: rgba(168, 9, 97, 0.7);
          border: 2px solid rgba(168, 9, 97, 0.5);

          &:hover,
          &:active,
          &:focus {
            color: white;
            background: rgb(168, 9, 96);
          }
        }
      }
    }

    .weekDiv {
      .week {
        font-size: 1.2rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        width: 12%;
        border-radius: 5px;
        background: gray;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        color: white;
        letter-spacing: 0.2rem;
      }
    }
    .classDiv {
      .week {
        width: 12%;
        border-radius: 5px;
        background: rgb(240, 240, 240);
        font-weight: 400;
        color: white;
        position: relative;

        & > button {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-left-width: 8px;
          border-right-width: 8px;
          background: white;
          width: 100%;

          &:hover,
          &:active,
          &:focus {
            color: rgb(168, 9, 96);
          }

          span {
            font-size: 0.8rem;
            display: block;
          }

          .bi.bi-x-circle-fill {
            pointer-events: auto;
            font-size: 1.2rem;
            top: -15px;
            right: -15px;
            color: gray;

            &:hover,
            &:active,
            &:focus {
              font-size: 1.5rem;
              top: -18px;
              right: -20px;
              color: rgb(0, 0, 0);
            }
          }
        }
      }
    }
  }

  @media (max-width: 991.98px) {
    .container-lg {
      .btnDiv {
        position: static;
        margin: 2rem 0 1rem 0;
      }
    }
  }
}
</style>
