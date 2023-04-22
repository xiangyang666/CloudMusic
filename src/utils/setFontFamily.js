// css:网页引入字体@font-face以及动态加载字体
// 动态添加自定义字体样式
export const changeFontFamily = async (font) => {
  const myfont = new FontFace('myfont', `url(${font})`)
  await myfont.load
  document.fonts.add(myfont)
}