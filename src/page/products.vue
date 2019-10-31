<template>
  <div class="products">
    <div class="topBanner">
      <div class="content-main topBg">
        <div>
          <p>智慧体测机器人</p>
          <p class="desc">开启校园体测人工智能时代</p>
        </div>
        <img style="width: 500px;margin-top:0;" src="../assets/img/logo11@2x.png" alt />
      </div>
    </div>
    <div class="top2Bg">
      <div>
        <p>智 慧 体 测</p>
        <p>
          颠覆性变革创新产品，实现校园体测全流程在线、全过程监控、全平台智能，
          <br />引领校园体测设备跨越式发展，开启校园体测人工智能时代。
        </p>
      </div>
    </div>
    <div class="midContent" style="height: 495px">
      <div class="content">
        <p class="title">九 大 核 心 功 能</p>
        <ul style="overflow: hidden;zoom: 1;clear: both">
          <li class="funItem" v-for="(item,index)  in functionData" :key="index">
            <img :src="item.img" alt />
            {{item.name}}
          </li>
        </ul>
      </div>
    </div>
    <div class="midContent" style="height: 560px;background:#F8FBFF ">
      <el-carousel height="560px" style="width:100%" arrow="always">
        <el-carousel-item>
          <div class="content">
            <p class="title">三 大 优 势</p>
            <div class="advantage">
              <img src="../assets/img/111@2x.png" alt />
              <div class="advItem item1">
                <p class="name">节省测试时间 防止作假</p>
                <p class="text">节省识别测试者名字时间、人脸识别、不可作假</p>
              </div>
              <div class="advItem item2">
                <p class="name">智能训练 及时反馈</p>
                <p class="text">学生体育训练智能即时、屏幕自动反馈成绩，提升学生体育训练兴趣</p>
              </div>
              <div class="advItem item3">
                <p class="name">节省录入时间 支持数据分析</p>
                <p class="text">节省测试成绩录入时间、支持历史数据分析</p>
              </div>
            </div>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="content">
            <p class="title">二 大 特 点</p>
            <div class="advantage">
              <img src="../assets/img/轮播插图.png" alt />
              <div class="advItem item4">
                <p class="name">智能化体测机器人</p>
                <p class="text">多运动智能分析</p>
                <p class="text">室内室外快速部署移动化</p>
                <p class="text">5G时代的智能体育运动数据采集机器人</p>
              </div>
              <div class="advItem item5">
                <p class="name">智能训练 及时反馈</p>
                <p class="text">测试结果与分析报告</p>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="sampleContent" style="height: 480px;background:#FFFFFF;">
      <p class="title">案&emsp;例&emsp;场&emsp;景&emsp;</p>
      <div class="content">
        <el-row :gutter="100">
          <el-col :key="item.word" :span="8" v-for="item in sampleData">
            <transition name="el-fade-in-linear">
              <div class="minCard">
                <div class="imgContainer">
                  <img :src="item.img" alt />
                </div>
                <p class="word">{{item.word}}</p>
              </div>
            </transition>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="sampleContent" style="height: 495px;background:#F8FBFF;">
      <div class="content">
        <p class="title">支&emsp;持&emsp;项&emsp;目</p>
        <ul style="margin-top:30px;" class="projectList">
          <li class="projectItem" v-for="(item,index)  in projectData1" :key="index">
            <img :src="item.img" alt />
            {{item.name}}
          </li>
        </ul>
        <ul style="margin-top:80px;" class="projectList">
          <li class="projectItem" v-for="(item,index)  in projectData2" :key="index">
            <img :src="item.img" alt />
            {{item.name}}
          </li>
        </ul>
      </div>
    </div>
    <div class="bottomContent" style="height: 450px;background: #fff">
      <el-carousel height="450px" style="width:100%" arrow="always">
        <el-carousel-item v-for="(item, index) in swiperData" :key="index">
          <div class="swiperBody">
            <div class="left">
              <p class="name">{{item.name}}</p>
              <p class="text" v-for="(ele, idx) in item.text" :key="idx">{{ele}}</p>
            </div>
            <img class="right" :src="item.img" alt />
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <postForm></postForm>
  </div>
</template>

<script>
import PostForm from "../components/postForm";

export default {
  name: "products",
  data() {
    return {
      functionData: [
        {
          name: "任务智能编排",
          img: require("../assets/img/排版@2x.png")
        },
        {
          name: "人脸智能认证",
          img: require("../assets/img/认证@2x.png")
        },
        {
          name: "语音智能播报",
          img: require("../assets/img/播报@2x.png")
        },
        {
          name: "测试智能评分",
          img: require("../assets/img/编组 14@2x.png")
        },
        {
          name: "视频智能回放",
          img: require("../assets/img/回放@2x.png")
        },
        {
          name: "违规智能提示",
          img: require("../assets/img/提示@2x.png")
        },
        {
          name: "远程智能巡视",
          img: require("../assets/img/编组 21@2x.png")
        },
        {
          name: "体质智能分析",
          img: require("../assets/img/分析@2x.png")
        },
        {
          name: "数据智能上报",
          img: require("../assets/img/上报@2x.png")
        }
      ],
      projectData1: [
        {
          name: "跑步",
          img: require("../assets/img/跑步@2x.png")
        },
        {
          name: "立定跳远",
          img: require("../assets/img/立定跳远@2x.png")
        },
        {
          name: "仰卧起坐",
          img: require("../assets/img/仰卧起坐@2x.png")
        },
        {
          name: "引体向上",
          img: require("../assets/img/引体向上@2x.png")
        },
        {
          name: "坐位体前屈",
          img: require("../assets/img/坐位体前屈@2x.png")
        },
        {
          name: "跳绳",
          img: require("../assets/img/跳绳@2x.png")
        }
      ],
      projectData2: [
        {
          name: "实心球",
          img: require("../assets/img/实心球@2x.png")
        },
        {
          name: "足球",
          img: require("../assets/img/足球@2x.png")
        },
        {
          name: "篮球",
          img: require("../assets/img/篮球@2x.png")
        },
        {
          name: "排球",
          img: require("../assets/img/排球@2x.png")
        },
        {
          name: "游泳",
          img: require("../assets/img/游泳@2x.png")
        },
        {
          name: "十字跳",
          img: require("../assets/img/十字跳@2x.png")
        }
      ],
      swiperData: [
        {
          name: "实时人体运动分析与标准测量",
          text: [
            "人脸识别匹配学生信息",
            "人形识别人体姿态、关节、运动动作",
            "摄像头自动识别运动成绩与运动过程数据"
          ],
          img: require("../assets/img/lunbo1@2x.png")
        },
        {
          name: "体测成绩智能分析",
          text: [
            "测试结果自动生成",
            "学生体质智能分析",
            "智能化体育测试报告。"
          ],
          img: require("../assets/img/lunbo2@2x.png")
        },
        {
          name: "数据可视化",
          text: ["测试任务智能编排", "测试进度实时查询", "体测数据可视化"],
          img: require("../assets/img/lunbo3@2x.png")
        }
      ],
      sampleData: [
        {
          word: "中考体育测试",
          img: require("../assets/img/中考体育测试@2x.png")
        },
        {
          word: "运动技能等级测试",
          img: require("../assets/img/运动技能等级测试@2x.png")
        },
        {
          word: "国家体质健康标准测试",
          img: require("../assets/img/国家体质健康标准测试@2x.png")
        }
      ]
    };
  },
  components: {
    PostForm
  }
};
</script>

<style lang="less">
.products {
  .topBg {
    .desc {
      font-size: 14px;
      margin-top: 20px;
    }
  }
  .top2Bg {
    height: 220px;
    display: flex;
    background: #f8fbff;
    align-items: center;
    justify-content: center;
    text-align: center;

    p:first-child {
      font-family: "PingFangSC-Semibold";
      font-weight: 600;
      font-size: 20px;
      color: #001962;
    }
    p:last-child {
      width: 500px;
      line-height: 28px;
      color: #666;
      font-size: 14px;
      margin-top: 15px;
    }
  }
  .sampleContent {
    .title {
      text-align: center;
      font-family: "PingFangSC-Semibold";
      font-weight: 600;
      color: #001962;
      font-size: 18px;
      padding-bottom: 40px;
      padding-top: 65px;
    }
    background: #fff;
    .content {
      width: 80%;
      max-width: 1200px;
      min-width: 900px;
      margin: 0 auto;
    }
    .projectList {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .projectItem {
      width: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      color: #001962;
      img {
        width: 45px;
        margin-bottom: 20px;
      }
    }
    .el-col-8 {
      &:nth-of-type(1) {
        img {
          width: 80%;
        }
      }
      &:nth-of-type(2) {
        img {
          height: 70%;
        }
      }
      &:nth-of-type(3) {
        img {
          width: 70%;
        }
      }
    }
    .minCard {
      cursor: pointer;
      box-shadow: 0px 0px 13px 0px rgba(29, 183, 243, 0.1);
      border-radius: 8px;
      text-align: center;
      display: flex;
      flex-direction: column;
      height: 310px;

      .imgContainer {
        width: auto;
        height: 185px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .word {
        color: #595959;
        text-align: center;
        margin: auto 0;
      }
    }
    .minCard:hover {
      transform: translate(0, -10px);
      box-shadow: 0px 5px 13px 4px rgba(29, 183, 243, 0.2);
    }
  }
  .midContent {
    display: flex;
    align-items: center;
    justify-content: center;
    .content {
      width: 960px;
      margin: 0 auto;
    }
    .title {
      text-align: center;
      font-family: "PingFangSC-Semibold";
      font-weight: 600;
      color: #001962;
      font-size: 18px;
      margin-bottom: 20px;
      margin-top: 20px;
    }
    .funItem {
      float: left;
      width: 33%;
      color: #001962;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      margin-bottom: 35px;
      letter-spacing: 2px;
      img {
        width: 58px;
        margin-right: 15px;
      }
    }

    .advantage {
      position: relative;
      text-align: center;
      padding-top: 105px;
      img {
        width: 650px;
      }
      .advItem {
        position: absolute;
        white-space: nowrap;
        .name {
          font-size: 14px;
          color: #001962;
          letter-spacing: 3px;
          margin-bottom: 5px;
          font-weight: 600;
          text-align: left;
        }
        .text {
          color: #666666;
          font-size: 12px;
          line-height: 26px;
          max-width: 160px;
          text-align: left;
        }
      }
      .item1 {
        top: 95px;
        left: 85px;
      }
      .item2 {
        right: 170px;
        top: -5px;
      }
      .item3 {
        right: 20px;
        top: 180px;
      }
      .item4 {
        top: 80px;
        left: 75px;
      }
      .item5 {
        right: 70px;
        top: 200px;
      }
      .borderLine {
        border-radius: 8px;
      }
    }
  }
  .bottomContent {
    display: flex;
    align-items: center;
    justify-content: center;

    .swiperBody {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      .left {
        margin-right: 200px;
        .name {
          font-weight: 600;
          color: rgba(0, 25, 98, 1);
          margin-bottom: 15px;
          font-size: 14px;
          letter-spacing: 3px;
        }
        .text {
          color: #000;
          font-weight: 400;
          line-height: 28px;
          font-size: 12px;
          max-width: 260px;
        }
      }
      .right {
        width: 550px;
        margin-left: 50px;
      }
    }
  }
  .bottomContent,
  .midContent {
    .el-carousel__arrow {
      background: rgba(161, 160, 175, 0.1);
      color: #666;
      width: 25px;
      font-weight: bold;
      height: 50px;
      border-radius: 3px;
      font-size: 18px;
    }
    .el-carousel__arrow:hover {
      background: rgba(0, 209, 102, 0.1);
      color: #00d166;
    }
    .el-carousel__arrow--left {
      left: 40px;
    }
    .el-carousel__arrow--right {
      right: 40px;
    }
  }
}
</style>
