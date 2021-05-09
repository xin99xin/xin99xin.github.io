<template>
  <div>
<!--    <Hello class="hello"/>-->
<!--    <Form class="form"/>-->
<!--    <-->
<!--&lt;!&ndash;    <ThreeJsModel />&ndash;&gt;-->

<!--    <Base />-->
    <router-view/>
  </div>
</template>

<script>
// import ThreeJsModel from './components/ThreeJsModel'

// import Hello from './components/Hello'
// import Form from './components/Form'
// import Base from './components/ThreeJsObj'
export default {
  name: 'App'
  // components: {
  //   // ThreeJsModel,
  //   Hello,
  //   Form,
  //   Base
  // }
}
</script>
<style>
.form {
  position: fixed;
  left:50%;
  bottom:15%;
  transform:translate(-50%,-50%);
  z-index:1000;
}
.hello {
  position: fixed;
  left:20%;
  top:15%;
  transform:translate(-50%,-50%);
  z-index:1000;
}
</style>
