import "./assets/main.css";
//provide:建立全域函數。
import { createApp, provide } from "vue";
import App from "./App.vue";
import router from "./router";

//框架引入
import $ from "jquery";
window.$ = $;

const app = createApp(App);

//建立痊癒函數
const globalFunctions = {
  sayHello: () => {
    alert("Hello from global function!");
  },
};

// 使用 provide 提供给整个应用程序
app.provide("globalFunctions", globalFunctions);

app.use(router);
app.mount("#app");
