import Expo from 'expo';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    PanResponder,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import Files from '../Files';
import { ThreeView } from "./index"
import Touches from '../window/Touches';

import * as THREE from 'three';
import * as WHS from 'whs';
import * as PHYSICS from 'physics-module-ammonext'


export const appDefaults = {
    camera: {
        position: new THREE.Vector3(0, 10, 50),
        far: 200
    },
    rendering: {
        bgColor: 0x162129,
        pixelRatio: window.devicePixelRatio,
        renderer: {
        }
    },
    physics: {
        // ammo: ammonext
    }
};

class Scene extends React.Component {
    AR = false;

    shouldComponentUpdate = () => false;

    async componentDidMount() {
        const res = require('../ammo.txt');
        const asset = Expo.Asset.fromModule(res);
        await asset.downloadAsync();
        const ammoDownloadUri = asset.localUri;
        const rawAmmo = await Expo.FileSystem.readAsStringAsync(ammoDownloadUri);
        console.warn("loaded", ammoDownloadUri);
    }

    render() {
        return (
            <ThreeView
                style={{ flex: 1 }}
                onContextCreate={this.onContextCreateAsync}
                render={this.animate}
                enableAR={this.AR}
            />
        );
    }

    onContextCreateAsync = async (gl, arSession) => {

        const { innerWidth: width, innerHeight: height, devicePixelRatio: scale } = window;

        appDefaults.rendering.renderer = {
            antialias: true,
            shadowMap: {
                enabled: true,
                type: THREE.PCFShadowMap,
                // cascade: true
            },
            canvas: {
                width: gl.drawingBufferWidth,
                height: gl.drawingBufferHeight,
                style: {},
                addEventListener: () => { },
                removeEventListener: () => { },
                clientHeight: gl.drawingBufferHeight,
                clientWidth: gl.drawingBufferWidth,
            },
            context: gl,
        }

        const app = new WHS.App([
            new WHS.ElementModule(document),
            new WHS.SceneModule(),
            new WHS.DefineModule('camera', new WHS.PerspectiveCamera(appDefaults.camera)),
            new WHS.RenderingModule(appDefaults.rendering, {
                shadow: true
            }),
            new PHYSICS.WorldModule(appDefaults.physics),
            new WHS.OrbitControlsModule(),
            new WHS.VirtualMouseModule(),
            new WHS.ResizeModule(),
        ]);

        // HACK: Save this globally for touch parsing
        global.app = app;

        new WHS.DirectionalLight({
            color: 0xffffff,
            position: new THREE.Vector3(1, 1, 1)
        }).addTo(app);

        new WHS.DirectionalLight({
            color: 0x002288,
            position: new THREE.Vector3(-1, 1, -1)
        }).addTo(app);

        new WHS.AmbientLight({
            color: 0x222222
        }).addTo(app);

        const box = new WHS.Box({ // Create sphere component.
            geometry: {
                width: 6,
                height: 6,
                depth: 6
            },
            modules: [
                new PHYSICS.BoxModule({
                    mass: 10 // Mass of physics object.
                })
            ],
            mass: 0,

            physics: {
                restitution: 1,
            },
            material: new THREE.MeshPhongMaterial({
                color: 0x4286f4,
            }),
            position: [0, 10, 0]
        });

        box.addTo(app); // Add box to world.

        new WHS.Plane({
            geometry: {
                width: 100,
                height: 100
            },

            modules: [
                new PHYSICS.PlaneModule({
                    mass: 0
                })
            ],
            material: new THREE.MeshPhongMaterial({
                color: 0x447F8B,
            }),

            rotation: {
                x: - Math.PI / 2
            }
        }).addTo(app);

        app.start(); // Start animations and physics simulation.

        // Build a loop to rotate the box
        new WHS.Loop(() => {
            box.rotation.x += 0.1;
            box.rotation.y += 0.1;
        }).start(app);

        // Tell parent that we finished loading. This will hide the loading screen and show the scene.
        this.props.onFinishedLoading();
    }

    animate = (delta) => {

    }
}

export default Touches(Scene);