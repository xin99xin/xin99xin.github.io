<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default {
  name: 'ShowModel',
  data () {
    return {
      reData: new Array(this.weeks),
      fileName: null,
      userId: null,
      userName: null,
      year: null,
      weeks: 52,
      gender: null,

      // 模型相关
      rootGroup: null,
      material: null,
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
      dirLight: null,
      pointLight: null,

      // 基本颜色
      color: {
        text: 0xffffff,
        model: 0x005691,
        scene: 0x005691,
        light: 0xffffff
      },

      Width: null,
      height: null,

      // 单元格属性
      cell: {
        maxX: 11, // 最大列数
        maxY: 5, // 最大行数
        sideLength: 15, // 单元格边长
        padding: 1, // 边缘填充
        material: new THREE.MeshStandardMaterial({
          color: 0x005691
        })
      }
    }
  },
  mounted () {
    this.width = document.getElementById('container').clientWidth
    this.height = document.getElementById('container').clientHeight
    this.cellGroup = new THREE.Group()
    this.cellGroup.position.set(0, 0, 0)
    this.material = new THREE.Material({
      color: this.color.model
    })
    this.color.scene = new THREE.Color(this.color.scene)
    this.rootGroup = new THREE.Group()
    this.init()
  },

  methods: {
    // 初始化模型
    init () {
      this.getReData()
      this.createScene() // 创建场景
      this.createModelColumns()
      this.loadMesh() // 载入底座模型
      this.createCamera() // 创建相机
      this.createLight() // 创建光源
      this.createRender() // 创建渲染器
      this.createControls() // 创建控件对象
      this.render() // 渲染
      window.onresize = this.onWindowResize
    },

    // 获取数据库查询结果
    getReData () {
      // 生成测试数据
      for (var index = 0; index <= this.weeks; index++) {
        this.reData[index] = {'weekNum': index + 1, 'hours': Math.round(Math.random() * 30)}
      }

      // TODO ajax
    },

    // 提交动作
    onButtonClick () {

    },

    // 创建柱状体
    createModelColumns () {
      var boxSize = this.cell.sideLength - this.cell.padding * 2
      var geometry = new THREE.BoxGeometry(boxSize, boxSize, 1)
      var x, y // 当前单元格坐标
      for (var row of this.reData) {
        var mesh = new THREE.Mesh(geometry, this.cell.material)
        mesh.scale.set(1, 1, row.hours * 1.4)// 加高一些

        // 根据weekNum计算当前的单元格坐标
        x = Math.floor((row.weekNum - 1) / this.cell.maxY)// 星期序号除最大行数向下取整
        y = (row.weekNum - 1 + this.cell.maxY) % this.cell.maxY// 取模
        var pX = x * this.cell.sideLength + this.cell.padding
        var pY = y * this.cell.sideLength + this.cell.padding

        // 由于高度有拉伸，需要调整z轴坐标
        mesh.position.set(pX, pY, row.hours * 0.7)
        this.cellGroup.add(mesh)
        this.rootGroup.add(this.cellGroup)
      }
    },

    createScene () {
      this.scene = new THREE.Scene({
        background: this.color.scene
      }).add(new THREE.AxesHelper())
      this.scene.add(this.rootGroup)
    },
    loadMesh () {
      const objLoader = new OBJLoader()
      const url = 'static/shapr3d_export_2021-05-10_00h06m.obj'
      objLoader.load(url, (obj) => {
        this.baseMesh = obj.children[0]
        // this.mesh.geometry.center();
        this.baseMesh.scale.set(1000, 1000, 1000)
        this.baseMesh.material = this.material
        this.baseMesh.position.set(0, 0, 0)
        this.rootGroup.add(this.baseMesh)
      })
    },

    // 创建光源
    createLight () {
      this.dirLight = new THREE.DirectionalLight(this.color.light, 0.725)
      this.dirLight.position.set(0, 0, 1).normalize()
      this.scene.add(this.dirLight)

      this.pointLight = new THREE.PointLight(this.color.light, 1.5)
      this.pointLight.position.set(0, 100, 90)
      this.scene.add(this.pointLight)
    },
    // 创建相机
    createCamera () {
      const k = this.width / this.height // 窗口宽高比
      this.camera = new THREE.PerspectiveCamera(30, k, 1, 1500)
      this.camera.position.set(0, 300, 700)
      this.camera.lookAt(new THREE.Vector3(0, 0, 0)) // 设置相机方向
      this.scene.add(this.camera)
    },
    // 创建渲染器
    createRender () {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      })
      this.renderer.setSize(this.width, this.height) // 设置渲染区域尺寸
      document.getElementById('container').appendChild(this.renderer.domElement)
    },

    render () {
      requestAnimationFrame(this.render)
      this.dirLight.position.copy(this.camera.position)
      this.pointLight.position.copy(this.camera.position)
      this.controls.update()
      try {
        this.renderer.render(this.scene, this.camera)
      } catch (e) {
        console.error(e)
      }
    },

    // 创建控件对象
    createControls () {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableZoom = true
      this.controls.minDistance = 100
      this.controls.maxDistance = 800
      this.controls.autoRotate = true
      this.controls.autoRotateSpeed = 1.0 // 30 seconds per round when fps is 60
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.8
    },

    // 窗口变动触发的函数
    onWindowResize () {
      this.width = document.getElementById('container').clientWidth
      this.height = document.getElementById('container').clientHeight
      this.renderer.setSize(this.width, this.height)
      this.camera.aspect = this.width / this.height
      this.camera.updateProjectionMatrix()
      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>
<style>
#container {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
