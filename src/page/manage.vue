<template>
    <div style="width: 100%;height: 100%;background:#333">
        <div id="info" style='display:none'>
        </div>
        <div id="loading" style='display:flex'>
            <div class="spinner-text">
                加载PoseNet模型...
            </div>
            <div class="sk-spinner sk-spinner-pulse"></div>
        </div>
        <div id='main' v-show="pageShow">
            <video id="video" playsinline
                   style="display: none;" :style="facingMode=='environment'?'':{  'transform': 'scaleX('+-1+')',
                   '-ms-transform': 'translateX('+-1+')',
                  '-moz-transform':'scaleX('+-1+')',
                  '-o-transform': 'scaleX('+-1+')',
                  '-webkit-transform': 'scaleX('+-1+')'}">
            </video>
            <div style="position: relative">
                <canvas id="output">

                </canvas>
                <canvas id="hand" style="position: absolute;left: 0;top: 0;" :width="videoWidth"
                        :height="videoHeight"></canvas>
                <canvas id="stage" style="position: absolute;left: 0;top: 0;" :width="videoWidth"
                        :height="videoHeight"></canvas>
                <canvas id="score" width="80" height="80" style="position: absolute;left: 0;top: 0"
                        v-show="num==0"></canvas>
            </div>
            <yd-button @click.native="resetStart" size="large" type="hollow" v-if="num==0">结 束</yd-button>
            <div class="videoConfig" v-else>
                <yd-button size="large" @click.native="setConfigDia" bgcolor="aqua">参数设置</yd-button>

            </div>
            <yd-popup v-model="configPop" position="center" width="90%">
                <div style="background-color:#fff;" class="configBody">
                    <div class="configItem">
                        <span class="itemLable">摄像头: </span>
                        <yd-radio-group v-model="facingMode">

                            <yd-radio v-for="item in facingModeOpt" :key="item.value"
                                      :val="item.value">{{item.name}}
                            </yd-radio>
                        </yd-radio-group>
                    </div>
                    <div class="configItem">
                        <span class="itemLable">outputStride: </span>
                        <yd-radio-group v-model="state.options.outputStride">

                            <yd-radio v-for="item in state.options.outputStrideOpt" :key="item"
                                      :val="item"></yd-radio>
                        </yd-radio-group>
                    </div>
                    <div class="configItem">
                        <span class="itemLable">inputResolution: </span>
                        <yd-radio-group v-model="state.options.inputResolution">
                            <yd-radio v-for="item in state.options.inputResolutionOpt" :key="item"
                                      :val="item"></yd-radio>
                        </yd-radio-group>
                    </div>
                    <div class="configItem">
                        <span class="itemLable">multiplier: </span>
                        <yd-radio-group v-model="state.options.multiplier">
                            <yd-radio v-for="item in state.options.multiplierOpt" :key="item"
                                      :val="item"></yd-radio>
                        </yd-radio-group>
                    </div>
                    <div class="configItem">
                        <span class="itemLable">quantBytes: </span>
                        <yd-radio-group v-model="state.options.quantBytes">
                            <yd-radio v-for="item in state.options.quantBytesOpt" :key="item"
                                      :val="item"></yd-radio>
                        </yd-radio-group>
                    </div>
                    <p style="text-align: center;">
                        <yd-button @click.native="changeConfig">确定</yd-button>
                    </p>

                </div>
            </yd-popup>
        </div>
    </div>
</template>

<script>
    import * as posenet from '@tensorflow-models/posenet';
    // import * as handTrack from 'handtrackjs';local_MODEL_URL

    // const tf = require('@tensorflow/tfjs');
    import {loadGraphModel} from '@tensorflow/tfjs-converter';
    // import '@tensorflow/tfjs'
    import * as cocoSsd from '@tensorflow-models/coco-ssd';
    const local_MODEL_URL = '../../static/tf-js-/model.json'
    const MODEL_URL = 'https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json';

    import {
        drawSkeleton,
        isMobile,
        toggleLoadingUI,
        drawTouchImage,
        randomNum,
        drawStartText,
        radiusRect,
        drawBoundingBox,
        drawBallBoxes
    } from '../util/posenet_util';

    const modelParams = {
        flipHorizontal: true,   // flip e.g for video
        maxNumBoxes: 20,        // maximum number of boxes to detect
        iouThreshold: 0.5,      // ioU threshold for non-max suppression
        scoreThreshold: 0.6,    // confidence threshold for predictions.
    }
    const videoWidth = document.body.clientWidth
    const videoHeight = document.body.clientHeight - 50
    const defaultQuantBytes = 2;
    const defaultMobileNetMultiplier = 0.75;
    const defaultMobileNetStride = 16;
    const defaultMobileNetInputResolution = 200;

    const touchPoint = {
        x: '',
        y: '',
        r: videoWidth / 5,
        interval: 3000
    }
    const startBtn = {
        x: videoWidth - (videoWidth / 10 + 120),
        y: 40,
        w: 120,
        h: 60,
        radius: 10,
        text: '开 始',
        color: 'aqua'
    }

    export default {
        data() {
            return {
                ctx: Object,
                videoWidth: videoWidth,
                videoHeight: videoHeight,
                touchImg: require('../assets/篮球.png'),
                score: 0,
                gameStart: false,
                num: 3,
                configPop: false,
                facingMode: 'user',
                handPoint: [],
                facingModeOpt: [
                    {
                        name: '前置',
                        value: 'user'
                    },
                    {
                        name: '后置',
                        value: 'environment'
                    }
                ],
                state: {
                    algorithm: 'multi-pose',

                    options: {
                        architecture: 'MobileNetV1',
                        outputStride: defaultMobileNetStride,
                        outputStrideOpt: [8, 16],
                        inputResolution: defaultMobileNetInputResolution,
                        inputResolutionOpt: [200, 400, 600, 800],
                        multiplier: defaultMobileNetMultiplier,
                        multiplierOpt: [0.5, 0.75, 1.01, 1.0],
                        quantBytes: defaultQuantBytes,
                        quantBytesOpt: [1, 2, 4],
                        showVideo: true,
                        showSkeleton: true,
                        showPoints: true,
                        showBoundingBox: false,
                    },
                    singlePoseDetection: {
                        minPoseConfidence: 0.1,
                        minPartConfidence: 0.5,
                    },
                    multiPoseDetection: {
                        maxPoseDetections: 5,
                        minPoseConfidence: 0.15,
                        minPartConfidence: 0.1,
                        nmsRadius: 30.0,
                    },
                    net: null,
                },
                pageShow: false
            }
        },
        async mounted() {
            let touchCtx = document.getElementById('stage').getContext('2d');
            this.ctx = document.getElementById('stage').getContext('2d');
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            // kick off the demo
            this.bindPage();

            let that = this


        },
        async created() {

        },

        watch: {
            num(v) {
                if (v <= 0) {
                    let that = this
                    this.gameInt = setInterval(function () {
                        that.setRandomTouch()
                    }, 3000)
                }
            }
        },
        methods: {
            async setupCamera() {
                let that = this
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error(
                        'Browser API navigator.mediaDevices.getUserMedia not available');
                }
                const video = document.getElementById('video');
                video.width = videoWidth;
                video.height = videoHeight;

                const mobile = isMobile();
                const stream = await navigator.mediaDevices.getUserMedia({
                    'audio': false,
                    'video': {
                        facingMode: that.facingMode,
                        width: mobile ? undefined : videoWidth,
                        height: mobile ? undefined : videoHeight,
                        // 'optional': [{
                        //     'sourceId':1 //0为前置摄像头，1为后置
                        // }]
                    },
                });
                video.srcObject = stream;

                return new Promise((resolve) => {
                    video.onloadedmetadata = () => {
                        resolve(video);
                    };
                });
            },
            async loadVideo() {
                const video = await this.setupCamera();
                video.play();
                return video;
            },
            setupGui(cameras, net) {
                this.state.net = net;
                if (cameras.length > 0) {
                    this.state.camera = cameras[0].deviceId;
                }
            },

            detectPoseInRealTime(video, net, model) {
                let that = this
                let state = this.state
                const canvas = document.getElementById('output');
                const ctx = canvas.getContext('2d');
                // since images are being fed from a webcam, we want to feed in the
                // original image and then just flip the keypoints' x coordinates. If instead
                // we flip the image, then correcting left-right keypoint pairs requires a
                // permutation on all the keypoints.
                const flipPoseHorizontal = true;
                const v = document.getElementById('video');

                canvas.width = v.width;
                canvas.height = v.height;

                async function poseDetectionFrame() {
                    if (state.changeToArchitecture) {
                        // Important to purge variables and free up GPU memory
                        state.net.dispose();
                        toggleLoadingUI(true);
                        state.net = await posenet.load({
                            architecture: state.changeToArchitecture,
                            outputStride: state.outputStride,
                            inputResolution: state.inputResolution,
                            multiplier: state.multiplier,
                        });
                        toggleLoadingUI(false);
                        state.architecture = state.changeToArchitecture;
                        state.changeToArchitecture = null;
                    }


                    // Begin monitoring code for frames per second
                    // stats.begin();

                    let poses = [];
                    let predictions=[]
                    let minPoseConfidence;
                    let minPartConfidence;

                    switch (state.algorithm) {
                        case 'single-pose':
                            const pose = await state.net.estimatePoses(video, {
                                flipHorizontal: flipPoseHorizontal,
                                decodingMethod: 'single-person'
                            });
                            poses = poses.concat(pose);
                            minPoseConfidence = +state.singlePoseDetection.minPoseConfidence;
                            minPartConfidence = +state.singlePoseDetection.minPartConfidence;
                            break;
                        case 'multi-pose':
                            let all_poses = await state.net.estimatePoses(video, {
                                flipHorizontal: flipPoseHorizontal,
                                decodingMethod: 'multi-person',
                                maxDetections: state.multiPoseDetection.maxPoseDetections,
                                scoreThreshold: state.multiPoseDetection.minPartConfidence,
                                nmsRadius: state.multiPoseDetection.nmsRadius
                            });

                            poses = poses.concat(all_poses);
                            minPoseConfidence = +state.multiPoseDetection.minPoseConfidence;
                            minPartConfidence = +state.multiPoseDetection.minPartConfidence;
                            break;
                    }

                    ctx.clearRect(0, 0, videoWidth, videoHeight);

                    if (state.options.showVideo) {
                        ctx.save();
                        ctx.scale(-1, 1);
                        ctx.translate(-videoWidth, 0);
                        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
                        ctx.restore();
                        // const tfImg = tf.browser.fromPixels(video);
                        // const smalImg = tf.image.resizeBilinear(tfImg, [300, 300]);
                        // const resized = tf.cast(smalImg, 'float32');
                        // const t4d = tf.tensor4d(Array.from(resized.dataSync()),[1,300,300,3])
                        // console.log(t4d)
                        // console.log(imageTensor)
                        // that.model.executeAsync(batched).then(res=>{
                        //     console.log(res)
                        // })
                        // that.runDetection(video)
                    }

                    // predictions = await model.detect(canvas);
                    // drawBallBoxes(predictions,ctx,'sports ball')

                    // For each pose (i.e. person) detected in an image, loop through the poses
                    // and draw the resulting skeleton and keypoints if over certain confidence
                    // scores
                    poses.forEach(({score, keypoints}) => {
                        // console.log(keypoints)
                        if (score >= minPoseConfidence) {
                            // if (state.options.showPoints) {
                            //     drawKeypoints(keypoints, minPartConfidence, ctx);
                            //
                            // }
                            if (state.options.showSkeleton) {
                                drawSkeleton(keypoints, minPartConfidence, ctx);
                            }
                            // console.log(keypoints)
                                // drawBoundingBox(keypoints, ctx);

                            if (that.gameStart) {
                                if (that.num <= 0) {

                                    that.touchPoint(keypoints)
                                }
                            } else {
                                that.handelStart(keypoints)
                            }


                        }
                    });
                    window.requestAnimationFrame(poseDetectionFrame);
                }

                poseDetectionFrame();
            },
            //开始
            handelStart(keypoints) {
                const touchCtx = document.getElementById('stage').getContext('2d');
                for (let i = 0; i < keypoints.length; i++) {
                    if (
                        (keypoints[i].position.x <= startBtn.x + startBtn.w && keypoints[i].position.x > startBtn.x)
                        &&
                        (keypoints[i].position.y <= startBtn.y + startBtn.h && keypoints[i].position.y > startBtn.y)
                        && keypoints[i].part.indexOf('Wrist') != -1
                    ) {
                        this.gameStart = true
                        this.startTimeInter()
                        break;

                    } else {

                    }
                }


            },

            //开始3s
            startTimeInter() {
                const touchCtx = document.getElementById('stage').getContext('2d');
                touchCtx.clearRect(0, 0, videoWidth, videoWidth)
                this.int = setInterval(this.clock, 1000)
            },
            clock() {
                let that = this
                console.log(this.num)
                const touchCtx = document.getElementById('stage').getContext('2d');
                touchCtx.clearRect(0, 0, videoWidth, videoWidth)
                drawStartText(touchCtx, this.num, videoWidth / 2, videoHeight / 2, 'RED', '80px bold 黑体')
                this.num > 0 ? this.num -= 1 : clearInterval(this.int);


            },

            //触球
            touchPoint(keypoints) {
                const touchCtx = document.getElementById('stage').getContext('2d');
                const scoreCtx = document.getElementById('score').getContext('2d');

                keypoints.forEach((v, i) => {
                    if (
                        (v.position.x <= touchPoint.x + touchPoint.r && v.position.x > touchPoint.x)
                        &&
                        (v.position.y <= touchPoint.y + touchPoint.r && v.position.y > touchPoint.y)
                        && v.part.indexOf('Wrist') != -1
                    ) {
                        touchCtx.clearRect(0, 0, videoWidth, videoHeight)
                        drawStartText(touchCtx, '+1', touchPoint.x + touchPoint.r / 2, touchPoint.y / 2 + touchPoint.r, '#3a8ee6', '60px bold 黑体')
                        touchPoint.x = ''
                        touchPoint.y = ''
                        this.score++
                        scoreCtx.clearRect(0, 0, 80, 80)
                        drawStartText(scoreCtx, this.score, 40, 40, '#3a8ee6', '60px bold 黑体')

                    }
                })
            },
            //结束
            resetStart() {
                let touchCtx = document.getElementById('stage').getContext('2d');
                const scoreCtx = document.getElementById('score').getContext('2d');
                scoreCtx.clearRect(0, 0, 80, 80)
                this.num = 3
                this.score = 0
                this.gameStart = false
                touchCtx.clearRect(0, 0, videoWidth, videoHeight)
                radiusRect(touchCtx, startBtn)
                clearInterval(this.gameInt)
            },

            setConfigDia() {
                this.configPop = true

            },

            //选项设置
            changeConfig() {
                this.configPop = false
                this.bindPage()
            },
            //页面绑定
            async bindPage() {
                this.pageShow = false
                let state = this.state
                const touchCtx = document.getElementById('stage').getContext('2d');

                toggleLoadingUI(true);
                const net = await posenet.load({
                    architecture: state.options.architecture,
                    outputStride: state.options.outputStride,
                    inputResolution: state.options.inputResolution,
                    multiplier: state.options.multiplier,
                    quantBytes: state.options.quantBytes
                });
                // const model = await cocoSsd.load();
                toggleLoadingUI(false);
                let video;
                try {
                    video = await this.loadVideo();
                } catch (e) {
                    let info = document.getElementById('info');
                    info.textContent = '此浏览器不支持视频录像,或设备没有摄像头';
                    info.style.display = 'block';
                    throw e;
                }
                this.pageShow = true
                // this.model = await loadGraphModel(local_MODEL_URL);
                // handTrack.load().then(model=>{
                //     console.log(model)
                // })
                // const result = await this.model.executeAsync(tf.zeros([1, 300, 300, 3]));
                // result.map(async (t) => await t.data());
                // result.map(async (t) => t.dispose());
                // this.model = await handTrack.load(modelParams)
                radiusRect(touchCtx, startBtn)
                this.setupGui([], net);
                this.detectPoseInRealTime(video, net);

            },
            runDetection() {
                this.handPoint = []
                const canvas = document.getElementById('hand');
                const context = canvas.getContext('2d')
                const video = document.getElementById("video");
                this.model.detect(video).then(predictions => {
                    // console.log(predictions)
                    predictions.forEach((v, i) => {
                        if (v.score < 0.8) {
                            predictions.splice(i, 1)
                        }
                    })
                    this.model.renderPredictions(predictions, canvas, context, video);
                    predictions.forEach((v, i) => {
                        this.handPoint.push({x: v.bbox[0] + v.bbox[2] / 2, y: v.bbox[1] + v.bbox[3] / 2})
                    })
                });
            },
            setRandomTouch() {
                this.ctx.clearRect(0, 0, videoWidth, videoWidth)
                touchPoint.x = randomNum(0, videoWidth - touchPoint.r)
                touchPoint.y = randomNum(0, videoWidth - touchPoint.r)
                drawTouchImage(this.ctx, touchPoint.x, touchPoint.y, touchPoint.r, this.touchImg)
            },
        },
    }
</script>

<style lang="less">

    * {
        margin: 0;
        padding: 0;
    }

    .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        color: black;
    }

    .footer-text {
        max-width: 600px;
        text-align: center;
        margin: auto;
    }

    #output {
        display: block;
    }

    @media only screen and (max-width: 600px) {

        .footer-text,
        .dg {
            display: none;
        }
    }

    /*
     *  The following loading spinner CSS is from SpinKit project
     *  https://github.com/tobiasahlin/SpinKit
     */
    .sk-spinner-pulse {
        width: 20px;
        height: 20px;
        margin: auto 10px;
        float: left;
        background-color: #333;
        border-radius: 100%;
        -webkit-animation: sk-pulseScaleOut 1s infinite ease-in-out;
        animation: sk-pulseScaleOut 1s infinite ease-in-out;
    }

    @-webkit-keyframes sk-pulseScaleOut {
        0% {
            -webkit-transform: scale(0);
            transform: scale(0);
        }

        100% {
            -webkit-transform: scale(1.0);
            transform: scale(1.0);
            opacity: 0;
        }
    }

    @keyframes sk-pulseScaleOut {
        0% {
            -webkit-transform: scale(0);
            transform: scale(0);
        }

        100% {
            -webkit-transform: scale(1.0);
            transform: scale(1.0);
            opacity: 0;
        }
    }

    .spinner-text {
        float: left;
    }

    .resetBtn {
        color: #fff;
        font-size: 18px;
        width: 100px;
        margin: 0 auto;
        padding: 5px 10px;
        border: 1px solid #fff;
        border-radius: 5px;
        text-align: center;
        margin-top: 5px;

    }

    .videoConfig {
        font-size: 18px;
    }

    .yd-btn-block {
        margin: 0 auto;
    }

    .configBody {
        color: #333;
        font-size: 14px;
        padding: 5px 10px;
        .configItem {
            .itemLable {
                margin-right: 10px;
                font-weight: bold;
                font-size: 14px;
                display: inline-block;
                word-break: break-all;
            }
            .yd-radio {
                margin: 5px 0;
            }
            padding: 5px 0;
        }

    }
</style>
