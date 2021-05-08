<template>
  <div id="hello">
    <img class="logo" src="../assets/logo.png">
    <h1>{{ msg }}</h1>
    <p>鼠标左键：变换视角，右键：平移模型，滚轮：放大缩小</p>
  </div>
</template>

<script>
export default {
  name: 'Hello',
  data () {
    return {
      msg: '欢迎来到微澜天际线!'
    }
  }
}
</script>
<style scoped>
h1, h2 {
  font-weight: normal;
}
p {
  font-size: x-small;
}
.logo{
  width: 200px;
}
#hello{
  color: #f7fbfc;
}
</style>
