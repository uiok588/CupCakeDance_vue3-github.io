<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue"; //import "bootstrap/dist/css/bootstrap.min.css"; //boostarp

//inject:調用全域函數。
//ref陣列響應式資料。
import { inject, ref } from "vue";
//導入的組件
import Header from "./header.vue";
import AreaHead from "./components/areaHead.vue";
import NavComp from "./components/nav.vue";
import ScheduleComp from "./components/schedule.vue";

//調用全域函數
const globalFunctions = inject("globalFunctions");
const callGlobalFunction = () => {
  globalFunctions.sayHello();
};

//組件所需職設定
//後端回傳值，也可以去各組件內找預設的"默認數據"，再去理解回傳所需的值。
const permissionsData = {
  //管理權限
  id: "000",
  level: "1",
  edit: true,
};

const HeaderData = {
  //工作室資料
  title: "杯子蛋糕舞蹈工作室",
  subTitle: "Cup Cake Dance Studio",
  input: "台南市永康區中山南路97號6樓",
  imgSrc: "./img/CupCapCake.png",
  imgHref: "https://www.instagram.com/ccdstudio2018/",
  textarea:
    "所有課程洽詢報名記得私訊官方line 帳號 ｜各項連結 ↓ ↓ ↓ <br />專業街舞｜兒童街舞｜韓國M V｜舞者培訓 <br />舞蹈企劃｜商業合作｜婚禮舞蹈｜尾牙春酒 <br />",
};

const TeacherData = ref([
  //師資介紹
  {
    id: "1",
    title: "筱希老師",
    imgSrc: "./img/CameoLi.jpg",
    imgHref: "https://www.instagram.com/cameo_cnt/",
  },
  {
    id: "2",
    title: "巧萱老師",
    imgSrc: "",
    imgHref: "https://www.instagram.com/ciaosyuan1121/",
  },
]);

const ScheduleData = ref([
  //課程表Data
  {
    month: "12",
    classNum: "A",
    title: "十二月份 Class A",
    subTitle: "師資輪替，詳細課程請點擊右方說明按鈕。",
    note: "紅色為常態課程。",
    schedule: [
      {
        class: "LOCKING",
        teacher: "巧萱老師",
        week: "1",
        time: "18:30-19:30",
        color: "red",
      },
      {
        class: "舞感養成",
        teacher: "筱希老師",
        week: "1",
        time: "14:00-15:00",
        color: "red",
        classInfo: [
          {
            date: "2023-12-04",
            sing: ["小陳", "小菊", "小華"],
            IsOpen: true,
            note: "DressCode主題：性感小野貓。",
          },
          {
            date: "2023-12-04",
            sing: ["小陳", "小菊"],
            IsOpen: false,
            note: "DressCode主題：性感小野貓。",
          },
        ],
      },
      {
        class: "MV",
        teacher: "巧萱老師",
        week: "1",
        time: "19:40-20:40",
        color: "red",
      },
      {
        class: "JAZZ FUNK",
        teacher: "筱希老師",
        week: "1",
        time: "20:40-21:40",
        color: "blue",
      },
      {
        class: "基礎 JAZZ FUNK",
        teacher: "筱希老師",
        week: "2",
        time: "14:00-15:00",
        color: "red",
      },
      {
        class: "基礎 LOCKING",
        teacher: "巧萱老師",
        week: "2",
        time: "15:10-16:10",
        color: "red",
      },
      {
        class: "兒童街舞",
        teacher: "巧萱老師",
        week: "2",
        time: "18:30-19:30",
        color: "purple",
      },
      {
        class: "TWERK",
        teacher: "筱希老師",
        week: "2",
        time: "19:30-20:30",
        color: "red",
      },
      {
        class: "基礎 CHOREO",
        teacher: "筱希老師",
        week: "2",
        time: "20:40-21:40",
        color: "red",
      },
    ],
  },
  {
    month: "12",
    classNum: "B",
    title: "十二月份 Class B",
    subTitle: "師資輪替，詳細課程內容請至IG查詢。",
    note: "紅色為常態課程。",
    schedule: [
      {
        class: "兒童街舞",
        teacher: "筱希老師",
        week: "1",
        time: "19:10-20:10",
        color: "purple",
      },
      {
        class: "HIP HOP",
        teacher: "巧萱老師",
        week: "1",
        time: "20:20-21:20",
        color: "red",
      },
      {
        class: "兒童培訓",
        teacher: "巧萱老師",
        week: "2",
        time: "19:10-20:10",
        color: "purple",
      },
      {
        class: "MV專攻",
        teacher: "巧萱老師",
        week: "2",
        time: "20:40-22:20",
        color: "teal",
      },
    ],
  },
]);
const deleteSchedule = (schedule) => {
  const index = ScheduleData.value.indexOf(schedule);
  ScheduleData.value.splice(index, 1);
  $(".btn_closeMD").click();
};
</script>

<template>
  <!--頁首-->
  <Header
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
  ></Header>
  <!--師資介紹-->
  <AreaHead
    class="d-block d-lg-none"
    style="background: rgb(240, 240, 240)"
    :permissionsData="permissionsData"
    :compID="['navHead']"
    :compData="{
      title: '師資陣容',
    }"
  ></AreaHead>
  <NavComp
    :propsData="TeacherData"
    :permissionsData="permissionsData"
    :compId="['navTeacher']"
    :compData="{
      title: '姓名',
      img: '照片',
      imgSrc: '照片路徑',
      imgSrc_default: './img/Dancer.jpg',
      imgHref: '社群網站',
      modalName: '新增老師',
    }"
  ></NavComp>
  <!--課表 -->
  <AreaHead
    class="d-block"
    :permissionsData="permissionsData"
    :compID="['navHead']"
    :compData="{
      title: '課程表',
    }"
  ></AreaHead>
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
</template>

//boostrap引入
<style lang="scss">
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "/node_modules/bootstrap-icons/font/bootstrap-icons.min.css";

a.disabled {
  pointer-events: none;
}
</style>

<style scoped></style>
