<template>
    <div >
        <div id="info" style='display:none'>
        </div>
        <div id="loading" style='display:flex'>
            <div class="spinner-text">
                加载PoseNet模型...
            </div>
            <div class="sk-spinner sk-spinner-pulse"></div>
        </div>
        <div id='main' v-show="pageShow" :style="{width:videoWidth+'px',height:videoHeight+'px'}">
            <video id="video"  style="display: none"  playsinline>

            </video>
            <div style="position: relative;width: 100%;height: 100%"  @mousemove="canMove?mouseMoving($event):''" >
                <canvas id="output" :style="facingMode=='user'?'':{  'transform': 'scaleX(-1)',
                   '-ms-transform': 'translateX(-1)',
                  '-moz-transform':'scaleX(-1)',
                  '-o-transform': 'scaleX(-1)',
                  '-webkit-transform': 'scaleX(-1)'}">

                </canvas>
                <canvas id="stage" style="position: absolute;left: 0;top: 0;" :width="videoWidth"
                        :height="videoHeight"></canvas>
                <div v-if="isMobile" @touchmove="barMoving($event)" class="parallelBars" v-show="!gameResult" :style="{top:parallelBars.top+'px',weight:videoWidth+'px'}"></div>
                <div v-else @mousedown="mousedown" @mouseup="mouseup" class="parallelBars" v-show="!gameResult" :style="{top:parallelBars.top+'px',weight:videoWidth+'px'}"></div>
                <div class="readyStage" v-if="!gameStart ">
                    <div class="readyTips">移动黄线至双杠位置</div>
                    <div style="position:relative">
                        <div class="startBtn" @click="handleStart">开始</div>
                        <el-button type="plain" @click="changeFacingmoda" class="RotatCamera" icon="el-icon-refresh" circle></el-button>
                    </div>

                </div>
                <div class="startCountDown"  v-else-if="startCount>=0">
                    {{startCount<=0?'开始':startCount}}
                </div>
                <div class="gamingStage" v-else-if="!gameResult">
                    <div class="scoreBox">{{score}}</div>
                    <div class="timeBox">{{gameTime}}'</div>
                </div>
                <div class="result" v-if="gameResult">
                    <div class="resultModal">
                        <div class="resultScore" >{{score}}</div>
                        <div class="info">
                            次数
                        </div>
                        <div class="btnBox">
                            <div class="resetBtn over" @click="finishSport">结束运动</div>
                            <div class="resetBtn" @click="resetSport">再次运动</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import * as posenet from '@tensorflow-models/posenet';
    import {
        drawSkeleton,
        toggleLoadingUI,
        drawKeypoints,
        getIncludedAngle
    } from '../util/posenet_util';
    const videoWidth = document.body.clientWidth>document.body.clientHeight?document.body.clientHeight:document.body.clientWidth;
    const videoHeight = videoWidth;
    const windowWidth = document.body.clientWidth
    const windowHeight = document.body.clientHeight
    const defaultQuantBytes = 2;
    const defaultMobileNetMultiplier = 0.5;
    const defaultMobileNetStride = 16;
    const frontCamera=true;
    export default {
        data() {
            return {
                score:0,
                armStatus:0,
                armStatusArr:[],
                ctx: Object,
                isMobile:false,
                canMove:false,
                videoWidth: videoWidth,
                videoHeight: videoHeight,
                facingMode: 'user',
                startCount:3,
                gameTime:60,
                gameStart:false,
                gameResult:false,

                parallelBars:{
                    top:videoHeight*0.7
                },
                status:0,
                state: {
                    algorithm: 'multi-pose',
                    options: {
                        architecture: 'MobileNetV1',
                        outputStride: defaultMobileNetStride,
                        outputStrideOpt: [8, 16],
                        inputResolution: 500,
                        inputResolutionOpt: [200, 400, 500,600, 800],
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
                        maxPoseDetections: 1,
                        minPoseConfidence: 0.15,
                        minPartConfidence: 0.1,
                        nmsRadius: 30.0,
                    },
                    net: null,
                },
                pageShow: false
            }
        },
        created(){
            var sUserAgent = navigator.userAgent.toLowerCase();
            if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)) {
                this.isMobile = true
            } else {
                //跳转pc端页面
                this.isMobile = false

            }

        },
        async mounted() {
            this.ctx = document.getElementById('stage').getContext('2d');
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            // kick off the demo
            this.bindPage();

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
                const stream = await navigator.mediaDevices.getUserMedia({
                    'audio': false,
                    'video': {
                        facingMode: that.facingMode,
                        width:  videoWidth,
                        height:  videoHeight,

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
            changeFacingmoda(){

                if(this.facingMode == 'environment'){
                    this.facingMode = 'user'
                }else{
                    this.facingMode = 'environment'
                }
                this.bindPage()
            },
            //页面绑定
            async bindPage() {
                this.pageShow = false
                let state = this.state
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
                this.pageShow = true
                this.setupGui([], net);
                this.detectPoseInRealTime();

            },
            //执行
            detectPoseInRealTime() {
                let video = document.getElementById('video')
                let that = this
                let state = this.state
                const canvas = document.getElementById('output');
                const ctx = canvas.getContext('2d');
                const flipPoseHorizontal = true;
                canvas.width = video.width;
                canvas.height = video.height;
                async function poseDetectionFrame() {
                    let poses = [];
                    let minPoseConfidence;
                    let minPartConfidence;
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
                    ctx.clearRect(0, 0, videoWidth, videoHeight);

                    if (state.options.showVideo) {
                        ctx.save();
                        ctx.scale(-1, 1);
                        ctx.translate(-videoWidth, 0);
                        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
                        ctx.restore();
                    }
                    poses.forEach(({score, keypoints}) => {
                        // console.log(keypoints)
                        if (score >= minPoseConfidence) {
                                // drawKeypoints(keypoints, minPartConfidence, ctx);
                            if (state.options.showSkeleton) {
                                drawSkeleton(keypoints, minPartConfidence, ctx);
                            }
                            if(that.gameStart&&that.startCount<0&&!that.gameResult){
                                that.testingArmStatus(keypoints)
                            }

                            }
                    });
                    window.requestAnimationFrame(poseDetectionFrame);
                }
                poseDetectionFrame();
            },

            mousedown(){
              this.canMove = true
            },
            mouseup(){
                this.canMove = false
            },
            //鼠标移动
            mouseMoving(e){
                if(e.pageY<0){
                    this.parallelBars.top = 0
                }else if(e.pageY>videoHeight-20){
                    this.parallelBars.top = videoHeight-20
                }else{
                    this.parallelBars.top = e.pageY
                }
            },
            //移动bar
            barMoving(e){
                let offsetY = e.touches[0].pageY
                if(offsetY<0){
                    this.parallelBars.top = 0
                }else if(offsetY>videoHeight-20){
                    this.parallelBars.top = videoHeight-20
                }else{
                    this.parallelBars.top = offsetY
                }
            },

            //监测手臂状态
            testingArmStatus(keypoints){
                let armLeft = {
                    endPoint1 : keypoints[5].position,
                    intersection : keypoints[7].position,
                    endPoint2 : keypoints[9].position
                }
                let armRight = {
                    endPoint1 : keypoints[6].position,
                    intersection : keypoints[8].position,
                    endPoint2 : keypoints[10].position
                }

                let angle_left =  getIncludedAngle(armLeft.endPoint1.x,armLeft.endPoint1.y,armLeft.endPoint2.x,armLeft.endPoint2.y,armLeft.intersection.x,armLeft.intersection.y)
                let angle_right = getIncludedAngle(armRight.endPoint1.x,armRight.endPoint1.y,armRight.endPoint2.x,armRight.endPoint2.y,armRight.intersection.x,armRight.intersection.y)
                this.saveArmStatus({left:angle_left,right:angle_right})
               let lastFrame = this.armStatusArr.slice(-2)
                let barsY = this.parallelBars.top+10
                //取两帧用于防止关节点防抖动 && 双手在双杠上
                if(armLeft.intersection.y<barsY && armLeft.endPoint2.y<barsY && armRight.intersection.y<barsY && armRight.endPoint2.y<barsY ){
                    if(lastFrame.length>1&&((Math.abs(lastFrame[0].left-lastFrame[1].left)<10)||(lastFrame.length>1&&Math.abs(lastFrame[0].right-lastFrame[1].right)<10)) ){
                        //判断左手且右手都处于伸直状态
                        if((lastFrame[0].left>140&&lastFrame[0].left<=180) && (lastFrame[0].right<220&&lastFrame[0].right>=180)){
                            this.status = 1
                            //判断左手或右手弯曲 计数+1
                        }else if(this.status==1&&((lastFrame[0].left<110)||(lastFrame[0].right>250))){
                            this.status = 0
                            this.score+=1
                        }
                    }
                }else{
                    this.status = 0
                }



            },
            //存5帧手臂角度
            saveArmStatus(angle){
                if (this.armStatusArr.length < 10) { ///存10帧
                    this.armStatusArr.push(angle)
                } else {
                    this.armStatusArr.splice(0, 5)
                }
            },
            //开始计数
            handleStart(){
                this.gameStart = true
                this.startCountDown()

            },
            //开始倒计时
            startCountDown(){
                let that = this
                this.startCunDownTimer = setInterval(function () {
                    that.startCount-=1
                    console.log(that.startCount)
                    if(that.startCount<0){
                        clearInterval(that.startCunDownTimer)
                        that.gameCountDown()
                    }
                },1000)
            },
            //游戏倒计时
            gameCountDown(){
                let that = this
                this.gameCountDownTimer = setInterval(function () {
                    that.gameTime-=1
                    if(that.gameTime<=0){
                        clearInterval(that.gameCountDownTimer)
                        that.gameResult = true

                    }
                },1000)
            },
            //初始化
            initGame(){
                this.gameStart = false
                this.gameResult = false
                this.gameTime = 60
                this.startCount = 3
                this.score = 0
            },
            //结束运动
            finishSport(){
                this.initGame()
            },
            //再次运动
            resetSport(){
                this.initGame()
                this.handleStart()
            }
        },
    }
</script>

<style lang="less">

    * {
        margin: 0;
        padding: 0;
    }
    #output {
        display: block;
        margin: 0 auto;
    }
    #main{
        position: absolute;
        top: 0;
        left: 50%;
        transform:  translateX(-50%);
    }

    @keyframes scoreAddA{
        0% {
            transform: scale(120%);
        }
        50%{
            transform: scale(140%);
        }
        100%{
            transform: scale(180%);
        }
    }
    .gamingStage{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 1;
        .scoreBox{
            position:absolute;
            left: .2rem;
            top: .2rem;
            z-index: 100;
            color: yellow;
            min-width: 3rem;
            text-align: center;
            font-size:2rem;
            background:rgba(0,0,0,.5);
            border-radius: .5rem;
        }
        .timeBox{
            position:absolute;
            right: .2rem;
            top: .2rem;
            z-index: 100;
            color: yellow;
            min-width: 3rem;
            text-align: center;
            font-size:2rem;
            background:rgba(0,0,0,.5);
            border-radius: .5rem;
        }

    }
    .startCountDown{
        position: absolute;
        left: 0;
        top: 0;
        font-size: 4.5rem;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: yellow;
    }
    .parallelBars{
        position: absolute;
        left: 0;
        height: 10px;
        border-radius: 20px;
        width: 100%;
        background: yellow;
        z-index: 4;
    }

    .readyStage{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 1;

        .readyTips{
            color: #fff;
            font-size: 1.2rem;
            background: rgba(0,0,0,.5);
            font-weight: bold;
            text-align: center;
            padding:  .4rem;

        }
        .RotatCamera{
            position: absolute;
            right: .2rem;
            top: 50%;
            transform: translateY(-50%);
        }
        .startBtn{
            width: 4rem;
            height: 2rem;
            text-align: center;
            border-radius: .5rem;
            font-size: 1rem;
            line-height: 2rem;
            background: #e6a23c;
            color: #fff;
            margin: 0 auto;
            margin-top: .5rem;
        }
    }
    .result{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        .resultModal{
            color: #000;
            width: 8rem;
            height: 8rem;
            border-radius: .5rem;
            background: #fff;
            text-align: center;
        }
        .resultScore{
            padding-top: 1rem;
            font-size: 2rem;
            color: #FF6A00;
            font-style: italic;
            font-weight: bold;
        }

        .btnBox{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .resetBtn{
            width: 3rem;
            height: 1rem;
            border-radius: .4rem;
            background: #1f7de5;
            color: #fff;
            font-size: .5rem;
            text-align: center;
            line-height: 1rem;
            margin-top: 1.2rem;
            border: 1px solid #1f7de5;
        }
        .resetBtn.over{
            color: #1f7de5;
            background: #fff;
            margin-right: .2rem;

        }
        .info{
            font-size: .5rem;
            color: #333;
        }
    }

</style>
