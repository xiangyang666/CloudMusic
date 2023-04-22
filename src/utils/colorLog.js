// 带有样式的控制台打印
// 这里只有一段话，却分成了两句话，所以下面有两个样式（控制对应各自的每一句话）
const text = `%c网易云音乐%ccloud_music_app`;

const textStyle1 =
  'color:#fff;background-color:#ec4141;border-radius:3px 0 0 3px;padding:1px 5px;cursor: pointer;font-family:"楷体";font-size:14px;';
const textStyle2 =
  'color:#fff;background-color:#41b883;border-radius:0px 3px 3px 0;padding:1px 5px;cursor: pointer;font-family:"楷体";font-size:14px;';

function log() {
  console.log(
    // 文本
    text,
    // 下边是样式
    textStyle1,
    textStyle2
  );
}

export default log;
