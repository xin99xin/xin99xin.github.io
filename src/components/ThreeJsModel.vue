<template>
  <div id="container"></div>
</template>
<script>
/* eslint-disable */
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

export default {
  data () {
    return {
      textProperties: {
        size: 70,
        height: 20,
        bevelThickness: 2,
        bevelSize: 1.5,
        curveSegments: 4,
        bevelEnabled: true,
      },
      mesh: null,
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
      text: '微澜图书馆',
      dirLight: null,
      pointLight: null,

      Width: null,
      height: null,
    }
  },
  mounted () {
    this.width = document.getElementById('container').clientWidth;
    this.height = document.getElementById('container').clientHeight;
    this.init()
  },
  methods: {
    // 初始化
    init () {
      this.createScene() // 创建场景
      this.createMesh() // 创建网格模型
      this.createLight() // 创建光源
      this.createCamera() // 创建相机
      this.createRender() // 创建渲染器
      this.createControls() // 创建控件对象
      this.render() // 渲染
      window.onresize = this.onWindowResize
    },
    // 创建场景
    createScene () {
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0x005691)
      this.scene.fog = new THREE.Fog(0x000000, 250, 1400)
    },
    // 创建网格模型
    createMesh () {
      const textLoader = new THREE.FontLoader()
      const url = 'static/zcoolqingkehuangyouti_Regular.json'
      // const url = "/static/YaHei_Regular.js";
      // 导入字体
      textLoader.load(url, (font) => {
        const options = {
          size: this.textProperties.size,
          height: this.textProperties.height,
          font: font,
          bevelThickness: this.textProperties.bevelThickness,
          bevelSize: this.textProperties.bevelSize,
          bevelEnabled: this.textProperties.bevelEnabled,
          curveSegments: this.textProperties.curveSegments,
        }
        // 创建文本几何体
        const textGeo = new THREE.TextGeometry(this.text, options).center()
        // 创建材质
        const meshMaterial = new THREE.MeshStandardMaterial({
          color: 0x005691,
        })
        // 创建文字网格对象
        this.mesh = new THREE.Mesh(textGeo, meshMaterial)
        // this.mesh.position.set(0, 0, 0);
        this.mesh.rotation.y = 0.3
        this.mesh.rotation.z = 0.0
        // 网格对象添加到场景中
        this.scene.add(this.mesh)
      })
    },

    // 创建光源
    createLight () {
      this.dirLight = new THREE.DirectionalLight(0xffffff, 0.725)
      this.dirLight.position.set(0, 0, 1).normalize()
      this.scene.add(this.dirLight)

      this.pointLight = new THREE.PointLight(0xffffff, 1.5)
      this.pointLight.position.set(0, 100, 90)
      this.scene.add(this.pointLight)
    },
    // 创建相机
    createCamera () {
      const k = this.width / this.height // 窗口宽高比
      this.camera = new THREE.PerspectiveCamera(30, k, 1, 1500)
      this.camera.position.set(0, 400, 700)
      this.camera.lookAt(new THREE.Vector3(0, 0, 0)) // 设置相机方向
      this.scene.add(this.camera)
    },
    // 创建渲染器
    createRender () {

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      })
      this.renderer.setSize(this.width, this.height) // 设置渲染区域尺寸
      document.getElementById('container').appendChild(this.renderer.domElement)
    },

    render () {
      requestAnimationFrame(this.render)
      this.dirLight.position.copy(this.camera.position)
      this.pointLight.position.copy(this.camera.position)
      this.controls.update();
      this.renderer.render(this.scene, this.camera)
    },

    // 创建控件对象
    createControls () {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableZoom = true
      this.controls.minDistance = 100
      this.controls.maxDistance = 1200
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 1.0; // 30 seconds per round when fps is 60
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.8;
    },

    //窗口变动触发的函数
    onWindowResize () {
      this.width = document.getElementById('container').clientWidth;
      this.height = document.getElementById('container').clientHeight;
      this.renderer.setSize(this.width,this.height);
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix()
      this.renderer.render(this.scene, this.camera);
    }
  },
}
</script>
<style>
#container {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
