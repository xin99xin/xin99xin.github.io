<template>
  <div id="container"></div>
</template>
<script>
import * as THREE from 'three'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {ImprovedNoise} from 'three/examples/jsm/math/ImprovedNoise'

export default {
  name: 'ShowTerrain',
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
      scene: new THREE.Scene(),
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
        padding: 0 // 边缘填充
      },
      STLFileName: '',

      // 页面、容器、目标旋转、鼠标位置等
      Width: null,
      height: null,
      container: null,
      targetRotation: 0,
      targetRotationOnPointerDown: 0,
      pointerX: 0,
      pointerXOnPointerDown: 0
    }
  },
  mounted () {
    this.width = document.getElementById('container').clientWidth
    this.height = document.getElementById('container').clientHeight
    this.scene = new THREE.Scene().add(this.rootGroup)
    this.getReData()
    this.createTerrain(this.reData)
    this.loadBase(this.modelUrl, 1000)
    this.createLight() // 创建光源
    this.createCamera() // 创建相机
    this.renderer.setSize(this.width, this.height) // 设置渲染区域尺寸
    document.getElementById('container').appendChild(this.renderer.domElement)
    this.container = document.getElementById('container')
    this.container.appendChild(this.renderer.domElement)
    this.container.style.touchAction = 'none'
    this.container.addEventListener('pointerdown', this.onPointerDown)
    this.createControls()
    this.render() // 渲染
    window.onresize = this.onWindowResize
  },

  methods: {
    // 获取数据库查询结果
    getReData () {
      // 生成测试数据
      // 生成测试数据
      for (let index = 0; index <= 51; index++) {
        this.reData[index] = {
          'weekNum': index + 1,
          'hours': Math.round(Math.random() * 30)
        }
      }
      // TODO ajax
    },

    // 创建柱状山体
    createTerrain (data) {
      // 生成地形顶点高度数据
      // 创建一个平面地形，行列两个方向顶点数据分别为width，height
      let w = this.cell.sideLength * this.cell.maxX
      let h = this.cell.sideLength * this.cell.maxY
      let depth = this.funZ(w, h, data)
      var geometry = new THREE.PlaneBufferGeometry(w, h, w - 1, h - 1)
      // 访问几何体的顶点位置坐标数据
      var vertices = geometry.attributes.position.array
      // 改变顶点高度值
      for (var i = 0, j = 1, l = vertices.length; i < l; i++, j += 3) {
        vertices[j + 1] = depth[i] * 0.8
      }
      // 不执行computeVertexNormals，没有顶点法向量数据
      geometry.computeVertexNormals()
      var material = new THREE.MeshBasicMaterial({
        color: this.colors.A.M,
        wireframe: true
      })
      var mesh = new THREE.Mesh(geometry, material)
      mesh.name = 'terrain'
      // mesh.lookAt(0, 1, 0)
      this.setCenter(mesh)
      this.rootGroup.add(mesh)
    },

    loadBase (url, scale) {
      new OBJLoader().load(url, (obj) => {
        obj.scale.set(scale, scale, scale)
        obj.children[0].material = new THREE.MeshBasicMaterial(
          {
            color: this.colors.A.M,
            wireframe: true
          }
        )
        obj.name = 'base'
        this.setCenter(obj)
        this.rootGroup.add(obj)
        // 根据base和columns的size调整columns的z轴位置
        const objSize = this.getSize(obj)
        const columns = this.rootGroup.getObjectByName('terrain')
        const columnsSize = this.getSize(columns)
        columns.translateZ((objSize.z + columnsSize.z) / 2)
        this.rootGroup.lookAt(0, 1, 0)
      })
    },

    createLight () {
    },

    // 创建相机
    createCamera () {
      const k = this.width / this.height // 窗口宽高比
      this.camera = new THREE.PerspectiveCamera(30, k, 1, 2500)
      this.camera.position.set(0, 300, 700)
      this.camera.lookAt(this.rootGroup.position) // 没有controls的情况必须设置，血的教训
      this.scene.add(this.camera)
    },

    render () {
      requestAnimationFrame(this.render)
      this.rootGroup.rotation.z += (this.targetRotation - this.rootGroup.rotation.z) * 0.05
      this.renderer.clear()
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
    },
    // 获取物体位置和尺寸
    setCenter (obj) {
      const center = new THREE.Vector3()
      new THREE.Box3().expandByObject(obj).getCenter(center)
      obj.position.set(-center.x, -center.y, -center.z)
    },
    getSize (obj) {
      const size = new THREE.Vector3()
      new THREE.Box3().expandByObject(obj).getSize(size)
      return size
    },

    // 控制旋转（鼠标按下、移动、抬起）
    onPointerDown (event) {
      if (event.isPrimary === false) return
      this.pointerXOnPointerDown = event.clientX - this.width / 2
      this.targetRotationOnPointerDown = this.targetRotation
      document.addEventListener('pointermove', this.onPointerMove)
      document.addEventListener('pointerup', this.onPointerUp)
    },

    onPointerMove (event) {
      if (event.isPrimary === false) return
      this.pointerX = event.clientX - this.width / 2
      this.targetRotation = this.targetRotationOnPointerDown + (this.pointerX - this.pointerXOnPointerDown) * 0.02
    },

    onPointerUp (event) {
      if (event.isPrimary === false) return
      document.removeEventListener('pointermove', this.onPointerMove)
      document.removeEventListener('pointerup', this.onPointerUp)
    },

    funZ (width, height, depthData) {
      const size = width * height
      let data = new Uint8Array(size)
      let perlin = new ImprovedNoise()
      let quality = 1
      // const z = Math.random() * 100
      // console.log(z)
      for (let j = 0; j < 4; j++) {
        for (let i = 0; i < size; i++) {
          let y = i % width
          let x = ~~(i / width)
          // let index = Math.floor(i / this.cell.sideLength)
          // console.log(index)
          // let z = depthData[index]
          // console.log(z)
          // let kx = Math.floor(x / 15)
          // let ky = Math.floor(y / 15)
          let z = 0
          if (y > 75) {
            // z = 50
            // console.log(y)
          }
          data[i] += Math.abs(perlin.noise(x / quality, y / quality, z / quality) * quality * 1.75)
        }
        // console.log(data)
        quality *= 5
      }
      return data
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
