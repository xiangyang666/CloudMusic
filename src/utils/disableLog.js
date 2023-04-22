import log from "@/utils/colorLog";

/**
 * 本模块根据不同模式选择禁不禁用浏览器控制台打印
 * */

// 1. 获取当前是什么模式（开发或生产）
const env = process.env.VUE_APP_MODE;

// 开发模式
if (env === "development") {
  // console.log("开发模式");
} else {
  // 浏览器，禁用右键、禁用保存、禁用控制台和打印的方法
  window.addEventListener("load", disabled);
  // console.log("生产模式");

  log();
}

/**
 * F12键的编码：123
 * ctrl：17
 * s：83
 * p：80
 * */
function disabled() {
  // 配置项
  const config = {
    rightKey: false, // 是否开启右键菜单
    controller: false, // 是否开启控制台
    savePage: false, // 是否允许 ctrl + s 保存网页
  };

  // 右键禁用
  if (!config.rightKey) document.oncontextmenu = () => false;

  // 禁用 ctrl + s 和 F12 控制台
  window.addEventListener("keydown", keyDown, false);

  // 键盘按下事件
  function keyDown(e) {
    // 禁止F12
    if (e.keyCode == 123 && !config.controller) {
      e.preventDefault(); // 阻止元素发生默认的行为。
      // alert('禁止 F12 打开控制台')
      return false; // return false 后，后面代码都不会执行！
    }
    //可以判断是不是mac，如果是mac,ctrl变为花键
    if (
      e.keyCode == 83 &&
      (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
      !config.savePage
    ) {
      e.preventDefault();
      alert("禁止 ctrl + s 打开控制台");
      return false;
    }
  }
}

/**
 * Test Code ---------------------------------------------------------------------------------------------------------------------------------
 * */

// 获取用户点击的键盘的编码
// document.onkeydown = function (e) {
//   console.log(e.keyCode);
// };
