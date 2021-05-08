<template>
    <div class="input">
      <input class="height1" maxlength="30" type="text" placeholder="请输入微澜id" v-model="userId">&nbsp;&nbsp;
      <input class="height2" type="button" value="生成3d打印模型">
    </div>
</template>

<script>
export default {
  name: 'Form',
  data () {
    return {
      userId: null
    }
  }
}
</script>
<style scoped>
.height1{
  height: 30px;
}
.height2{
  height: 36px;
}
</style>
