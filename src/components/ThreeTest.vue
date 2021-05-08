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
      properties: {
        size: {
          name: "size",
          value: 20,
          min: 0,
          max: 100,
          step: 1,
        },
        height: {
          name: "height",
          value: 20,
          min: 0,
          max: 100,
          step: 1,
        },
        bevelThickness: {
          name: "bevelThickness",
          value: 2,
          min: 0,
          max: 10,
          step: 0.1,
        },
        bevelSize: {
          name: "bevelSize",
          value: 0.5,
          min: 0,
          max: 10,
          step: 0.1,
        },
        bevelSegments: {
          name: "bevelSegments",
          value: 3,
          min: 0,
          max: 30,
          step: 1,
        },
        curveSegments: {
          name: "curveSegments",
          value: 12,
          min: 1,
          max: 30,
          step: 1,
        },
        bevelEnabled: false,
      },
      mesh: null,
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    formatTooltip(val) {
      return val;
    },
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
    },
    // 创建网格模型
    createMesh() {
      const textLoader = new THREE.FontLoader();
      const url = "/zcoolqingkehuangyouti_Regular.json";
      // 导入字体
      textLoader.load(url, (font) => {
        const options = {
          size: this.properties.size.value,
          height: this.properties.height.value,
          font: font,
          bevelThickness: this.properties.bevelThickness.value,
          bevelSize: this.properties.bevelSize.value,
          bevelSegments: this.properties.bevelSegments.value,
          bevelEnabled: this.properties.bevelEnabled,
          curveSegments: this.properties.curveSegments.value,
        };
        // 创建文本几何体
        const textGeo = new THREE.TextGeometry("中文文本测试", options);
        // 创建材质
        const meshMaterial = new THREE.MeshStandardMaterial({
          color: 0xeeffff,
        });
        // 创建文字网格对象
        this.mesh = new THREE.Mesh(textGeo, meshMaterial);
        this.mesh.position.set(40, -30, -60);
        this.mesh.rotation.y = -1.1;
        // 网格对象添加到场景中
        this.scene.add(this.mesh);
      });
    },

    // 创建光源
    createLight() {
      // 环境光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // 创建环境光
      this.scene.add(ambientLight); // 将环境光添加到场景

      const spotLight = new THREE.SpotLight(0xffffff); // 创建聚光灯
      spotLight.position.set(-40, 60, -10);
      spotLight.castShadow = true;
      this.scene.add(spotLight);
    },
    // 创建相机
    createCamera() {
      const element = document.getElementById("container");
      const width = element.clientWidth; // 窗口宽度
      const height = element.clientHeight; // 窗口高度
      const k = width / height; // 窗口宽高比
      // PerspectiveCamera( fov, aspect, near, far )
      this.camera = new THREE.PerspectiveCamera(35, k, 0.1, 1000);
      this.camera.position.set(-80, 60, 40); // 设置相机位置

      this.camera.lookAt(new THREE.Vector3(10, 0, 0)); // 设置相机方向
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
      this.renderer.setClearColor(0x3f3f3f, 1); // 设置背景颜色
      element.appendChild(this.renderer.domElement);
    },

    // 重新绘制
    redraw() {
      this.scene.remove(this.mesh);
      this.createMesh();
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
.controls-box {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 300px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #c3c3c3;
}
.vertice-span {
  line-height: 38px;
  padding: 0 2px 0 10px;
}
</style>