<template>
  <div>
    <div id="container"/>
    <Hello class="hello"/>
    <Form class="form"/>
  </div>
</template>

<script>
import * as THREE from 'three'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import Hello from './Hello'
import Form from './Form'

export default {
  components: {Hello, Form},
  name: 'ShowModel',
  data () {
    return {
      // 用户信息
      userInfo: {
        id: 0,
        name: '@ ' + 'zodiac',
        year: 2021,
        gender: ''
      },

      // 模型相关
      model: {
        fontZhUrl: {
          yaHei: '/static/YaHei_Regular.js',
          qingKeHuangYou: 'static/zcoolqingkehuangyouti_Regular.json'
        },
        base: { // 底座
          objUrl: 'static/shapr3d_export_2021-05-09_12h29m.obj',
          baseSideAngleY: 21.801 // 底座侧边与y轴的夹角
        },
        userName: {
          size: 5,
          height: 1.8,
          bevelThickness: 0.18,
          bevelSize: 0.14,
          curveSegments: 0.35,
          bevelEnabled: true,
          font: null
        },
        logo: {
          size: 5,
          height: 1.8,
          bevelThickness: 0.18,
          bevelSize: 0.14,
          curveSegments: 0.35,
          bevelEnabled: true,
          text: '微澜图书馆',
          font: null
        },
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
        cell: { // 柱状体
          maxColumn: 11,
          maxRow: 5,
          sideLength: 15,
          padding: 1
        }
      },

      reData: [],
      rootGroup: null,
      camera: null,
      scene: null,
      renderer: null,
      STLFileDownloadPath: '',

      // 页面属性及鼠标事件相关配置
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
    this.rootGroup = new THREE.Group()
    this.container = document.getElementById('container')
    this.width = this.container.clientWidth
    this.height = this.container.clientHeight
    this.scene = new THREE.Scene().add(this.rootGroup)

    this.getReData()
    this.createModels()
    this.createCamera()
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(this.width, this.height)
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
      const start = new Date()
      // 生成测试数据
      for (let index = 0; index <= 51; index++) {
        this.reData[index] = {'weekNum': index + 1, 'hours': Math.round(Math.random() * 30)}
      }
      console.log('data loaded by:' + (new Date() - start) + 'ms')
      // TODO ajax
    },

    // 装配场景中所需的所有模型到rootGroup节点，调整相对位置和角度
    createModels () {
      const material = new THREE.MeshBasicMaterial({
        color: this.model.colors.A.M,
        wireframe: true}
      )
      this.loadModel(this.rootGroup, this.model.base.objUrl, material, 1000, 'base')
      this.createCells(this.rootGroup, this.reData, material, 'cells')

      // 创建用户名模型
      const userNameTextOptions = this.model.userName
      userNameTextOptions.fontUrl = this.model.fontZhUrl.qingKeHuangYou
      this.createText(this.rootGroup, this.userInfo.name + '(' + this.userInfo.year + ')', userNameTextOptions, material, 'userName')

      // 创建logo
      const logoTextOptions = this.model.logo
      logoTextOptions.fontUrl = this.model.fontZhUrl.qingKeHuangYou
      this.createText(this.rootGroup, logoTextOptions.text, logoTextOptions, material, 'logo')
    },

    assemblyModels () {
      // 根据base斜边角度调整文字位置和角度
      const logo = this.rootGroup.getObjectByName('logo')
      const userName = this.rootGroup.getObjectByName('userName')
      const textRotate = this.angle2Radians(90 - this.model.base.baseSideAngleY)
      logo.rotateX(textRotate)
      userName.rotateX(textRotate)
      logo.translateX(50)
      userName.translateX(-50)
      logo.translateZ(43)
      userName.translateZ(43)
      logo.translateY(-20)
      userName.translateY(-20)
      // 根据base和cells的size调整cells的z轴位置
      const base = this.rootGroup.getObjectByName('base')
      const cells = this.rootGroup.getObjectByName('cells')
      const baseSize = this.getSize(base)
      const cellsSize = this.getSize(cells)
      cells.translateZ((baseSize.z + cellsSize.z) / 2)
      // 修改模型整体朝向
      this.rootGroup.lookAt(0, 1, 0)
    },

    checkGroupChildren () {
      let rootChildren = this.rootGroup.children
      console.log('rootGroup\'s children num is ' + rootChildren.length)
      if (rootChildren.length === 4) {
        this.assemblyModels()
      }
    },

    // 用指定的材质载入Obj格式的外部模型到group节点的坐标原点，可指定等比例放缩的倍数
    loadModel (group, objUrl, material, scale, name) {
      const start = new Date()
      new OBJLoader().load(objUrl, (obj) => {
        if (scale != null) {
          obj.scale.set(scale, scale, scale)
        }
        obj.children[0].material = material
        if (name != null) obj.name = name
        this.setCenter(obj)
        group.add(obj)
        console.log(name + ' loaded by:' + (new Date() - start) + 'ms')
        this.checkGroupChildren()
      })
    },

    // 用指定的材质根据data创建一组柱状体到group节点的坐标原点
    createCells (group, data, material, name) {
      const start = new Date()
      const boxSize = this.model.cell.sideLength - this.model.cell.padding * 2
      const geometry = new THREE.BoxGeometry(boxSize, boxSize, 1)
      const cellGroup = new THREE.Group()
      for (const row of data) {
        const mesh = new THREE.Mesh(geometry, material)
        mesh.scale.set(1, 1, row.hours * 1.4)// 加高一些
        // 根据weekNum计算当前的单元格坐标
        let y = (row.weekNum - 1) % this.model.cell.maxRow
        let x = ~~((row.weekNum - 1) / this.model.cell.maxRow)
        const pX = x * this.model.cell.sideLength + this.model.cell.padding
        const pY = y * this.model.cell.sideLength + this.model.cell.padding
        // 由于高度有拉伸，需要调整z轴坐标
        mesh.position.set(pX, pY, row.hours * 0.7)
        mesh.name = row.weekNum + ':' + row.hours
        cellGroup.add(mesh)
      }
      if (name != null) cellGroup.name = 'cells'
      this.setCenter(cellGroup)
      group.add(cellGroup)
      console.log(name + ' created by:' + (new Date() - start) + 'ms')
    },

    // 用文字形状属性和材质创建汉字模型到group节点的坐标原点
    createText (group, text, options, material, name) {
      const start = new Date()
      const fontUrl = options.fontUrl
      new THREE.FontLoader().load(fontUrl, (font) => {
        options.font = font
        const textGeo = new THREE.TextGeometry(text, options).center()
        const mesh = new THREE.Mesh(textGeo, material)
        if (name != null) mesh.name = name
        group.add(mesh)
        console.log(name + ' created by:' + (new Date() - start) + 'ms')
        this.checkGroupChildren()
      })
    },

    createLight () {
    },

    // 创建相机
    createCamera () {
      const k = this.width / this.height // 窗口宽高比
      this.camera = new THREE.PerspectiveCamera(30, k, 1, 2500)
      this.camera.position.set(0, 0, 700)
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

    // 将目标中心点调整到坐标原点
    setCenter (obj) {
      const center = new THREE.Vector3()
      new THREE.Box3().expandByObject(obj).getCenter(center)
      obj.position.set(-center.x, -center.y, -center.z)
    },

    // 获取目标x,y,z三个方向的尺寸
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

    angle2Radians (angle) {
      return angle * Math.PI / 180
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
