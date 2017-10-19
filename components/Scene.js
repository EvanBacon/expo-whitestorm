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
            antialias: true,

            shadowMap: {
                type: THREE.PCFSoftShadowMap
            }
        }
    },

    physics: {
        ammo: process.ammoPath
    }
};



// Render the game as a `View` component.
class Scene extends React.Component {
    state = {
    };

    componentDidMount() {
        // this.props.onFinishedLoading && this.props.onFinishedLoading();
    }

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
            ...appDefaults.rendering.renderer,

            canvas: {
                width: gl.drawingBufferWidth,
                height: gl.drawingBufferHeight,
                style: {},
                addEventListener: () => { },
                removeEventListener: () => { },
                clientHeight: gl.drawingBufferHeight,
            },
            context: gl,
        }

        const app = new WHS.App([
            new WHS.ElementModule(),
            new WHS.SceneModule(),
            new WHS.DefineModule('camera', new WHS.PerspectiveCamera(appDefaults.camera)),
            new WHS.RenderingModule(appDefaults.rendering, {
                shadow: true
            }),
            new PHYSICS.WorldModule(appDefaults.physics),
            new WHS.OrbitControlsModule(),
            new WHS.ResizeModule(),
            // new StatsModule()
        ]);


        new WHS.AmbientLight({
            light: {
                color: 0xffffff,
                intensity: 0.2
            }
        }).addTo(app);
        new WHS.DirectionalLight({
            light: {
                color: 0xffffff,
                intensity: 0.2
            },

            position: [10, 20, 10]
        }).addTo(app);

        new WHS.PointLight({
            light: {
                color: 0xff0000,
                intensity: 3,
                distance: 1000
            },

            position: [10, 20, 10],

            target: {
                x: 5
            }
        }).addTo(app);

        // const app = new WHS.App([
        //     new WHS.BasicAppPreset() // setup for :            
        // ]);


        const sphere = new WHS.Box({ // Create sphere component.
            geometry: {
                width: 6,
                height: 6,
                depth: 6
            },

            material: new THREE.MeshStandardMaterial({
                color: 0x4286f4,
                metalness: 0.0,
                roughness: 0.044676705160855
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

            material: new THREE.MeshBasicMaterial({
                color: 0x447F8B
            }),

            rotation: {
                x: - Math.PI / 2
            }
        }).addTo(app);

        // addBasicLights(app);


        app.start(); // Start animations and physics simulation.

        this.props.onFinishedLoading();
    }

    animate = (delta) => {
        if (this.sphere) {
            this.sphere.rotation.x += 0.1;
            this.sphere.rotation.y += 0.1;
        }
    }
}

const styles = StyleSheet.create({
    whitestorm: {
        flex: 1,
    },
    loadingContainer: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    loadingIndicator: {

    },
});

export function addBasicLights(app, intensity = 0.5, position = [0, 10, 10], distance = 100, shadowmap) {
    addAmbient(app, 1 - intensity);

    return new WHS.PointLight({
        intensity,
        distance,

        shadow: Object.assign({
            fov: 90
        }, shadowmap),

        position
    }).addTo(app);
}

export function addAmbient(app, intensity) {
    new WHS.AmbientLight({
        intensity
    }).addTo(app);
}

export default Touches(Scene);