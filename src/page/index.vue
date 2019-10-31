<template>
  <div class="index">
    <div class="banner">
      <div class="content-main bannerMain">
        <div style="margin-top:54px ">
          <h1>科技重塑体育</h1>
          <h3>领先的运动视觉人形识别技术</h3>
        </div>
        <div>
          <img class="bannerImg" src="../assets/img/主页插画@2x.png" alt />
        </div>
      </div>
    </div>
    <div class="content-main midMain">
      <el-row :gutter="30">
        <el-col :span="6" v-for="(item, index) in cardData" :key="index">
          <transition name="el-fade-in-linear">
            <div class="minCard">
              <img :src="item.img" alt />
              <p class="name">{{item.name}}</p>
              <p class="text">{{item.text}}</p>
            </div>
          </transition>
        </el-col>
      </el-row>
    </div>
    <div class="swiperMain">
      <div style="padding: 0">
        <el-carousel :interval="4000" arrow="never" height="450px">
          <el-carousel-item class="swiperItem" v-for="(item, idx) in swiperData" :key="idx">
            <div class="imgBox">
              <img :src="item.img" alt />
              <div class="pie"></div>
            </div>
            <div class="wordBox">
              <p class="name">{{item.name}}</p>
              <p class="text">{{item.text}}</p>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div class="sampleContent" style="height: 520px;background:#FFFFFF;">
      <p class="title">案&emsp;例&emsp;场&emsp;景&emsp;</p>
      <div class="content">
        <el-row :gutter="100">
          <el-col :key="item.word" :span="8" v-for="item in sampleData">
            <transition name="el-fade-in-linear">
              <div class="minCard">
                <div class="imgContainer">
                  <img :src="item.img" alt />
                </div>
                <p class="word bold">{{item.word}}</p>
                <p class="word mt10">{{item.desc}}</p>
              </div>
            </transition>
          </el-col>
        </el-row>
      </div>
    </div>
    <postForm></postForm>
  </div>
</template>

<script>
import PostForm from "../components/postForm";

export default {
  name: "index",
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg1 = /^1[3|4|5|7|8][0-9]\d{8}$/;
        const reg2 = /^(\d{3,4}-)?\d{7,8}$/;
        if (reg1.test(value) || reg2.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的号码"));
        }
      }
    };
    return {
      form: {
        companyName: "",
        name: "",
        mobile: "",
        email: "",
        content: ""
      },
      rules: {
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入联系人名称", trigger: "blur" }
        ],
        mobile: [
          {
            required: true,
            message: "请输入正确的联系电话",
            validator: checkPhone,
            trigger: ["blur"]
          }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        content: []
      },
      centerDialogVisible: false,
      cardData: [
        {
          img: require("../assets/img/创新@2x.png"),
          name: "创新",
          text:
            "创新的产品理念，植根于多元的体育场景。打破旧有思维，突破旧有技术。"
        },
        {
          img: require("../assets/img/激情@2x.png"),
          name: "激情",
          text:
            "奥林匹克永远充满激情，科技永远需要激情。点燃心中体育梦，迎接未来。"
        },
        {
          img: require("../assets/img/智慧@2x.png"),
          name: "智慧",
          text: "以人工智能为手段，基于体育大数据，打造新时代新形态的科技体育。"
        },
        {
          img: require("../assets/img/超越@2x.png"),
          name: "超越",
          text:
            "不断超越，更高更快更强。让体育精神与体育科技完成自我超越与变革。"
        }
      ],
      swiperData: [
        {
          img: require("../assets/img/人脸识别@2x.png"),
          name: "人脸与人体分析技术",
          text:
            "通过RGB图像输入，高速实时的给出人体头、肩、腰、腿等位置上百个关键点定位，可适用于各种人体动作分析。"
        },
        {
          img: require("../assets/img/图像分析@2x.png"),
          name: "图像视频理解与分析",
          text:
            "通过跟踪识别和分析提取视频中的元素，输出运动的结构化信息，支持战术分析、标注等场景。"
        },
        {
          img: require("../assets/img/三维重建@2x.png"),
          name: "空间感知与三维重建",
          text:
            "通过视觉及多传感器的融合，在虚拟空间中重建三维世界，实现三维空间中的运动分析。"
        }
      ],
      sampleData: [
        {
          word: "智慧体测机器人",
          desc: "开启校园体测人工智能时代",
          img: require("../assets/img/智慧体测机器人@2x.png")
        },
        {
          word: "智慧场馆",
          desc: "软硬件一体化体育AI解决方案",
          img: require("../assets/img/智慧场馆@2x.png")
        },
        {
          word: "智慧步道",
          desc: "智能感知运动数据多设备趣味互动",
          img: require("../assets/img/智慧步道@2x.png")
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
.index {
  background: #fff;

  .banner {
    width: 100%;
    height: 460px;
    background-image: url("../assets/img/形状结合@2x.png");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center bottom;
    .bannerMain {
      padding-top: 116px;
      display: flex;
      justify-content: space-between;
      h1 {
        color: #fff;
        letter-spacing: 5px;
        font-size: 42px;
        margin-bottom: 17px;
      }
      h3 {
        font-weight: normal;
        letter-spacing: 2px;
        color: #fff;
      }
    }

    .bannerImg {
      width: 460px;
    }
  }

  .midMain {
    background: #fff;
    margin: 88px auto 125px auto;
    .minCard {
      box-shadow: 0px 0px 13px 0px rgba(29, 183, 243, 0.1);
      border-radius: 8px;
      text-align: center;
      padding: 18px 0 32px 0;
      img {
        width: 65px;
      }
      .name {
        color: #001962;
        font-size: 14px;
      }
      .text {
        width: 70%;
        font-size: 12px;
        color: #888;
        margin: 0 auto;
        margin-top: 10px;
        line-height: 20px;
        text-align: left;
      }
    }
    .minCard:hover {
      transform: translate(0, -10px);
      box-shadow: 0px 5px 13px 4px rgba(29, 183, 243, 0.2);
    }
  }
  .swiperMain {
    background: #f8fbff;
    height: 451px;
    .el-carousel__indicators {
      bottom: 50px;
    }
    .el-carousel__indicator {
      .el-carousel__button {
        width: 40px;
        height: 4px;
        background: rgba(230, 230, 230, 1);
        border-radius: 2px;
        margin: 0 10px;
      }
    }
    .el-carousel__indicator.is-active button {
      background: #00db8f;
    }
    .swiperItem {
      display: flex;
      align-items: center;
      justify-content: center;
      .imgBox {
        position: relative;
        img {
          width: 200px;
          position: absolute;
          top: 0;
          right: 31px;
        }
        .pie {
          width: 200px;
          height: 200px;
          background: #ccf8e9;
          border-radius: 50%;
        }
      }

      .wordBox {
        text-align: left;
        margin-left: 120px;
        .name {
          font-size: 20px;
          color: #001962;
          font-weight: 600;
          letter-spacing: 3px;
        }
        .text {
          margin-top: 20px;
          font-size: 13px;
          color: #666;
          line-height: 24px;
          max-width: 280px;
        }
      }
    }
  }
  .sampleContent {
    .el-col-8 {
      &:nth-of-type(1) {
        img {
          width: 100%;
          // height: 100%;
        }
      }
      &:nth-of-type(2) {
        img {
          width: 100%;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;

          // height: 100%;
        }
      }
      &:nth-of-type(3) {
        img {
          width: 100%;
          // height: 100%;
        }
      }
    }
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
    .minCard {
      cursor: pointer;
      box-shadow: 0px 0px 13px 0px rgba(29, 183, 243, 0.1);
      border-radius: 8px;
      text-align: center;
      display: flex;
      flex-direction: column;
      height: 330px;

      .imgContainer {
        width: auto;
        height: 212px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .word {
        &.bold {
          font-weight: bold;
          font-size: 16px;
        }
        &.mt10 {
          margin-top: 0px;
        }
        color: #595959;
        text-align: center;
        margin: auto 0;
        font-size: 14px;
      }
    }
    .minCard:hover {
      transform: translate(0, -10px);
      box-shadow: 0px 5px 13px 4px rgba(29, 183, 243, 0.2);
    }
  }
}
</style>
