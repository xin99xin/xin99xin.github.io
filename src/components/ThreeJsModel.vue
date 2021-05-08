<template>
  <div>
    <div id="container"></div>
  </div>
</template>

<script>
/* eslint-disable */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export default {
  data() {
    return {
      textProperties: {
        size: 70,
        height: 20,
        bevelThickness: 2,
        bevelSize: 1.5,
        // bevelSegments: 1,
        curveSegments: 4,
        bevelEnabled: true,
      },
      mesh: null,
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
      text: "微澜图书馆",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.createScene(); // 创建场景
      this.createMesh(); // 创建网格模型
      this.createLight(); // 创建光源
      this.createCamera(); // 创建相机
      this.createRender(); // 创建渲染器
      this.createControls(); // 创建控件对象
      this.render(); // 渲染
    },
    // 创建场景
    createScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color( 0x0000ff );
      this.scene.fog = new THREE.Fog( 0x000000, 250, 1400 );
    },
    // 创建网格模型
    createMesh() {
      const textLoader = new THREE.FontLoader();
      const url = "static/zcoolqingkehuangyouti_Regular.json";
      // const url = "/static/YaHei_Regular.js";
      // 导入字体
      textLoader.load(url, (font) => {
        const options = {
          size: this.textProperties.size,
          height: this.textProperties.height,
          font: font,
          bevelThickness: this.textProperties.bevelThickness,
          bevelSize: this.textProperties.bevelSize,
          // bevelSegments: this.textProperties.bevelSegments,
          bevelEnabled: this.textProperties.bevelEnabled,
          curveSegments: this.textProperties.curveSegments,
        };
        // 创建文本几何体
        const textGeo = new THREE.TextGeometry(this.text, options).center();
        // 创建材质
        const meshMaterial = new THREE.MeshStandardMaterial({
          color: 0xffff00,
        });
        const xMid = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
        // textGeo.translate( xMid, 0, 0 );
        // 创建文字网格对象
        this.mesh = new THREE.Mesh(textGeo, meshMaterial);
        // this.mesh.position.set(0, 0, 0);
        this.mesh.rotation.y = 0.5;
        this.mesh.rotation.z = 0.0;
        // 网格对象添加到场景中
        this.scene.add(this.mesh);
      });
    },

    // 创建光源
    createLight() {
      const dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
      dirLight.position.set( 0, 0, 1 ).normalize();
      this.scene.add( dirLight );

      const pointLight = new THREE.PointLight( 0xffffff, 1.5 );
      pointLight.position.set( 0, 100, 90 );
      this.scene.add( pointLight );
    },
    // 创建相机
    createCamera() {
      const element = document.getElementById("container");
      const width = element.clientWidth; // 窗口宽度
      const height = element.clientHeight; // 窗口高度
      const k = width / height; // 窗口宽高比
      this.camera = new THREE.PerspectiveCamera( 30, k, 1, 1500 );
      this.camera.position.set( 0, 400, 700 );
      this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 设置相机方向
      this.scene.add(this.camera);
    },
    // 创建渲染器
    createRender() {
      const element = document.getElementById("container");
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      this.renderer.setSize(element.clientWidth, element.clientHeight); // 设置渲染区域尺寸
      this.renderer.shadowMap.enabled = true; // 显示阴影
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setClearColor(0x0000ff, 1); // 设置背景颜色
      element.appendChild(this.renderer.domElement);
    },

    render() {
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.render);
    },

    // 创建控件对象
    createControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },

  },
};
</script>
<style>
#container {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
