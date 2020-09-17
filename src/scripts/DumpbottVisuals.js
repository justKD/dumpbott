import * as THREE from "three";

import { AsciiEffect } from "./visuals/AsciiEffect";
import { TrackballControls } from "./visuals/TrackballControls";
import { EffectComposer } from "./visuals/EffectComposer";
import { RenderPass } from "./visuals/RenderPass";
import { AfterimagePass } from "./visuals/AfterimagePass";
import { CopyShader } from "./visuals/CopyShader";
import { ClearPass } from "./visuals/ClearPass";
import { MaskPass, ClearMaskPass } from "./visuals/MaskPass";
import { ShaderPass } from "./visuals/ShaderPass";

export class DumpbottVisuals {
  constructor(glitchPass) {
    const __ = {
      start: Date.now(),
      asciiMod: 0.1,
      width: window.innerWidth,
      height: window.innerHeight,
      sides: 10,
      scale: 0.001
    };

    const _ = {
      camera: undefined,
      scenes: {
        head: undefined,
        flag: undefined
      },
      textures: {
        head: undefined,
        flag: undefined
      },
      meshes: {
        head: undefined,
        flag: undefined
      },
      passes: {
        glitchPass: glitchPass,
        afterimagePass: undefined,
        asciiEffect: undefined
      },
      composer: undefined,
      renderer: undefined,
      controls: undefined
    };

    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    const render = () => {
      const timer = Date.now() - __.start;

      if (_.meshes.head) {
        _.meshes.head.position.y = Math.sin(timer * __.scale) * __.sides;
        _.meshes.head.position.x = Math.sin(timer * __.scale) * __.sides;
        _.meshes.head.position.z = Math.sin(timer * __.scale) * __.sides;

        _.meshes.head.rotation.y = -1.5 + Math.sin(timer * 0.0006) * 0.2;
        _.meshes.head.rotation.z = Math.sin(timer * 0.0005) * 0.15;
      }

      if (_.composer) _.composer.render();
    };

    const init = {
      run: () => {
        init.camera();
        init.headscene();
        init.flagscene();
        init.renderer();

        //init.createAfterimagePass(0.75);
        //init.createAsciiEffectPass();

        init.getSize();
        init.composer();
        init.setSize();

        init.textures();
        //init.useCameraForTexture();

        init.flag();
        init.head();
        init.domAndControls();

        animate();
      },
      camera: () => {
        const camera = new THREE.PerspectiveCamera(70, __.width / __.height, 1);
        if (camera) {
          camera.position.y = 150;
          camera.position.z = 500;
        }
        _.camera = camera;
      },
      headscene: () => {
        const scene = new THREE.Scene();

        const light1 = new THREE.PointLight(0xffffff);
        light1.position.set(500, 500, 500);
        if (scene) scene.add(light1);

        const light2 = new THREE.PointLight(0xffffff, 0.25);
        light2.position.set(-500, -500, -500);
        if (scene) scene.add(light2);

        _.scenes.head = scene;
      },
      flagscene: () => {
        const scene = new THREE.Scene();

        const light1 = new THREE.PointLight(0xffffff);
        light1.position.set(500, 500, 500);
        if (scene) scene.add(light1);

        const light2 = new THREE.PointLight(0xffffff, 0.25);
        light2.position.set(-500, -500, -500);
        if (scene) scene.add(light2);

        _.scenes.flag = scene;
      },
      renderer: () => {
        console.log(THREE);
        const r = new THREE.WebGLRenderer();
        r.setPixelRatio(window.devicePixelRatio);
        r.autoClear = false;
        _.renderer = r;
      },
      composer: () => {
        const outputPass = new ShaderPass(CopyShader);
        const clearPass = new ClearPass();
        const clearMaskPass = new ClearMaskPass();
        const headMaskPass = new MaskPass(_.scenes.head, _.camera);
        const flagMaskPass = new MaskPass(_.scenes.flag, _.camera);
        const headPass = new RenderPass(_.scenes.head, _.camera);
        const flagPass = new RenderPass(_.scenes.flag, _.camera);

        var parameters = {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBFormat,
          stencilBuffer: true
        };

        var renderTarget = new THREE.WebGLRenderTarget(
          __.width,
          __.height,
          parameters
        );

        const composer = new EffectComposer(_.renderer, renderTarget);

        composer.addPass(clearPass);

        composer.addPass(flagPass);
        composer.addPass(flagMaskPass);
        composer.addPass(clearMaskPass);

        composer.addPass(headPass);
        composer.addPass(headMaskPass);
        composer.addPass(_.passes.glitchPass);
        composer.addPass(clearMaskPass);

        /*
        if (_.passes.asciiEffect) composer.addPass(_.passes.asciiEffect);
        if (_.passes.afterimagePass) composer.addPass(_.passes.afterimagePass);
        */

        composer.addPass(outputPass);
        _.composer = composer;
      },
      createAfterimagePass: value => {
        _.passes.afterimagePass = new AfterimagePass(value);
      },
      createAsciiEffectPass: () => {
        const chars = " .:-=+*#%$^&@";
        const asciiEffect = new AsciiEffect(_.renderer, chars, {
          invert: true,
          resolution: 0.15 + __.asciiMod
        });
        asciiEffect.domElement.style.color = "white";
        asciiEffect.domElement.style.backgroundColor = "black";
        _.passes.asciiEffect = asciiEffect;
      },
      getSize: () => {
        __.width = _.passes.asciiEffect
          ? window.innerWidth * (1 + __.asciiMod)
          : window.innerWidth;

        __.height = _.passes.asciiEffect
          ? window.innerHeight * (1 + __.asciiMod)
          : window.innerHeight;
      },
      setSize: () => {
        if (_.camera) {
          _.camera.aspect = __.width / __.height;
          _.camera.updateProjectionMatrix();
        }
        if (_.renderer) _.renderer.setSize(__.width, __.height);
        if (_.composer) _.composer.setSize(__.width, __.height);
        if (_.passes.asciiEffect) {
          _.passes.asciiEffect.setSize(__.width, __.height);
        }
      },
      textures: () => {
        const videohead = document.getElementById("video-head");
        if (videohead) {
          videohead.play();
          setTimeout(() => videohead.pause(), 100);
          _.textures.head = new THREE.VideoTexture(videohead);
        }

        const videoflag = document.getElementById("video-flag");
        if (videoflag) {
          videoflag.play();
          _.textures.flag = new THREE.VideoTexture(videoflag);
        }
      },
      useCameraForTexture: () => {
        const video = document.getElementById("video-head");
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const constraints = {
            video: { width: 1280, height: 720, facingMode: "user" }
          };

          navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function(stream) {
              video.srcObject = stream;
              video.play();
              _.textures.head = new THREE.VideoTexture(video);
            })
            .catch(function(error) {
              console.error("Unable to access the camera/webcam.", error);
            });
        } else {
          console.error("MediaDevices interface not available.");
        }
      },
      head: () => {
        const material = _.textures.head
          ? new THREE.MeshBasicMaterial({
              map: _.textures.head,
              flatShading: true
            })
          : new THREE.MeshPhongMaterial({
              flatShading: true
            });

        const geometry = new THREE.SphereBufferGeometry(250, 20, 20);

        const head = new THREE.Mesh(geometry, material);
        _.meshes.head = head;
        if (_.scenes.head) _.scenes.head.add(_.meshes.head);
      },
      flag: () => {
        const material = _.textures.flag
          ? new THREE.MeshBasicMaterial({
              map: _.textures.flag,
              overdraw: true,
              side: THREE.DoubleSide
            })
          : new THREE.MeshBasicMaterial({
              flatShading: true
            });

        let width = window.screen.width;
        let height = window.screen.height;
        if (width < height) width = height;

        const geometry = new THREE.PlaneGeometry(width, height, 4, 4);

        const flag = new THREE.Mesh(geometry, material);
        flag.rotateX(-0.25);

        _.meshes.flag = flag;
        if (_.scenes.flag) _.scenes.flag.add(_.meshes.flag);
      },
      domAndControls: () => {
        const el = _.passes.asciiEffect
          ? _.passes.asciiEffect.domElement
          : _.renderer.domElement;

        _.controls = new TrackballControls(_.camera, el);
        document.body.appendChild(el);

        const onWindowResize = () => {
          init.getSize();
          init.setSize();
        };
        window.addEventListener("resize", onWindowResize, false);
      }
    };

    this.start = () => init.run();
  }
}
