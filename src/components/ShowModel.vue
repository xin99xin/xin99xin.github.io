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
      modelUrl: 'static/shapr3d_export_2021-05-09_12h29m.obj',
      rootGroup: new THREE.Group(),
      lights: {
        dirLight: new THREE.Light(),
        pointLight: new THREE.Light()
      },
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
      colors: {
        A: {
          M: 0x0969a2,
          R: 0xFF8C00
        },
        B: {
          M: 0x245A7A,
          R: 0xBF7F30
        },
        C: {
          M: 0x03436A,
          R: 0xA65B00
        },
        D: {
          M: 0x64A8D1,
          R: 0xFFC073
        }
      },

      Width: null,
      height: null,

      // 单元格属性
      cell: {
        maxX: 11, // 最大列数
        maxY: 5, // 最大行数
        sideLength: 15, // 单元格边长
        padding: 1 // 边缘填充
      }
    }
  },
  mounted () {
    this.width = document.getElementById('container').clientWidth
    this.height = document.getElementById('container').clientHeight
    this.cellGroup = new THREE.Group()
    this.baseGroup = new THREE.Group()
    this.rootGroup.add(this.cellGroup, this.baseGroup)
    this.scene = new THREE.Scene()
      .add(new THREE.AxisHelper())
      .add(this.rootGroup)
      .add(this.lights.dirLight, this.lights.pointLight)
    this.getReData()
    this.createModelColumns()
    this.loadMesh() // 载入底座模型
    this.createLight() // 创建光源
    this.createCamera() // 创建相机
    this.createRender() // 创建渲染器
    this.createControls() // 创建控件对象
    this.render() // 渲染
    window.onresize = this.onWindowResize
  },

  methods: {
    // 获取数据库查询结果
    getReData () {
      // 生成测试数据
      for (var index = 0; index <= this.weeks; index++) {
        this.reData[index] = {'weekNum': index + 1, 'hours': Math.round(Math.random() * 30)}
      }
      console.log(this.reData)

      // TODO ajax
    },

    // 创建柱状体
    createModelColumns () {
      var boxSize = this.cell.sideLength - this.cell.padding * 2
      var geometry = new THREE.BoxGeometry(boxSize, boxSize, 1)
      var material = new THREE.MeshBasicMaterial({
        color: this.colors.B.M,
        wireframe: true
      })
      var x, y // 当前单元格坐标
      for (var row of this.reData) {
        var mesh = new THREE.Mesh(geometry, material)
        mesh.scale.set(1, 1, row.hours * 1.4)// 加高一些

        // 根据weekNum计算当前的单元格坐标
        x = Math.floor((row.weekNum - 1) / this.cell.maxY)// 星期序号除最大行数向下取整
        y = (row.weekNum - 1 + this.cell.maxY) % this.cell.maxY// 取模
        var pX = x * this.cell.sideLength + this.cell.padding
        var pY = y * this.cell.sideLength + this.cell.padding

        // 由于高度有拉伸，需要调整z轴坐标
        mesh.position.set(pX, pY, row.hours * 0.7)
        this.cellGroup.add(mesh)
      }
      this.scene.add(this.cellGroup)
    },

    loadMesh () {
      new OBJLoader().load(this.modelUrl, (obj) => {
        var mesh = obj.children[0]
        mesh.geometry.center()
        mesh.scale.set(1000, 1000, 1000)
        mesh.material = new THREE.MeshBasicMaterial({
          color: this.colors.D.R,
          wireframe: true
        })
        this.baseGroup.add(mesh)
        this.createModelColumns()
        var size = new THREE.Box3().expandByObject(this.baseGroup).getSize()
        var center = new THREE.Box3().expandByObject(this.cellGroup).getCenter()
        this.cellGroup.position = new THREE.Vector3(-center.x, -center.y, size.z / 2)
      })
      this.scene.add(this.baseGroup)
      this.rootGroup.rotateX(3.14 / 180 * 90)
    },

    // 创建光源
    createLight () {
      this.dirLight = new THREE.DirectionalLight(0xff0000, 0.725)
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
      this.camera.position.set(0, 300, 700)
      this.camera.lookAt(new THREE.Vector3(0, 0, 0)) // 设置相机方向
      this.scene.add(this.camera)
    },
    // 创建渲染器
    createRender () {
      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setSize(this.width, this.height) // 设置渲染区域尺寸
      document.getElementById('container').appendChild(this.renderer.domElement)
    },

    render () {
      requestAnimationFrame(this.render)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
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
