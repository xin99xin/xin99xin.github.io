<template>
  <div>
    <Hello class="hello"/>
    <Form class="form"/>
    <ThreeJsModel class="model"/>
  </div>
</template>

<script>
import ThreeJsModel from './components/ThreeJsModel'
import Hello from './components/Hello'
import Form from './components/Form'
export default {
  name: 'App',
  components: {ThreeJsModel, Hello, Form}
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
