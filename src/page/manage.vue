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
        <div id='main'>
            <video id="video" playsinline style="-moz-transform:scaleX(-1);-o-transform: scaleX(-1);-webkit-transform: scaleX(-1);transform: scaleX(-1);display: none;
        ">
            </video>
           <div style="position: relative">
               <canvas id="output" >

               </canvas>
               <canvas id="stage"  style="position: absolute;left: 0;top: 0;" :width="videoWidth" :height="videoHeight" ></canvas>
               <canvas id="score"  width="80" height="80" style="position: absolute;left: 0;top: 0" v-show="num==0"></canvas>
           </div>
            <p class="resetBtn" @click="resetStart" v-if="num==0">停止</p>
        </div>

    </div>
</template>

<script>
    import * as posenet from '@tensorflow-models/posenet';

    import {
        drawBoundingBox,
        drawKeypoints,
        drawSkeleton,
        isMobile,
        toggleLoadingUI,
        drawTouchImage,
        randomNum,
        drawStartText,
        radiusRect
    } from '../util/posenet_util';

    const videoWidth = document.body.clientWidth>700?700: document.body.clientWidth
    const videoHeight = document.body.clientHeight>700?700-100: document.body.clientHeight-100
    const defaultQuantBytes = 2;
    const defaultMobileNetMultiplier = 0.75;
    const defaultMobileNetStride = 16;
    const defaultMobileNetInputResolution = {width:videoWidth,height:videoHeight};
    const state = {
        algorithm: 'multi-pose',
        options: {
            architecture: 'MobileNetV1',
            outputStride: defaultMobileNetStride,
            // inputResolution: defaultMobileNetInputResolution,
            multiplier: defaultMobileNetMultiplier,
            quantBytes: defaultQuantBytes,
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

    };

    const touchPoint={
        x:'',
        y:'',
        r:videoWidth/5,
        interval:3000
    }
    const startBtn={
        x:videoWidth-(videoWidth/10+120),
        y:40,
        w:120,
        h:60,
        radius:10,
        text:'开 始',
        color:'aqua'
    }

    export default {
        data() {
            return {
                ctx: Object,
                videoWidth : videoWidth,
                videoHeight:videoHeight,
                touchImg:require('../assets/篮球.png'),
                score:0,
                gameStart:false,
                num:3,

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
            num(v){
                if(v<=0){
                    let that = this
                    this.gameInt = setInterval(function () {
                        that.setRandomTouch()
                    },3000)
                }
            }
        },
        methods: {
            async  setupCamera() {
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
                        facingMode: 'environment',
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
                state.net = net;
                if (cameras.length > 0) {
                    state.camera = cameras[0].deviceId;
                }
            },

            detectPoseInRealTime(video, net) {
                let that = this
                const canvas = document.getElementById('output');
                const ctx = canvas.getContext('2d');

                // since images are being fed from a webcam, we want to feed in the
                // original image and then just flip the keypoints' x coordinates. If instead
                // we flip the image, then correcting left-right keypoint pairs requires a
                // permutation on all the keypoints.
                const flipPoseHorizontal = true;

                canvas.width = videoWidth;
                canvas.height = videoHeight;

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
                    }

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
                            // if (state.options.showSkeleton) {
                                drawSkeleton(keypoints, minPartConfidence, ctx);
                            // }
                            // if (state.options.showBoundingBox) {
                            //     drawBoundingBox(keypoints, ctx);
                            // }
                            if(that.gameStart){
                                if(that.num<=0){

                                    that.touchPoint(keypoints)
                                }
                            }else{
                                that.handelStart(keypoints)
                            }


                        }
                    });
                    window.requestAnimationFrame(poseDetectionFrame);
                }
                poseDetectionFrame();
            },
            //开始
            handelStart(keypoints){
                const touchCtx = document.getElementById('stage').getContext('2d');
                for (let i = 0; i <keypoints.length ; i++) {
                    if(
                        (keypoints[i].position.x<=startBtn.x+startBtn.w&&keypoints[i].position.x>startBtn.x)
                        &&
                        (keypoints[i].position.y<=startBtn.y+startBtn.h&&keypoints[i].position.y>startBtn.y)
                        && keypoints[i].part.indexOf('Wrist')!=-1
                    ){
                        this.gameStart = true
                        this.startTimeInter()
                        break;

                    }else{

                    }
                }


            },
            //开始3s
            startTimeInter(){
                const touchCtx = document.getElementById('stage').getContext('2d');

                touchCtx.clearRect(0,0,videoWidth,videoWidth)
                this.int = setInterval(this.clock,1000)
            },
            clock(){
                let that = this
                console.log(this.num)
                const touchCtx = document.getElementById('stage').getContext('2d');
                touchCtx.clearRect(0,0,videoWidth,videoWidth)
                drawStartText(touchCtx,this.num,videoWidth/2,videoWidth/2,'RED','80px bold 黑体')
                this.num>0 ? this.num-=1 : clearInterval(this.int);



            },

            //触球
            touchPoint(keypoints){
                const touchCtx = document.getElementById('stage').getContext('2d');
                const scoreCtx = document.getElementById('score').getContext('2d');

                keypoints.forEach((v,i)=>{
                    if(
                        (v.position.x<=touchPoint.x+touchPoint.r&&v.position.x>touchPoint.x)
                        &&
                        (v.position.y<=touchPoint.y+touchPoint.r&&v.position.y>touchPoint.y)
                        && v.part.indexOf('Wrist')!=-1
                    ){
                        touchCtx.clearRect(0, 0, videoWidth, videoHeight)
                        drawStartText(touchCtx,'+1',touchPoint.x+touchPoint.r/2,touchPoint.y/2+touchPoint.r,'#3a8ee6','60px bold 黑体')
                        touchPoint.x = ''
                        touchPoint.y = ''


                        this.score++
                        scoreCtx.clearRect(0,0,80,80)
                        drawStartText(scoreCtx,this.score,40,40,'#3a8ee6','60px bold 黑体')

                    }
                })
            },
            //结束
            resetStart(){
                let touchCtx = document.getElementById('stage').getContext('2d');
                const scoreCtx = document.getElementById('score').getContext('2d');
                scoreCtx.clearRect(0,0,80,80)
                this.num=3
                this.score=0
              this.gameStart=false
                touchCtx.clearRect(0, 0, videoWidth, videoHeight)
              radiusRect(touchCtx,startBtn)
              clearInterval(this.gameInt)
            },
            //页面绑定
            async  bindPage() {
                const touchCtx = document.getElementById('stage').getContext('2d');
                toggleLoadingUI(true);
                const net = await posenet.load({
                    architecture: state.options.architecture,
                    outputStride: state.options.outputStride,
                    inputResolution: state.options.inputResolution,
                    multiplier: state.options.multiplier,
                    quantBytes: state.options.quantBytes
                });
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
                radiusRect(touchCtx,startBtn)
                this.setupGui([], net);
                this.detectPoseInRealTime(video, net);

            },
            setRandomTouch(){
                this.ctx.clearRect(0,0,videoWidth,videoWidth)
                touchPoint.x = randomNum(0,videoWidth-touchPoint.r)
                touchPoint.y = randomNum(0,videoWidth-touchPoint.r)

                drawTouchImage(this.ctx,touchPoint.x , touchPoint.y,touchPoint.r,this.touchImg)
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
    #output{
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
    .resetBtn{
        color: #fff;
        font-size: 18px;
        width: 100px;
        margin: 0 auto;
        padding: 5px 10px;
        border: 1px solid #fff;
        border-radius: 5px;
        text-align: center;
        margin-top: 20px;

    }
</style>
