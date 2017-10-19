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

import * as THREE from 'three';
import * as WHS from 'whs';
import * as PHYSICS from 'physics-module-ammonext'
import { ThreeView } from "./index"
//// Game

import Touches from '../window/Touches';

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
        // gravity: new THREE.Vector3(0, -10, 0),      
        ammo: process.ammoPath
    }
};


// Render the game as a `View` component.
class Scene extends React.Component {
    state = {
    };
    AR = false;

    render() {
        return (
            <ThreeView
                style={{ flex: 1, backgroundColor: 'red' }}
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
            // new StatsModule()

        ]);
        global.app = app;
        app.get('renderer').domElement = document;
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

        console.warn("app", Object.keys(app));
        const sphere = new WHS.Box({ // Create sphere component.
            geometry: {
                width: 6,
                height: 6,
                depth: 6
            },
            modules: [
                new PHYSICS.SphereModule({
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

        sphere.addTo(app); // Add sphere to world.
        this.sphere = sphere;

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


        new WHS.Loop(() => {
            // sphere.rotation.x += 0.1;
            // sphere.rotation.y += 0.1;
        }).start(app);

        this.props.onFinishedLoading();

        // // Add Touch Listener
        // window.document.addEventListener('touchstart', (e) => {
        //     console.warn("start");
        //     // if (e.touches.length > 1) {
        //     //     index = (index + 1) % geoms.length;
        //     //     this.mesh.geometry = geoms[index];
        //     // }

        // });

    }

    animate = (delta) => {

    }
}

export default Touches(Scene);