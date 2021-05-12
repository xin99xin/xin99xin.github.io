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
      // 用户信息
      userinfo: {
        userId: 0,
        userName: '',
        year: '',
        gender: ''
      },

      // 模型相关
      modelUrl: 'static/shapr3d_export_2021-05-09_12h29m.obj',
      reData: [],
      rootGroup: new THREE.Group(),
      camera: null,
      scene: new THREE.Scene().add(new THREE.AxesHelper()),
      renderer: new THREE.WebGLRenderer(),
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
      cell: {
        maxX: 11, // 最大列数
        maxY: 5, // 最大行数
        sideLength: 15, // 单元格边长
        padding: 1 // 边缘填充
      },
      STLFileName: '',

      // 页面
      Width: null,
      height: null
    }
  },
  mounted () {
    this.width = document.getElementById('container').clientWidth
    this.height = document.getElementById('container').clientHeight
    this.scene = new THREE.Scene().add(this.rootGroup)
    this.getReData()
    this.rootGroup.add(this.createColumns(this.reData))
    this.loadBase(this.modelUrl, 1000)
    this.createLight() // 创建光源
    this.createCamera() // 创建相机
    this.renderer.setSize(this.width, this.height) // 设置渲染区域尺寸
    document.getElementById('container').appendChild(this.renderer.domElement)
    this.createControls() // 创建控件对象
    this.render() // 渲染
    window.onresize = this.onWindowResize
  },

  methods: {
    // 获取数据库查询结果
    getReData () {
      // 生成测试数据
      for (let index = 0; index <= 51; index++) {
        this.reData[index] = {'weekNum': index + 1, 'hours': Math.round(Math.random() * 30)}
      }

      // TODO ajax
    },

    // 创建柱状体
    createColumns (data) {
      const boxSize = this.cell.sideLength - this.cell.padding * 2
      const geometry = new THREE.BoxGeometry(boxSize, boxSize, 1)
      const group = new THREE.Group()
      let x, y // 当前单元格坐标
      for (const row of data) {
        const mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshBasicMaterial({
            color: this.colors.A.M,
            wireframe: true
          })
        )
        mesh.scale.set(1, 1, row.hours * 1.4)// 加高一些

        // 根据weekNum计算当前的单元格坐标
        x = Math.floor((row.weekNum - 1) / this.cell.maxY)// 星期序号除最大行数向下取整
        y = (row.weekNum - 1 + this.cell.maxY) % this.cell.maxY// 取模
        const pX = x * this.cell.sideLength + this.cell.padding
        const pY = y * this.cell.sideLength + this.cell.padding

        // 由于高度有拉伸，需要调整z轴坐标
        mesh.position.set(pX, pY, row.hours * 0.7)
        group.add(mesh)
      }
      return group
    },

    loadBase (url, scale) {
      new OBJLoader().load(url, (obj) => {
        obj.scale.set(scale, scale, scale)
        obj.children[0].material = new THREE.MeshBasicMaterial({
          color: this.colors.A.M,
          wireframe: true}
        )
        this.rootGroup.add(obj)
      })
    },

    createLight () {
    },

    // 创建相机
    createCamera () {
      const k = this.width / this.height // 窗口宽高比
      this.camera = new THREE.PerspectiveCamera(30, k, 1, 2500)
      this.camera.position.set(0, 0, 700)
      this.scene.add(this.camera)
    },

    render () {
      requestAnimationFrame(this.render)
      // this.controls.update()
      this.renderer.render(this.scene, this.camera)
    },

    // 创建控件对象
    createControls () {
      const controls = new OrbitControls(this.camera, this.renderer.domElement)
      controls.enableZoom = true
      controls.minDistance = 100
      controls.maxDistance = 2000
      controls.enableDamping = true
      controls.dampingFactor = 0.8
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
