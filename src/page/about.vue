<template>
  <div class="about">
    <div class="topBanner">
      <div class="topBanner">
        <div class="content-main topBg">
          <p>打造“云+端 体育AI平台化服务”</p>
          <img style="width: 280px" src="../assets/img/编组 13@2x.png" alt />
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="switchTab">
      <el-tab-pane label="公司简介" name="1">
        <div class="tabTop">
          <div>
            <p>融梦科技致力于通过计算机视觉、深度学习等人工智能技术改变体育行业，为体育行业发展作出积极贡献。公司坚持以领先的运动视觉技术、优秀的产品用户体验为核心，希望持续推动体育事业、体育产业的发展，助力体育强国建设。</p>
            <p>公司人员来自于BAT、海康威视等知名互联网及人工智能公司，毕业于北大、同济、南邮等知名院校，拥有研发人员30余名，在北京、上海设立研发中心。</p>
          </div>
        </div>
        <div class="tabMid" style="height: 425px;">
          <img class="contentImg" src="../assets/img/云端插画@2x.png" alt />
          <div class="rightBox">
            <div class="name">打造“云+端 体育AI平台化服务”</div>
            <p class="text">实时多样的智能化硬件及可扩展的软件服务</p>
            <p class="text">基于海量数据的智能化和自助式深度分析和挖掘服务</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="加入我们" name="2">
        <div class="tabTop">
          <div>
            <div class="title">
              欢迎加入
              <span style="font-weight: bold">融梦!</span>
            </div>
            <div class="weCome">我们期望有同样梦想的你加入我们，一起用科技改变体育，为客户创造价值！</div>
          </div>
        </div>
        <div class="tabMid" style="height: 450px">
          <div>
            <div class="titleBox">
              <div style="display: flex;align-items: center;margin: 0 auto">
                <img src="../assets/img/email@2x.png" alt />
                <div style="margin: 0 30px">
                  <div class="title">
                    为什么
                    <span style="font-weight: bold">加入我们</span>
                  </div>
                  <div class="weCome">跟我们一起享受创造、创新的激情与乐趣，勇于挑战自己。</div>
                </div>
                <img src="../assets/img/plane@2x.png" alt />
              </div>
            </div>
            <div class="whyJoin">
              <el-row gutter="90">
                <el-col class="joinItem" :key="item" :span="8" v-for="(item,ind) in whyJoin">
                  <div style="position: relative">
                    <span class="indIcon">0{{ind+1}}.</span>
                    <p class="name">{{item.name}}</p>
                    <p class="text">{{item.text}}</p>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="positionBox">
          <div class="tabTop">
            <div>
              <div class="title">
                工作
                <span style="font-weight: bold">岗位</span>
              </div>
              <div
                class="weCome"
                style="max-width: 370px;line-height: 28px;"
              >我们一直在不断地寻找努力上进富有热情的员工，加入融梦科技的大家庭，从下面查看所有开放的岗位。</div>
            </div>
          </div>
          <div class="positionItem" v-for="(item, index) in position" :key="index">
            <el-tag :type="item.cls">{{item.type}}</el-tag>
            <div class="pos" v-for="(i, idx) in item.post" :key="idx">
              <div class="pName">{{i.name}}</div>
              <div class="pAddres">
                {{i.address}}
                <i class="el-icon-right"></i>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="联系我们" name="3">
        <div class="concatBody">
          <div class="left">
            <div class="mapPos beijing" :class="currentCity == '1'?'act':''">
              <img src="../assets/img/定位@2x.png" alt />
              <div class="cityName">北京</div>
            </div>
            <div class="mapPos shanghai" :class="currentCity == '2'?'act':''">
              <img src="../assets/img/定位@2x.png" alt />
              <div class="cityName">上海</div>
            </div>
          </div>
          <div class="right">
            <div class="rightItem">
              <div class="body">
                <div class="title">{{shInfo.name}}</div>
                <div style="margin-bottom: 20px">
                  <p style="font-weight: bold;">联系电话</p>
                  <p>{{shInfo.phone}}</p>
                </div>
                <div>
                  <p style="font-weight: bold">地址</p>
                  <p>{{shInfo.address}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="concatBottom">
          <el-row class="bottomBody">
            <el-col class="concatItem" :key="item.name" :span="8" v-for="(item,ind) in concatData">
              <div>
                <div class="name">
                  <span>{{item.name}}</span>
                  <img :src="item.img" alt />
                </div>
                <a
                  :href="ind!=0?('mailto:'+item.text):'javascript:void(0)'"
                  class="text"
                >{{item.text}}</a>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "about",
  data() {
    return {
      whyJoin: [
        {
          name: "高速成长的公司",
          text: "公司的快速成长，为每一个员工带来更多的机会。"
        },
        {
          name: "前沿的技术方向",
          text: "投身人工智能领域，通过人形识别技术，共同打造新产品。"
        },
        {
          name: "充满活力的业务",
          text: "体育竞技、训练、健身、康复，总有一款适合你。"
        },
        {
          name: "体贴的福利制度",
          text: "一年12天的春节假，让你过个安心年。"
        },
        {
          name: "健康轻松的氛围",
          text: "各项运动项目供你体验参与，工作健康两不误。"
        },
        {
          name: "自我提升与激励",
          text: "最in的领域方向，带给你无限的挑战。"
        }
      ],
      position: [
        {
          type: "产品",
          cls: "success",
          post: [
            {
              name: "产品经理",
              address: "上海，中国"
            }
          ]
        },
        {
          type: "研发",
          cls: "primary",
          post: [
            {
              name: "算法工程师",
              address: "上海，中国"
            },
            {
              name: "安卓工程师",
              address: "上海，中国"
            }
          ]
        },
        {
          type: "市场&营销",
          cls: "warning",
          post: [
            {
              name: "市场经理",
              address: "上海，中国"
            }
          ]
        }
      ],
      activeName: "1",
      currentCity: "2",
      shInfo: {
        name: "上海",
        phone: " +86 181-2142-5118",
        address: "上海市徐汇区田林路192号华鑫科技园J座3F"
      },
      bjInfo: {
        name: "北京",
        phone: "186 1158 8511",
        address: "北京市朝阳区元辰鑫大厦E1座302"
      },
      currentInfo: {
        name: "上海",
        phone: "181 2142 5118",
        address: "上海市徐汇区田林路140号越界创意园区"
      },
      concatData: [
        {
          name: "咨询电话",
          img: require("../assets/img/咨询电话@2x.png"),
          text: "18901967109"
        },
        {
          name: "客服邮箱",
          img: require("../assets/img/客服邮箱@2x.png"),
          text: "kf@dreamsports.ai"
        },
        {
          name: "商务合作",
          img: require("../assets/img/商务合作@2x.png"),
          text: "business@dreamsports.ai"
        }
        // {
        //     name:'市场合作',
        //     img:require('../assets/img/市场合作@2x.png'),
        //     text:'dabai@keji.com'
        // }
      ]
    };
  },
  watch: {
    $route(v) {
      if (v.query.tab + "") {
        this.activeName = v.query.tab + "";
      }
    }
  },
  created() {
    if (this.$route.query.tab == "2") {
      this.activeName = "2";
    } else if (this.$route.query.tab == "3") {
      this.activeName = "3";
    } else {
      this.activeName = "1";
    }
  },
  methods: {
    switchCity(type) {
      this.currentCity = type;
      this.currentInfo = type == "1" ? this.bjInfo : this.shInfo;
    },
    switchTab(e) {
      this.$router.push({ path: "about", query: { tab: e.name } });
    }
  }
};
</script>

<style lang="less">
.about {
  .title {
    color: #001962;
    font-size: 20px;
    letter-spacing: 5px;
    text-align: center;
    margin-bottom: 15px;
  }
  .weCome {
    font-size: 13px;
    font-weight: 400;
    color: #666;
  }
  .tabTop {
    background: #f8fbff;
    height: 210px;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: center;

    p {
      max-width: 55%;
      margin: 0 auto;
      font-size: 13px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 24px;
      margin-bottom: 15px;
    }
  }
  .tabMid {
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    .titleBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 60px;
      img {
        width: 35px;
      }
    }
    .whyJoin {
      width: 60%;
      min-width: 900px;
      padding: 0 30px;
      margin: 0 auto;
      font-size: 13px;
      .joinItem {
        margin-bottom: 50px;
        height: 65px;
        .indIcon {
          font-weight: bold;
          position: absolute;
          left: -40px;
          top: -2px;
          color: #001962;
          background: #edf2ff;
          width: 25px;
          font-size: 13px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          border-radius: 50%;
        }
      }
      .name {
        color: #001962;
        margin-bottom: 10px;
        font-weight: 500;
      }
      .text {
        font-size: 13px;
        color: #9f9ead;
      }
    }

    .contentImg {
      width: 278px;
      margin-right: 80px;
    }
    .rightBox {
      .name {
        color: #001962;
        font-size: 20px;
        letter-spacing: 8px;
        margin-bottom: 30px;
      }
      .text {
        font-size: 14px;
        margin-bottom: 15px;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
    }
  }
  .positionBox {
    padding-bottom: 40px;
    background: #f8fbff;
    .positionItem {
      text-align: center;
      padding-bottom: 40px;
      .el-tag {
        padding: 0 20px;
        border: none;
        font-weight: 500;
      }
      .pos {
        width: 600px;
        border-radius: 5px;
        padding: 0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 43px;
        font-size: 13px;
        background: #fff;
        margin: 0 auto;
        margin-top: 15px;
        cursor: pointer;
        .pName {
          color: #001962;
          font-weight: 400;
        }
        .pAddres {
          display: flex;
          align-items: center;
          color: #9f9ead;
          i {
            color: #2472fd;
            font-weight: bold;
            font-size: 16px;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .concatBody {
    background: #f8fbff;
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    .left {
      width: 500px;
      height: 450px;
      background-image: url("../assets/img/map.8112599@2x.png");
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      position: relative;
      .mapPos {
        position: absolute;
        text-align: center;
        cursor: pointer;
        img {
          width: 12px;
        }
        .cityName {
          color: #2d0af8;
          background: #fff;
          padding: 0 10px;
          border-radius: 20px;
          font-size: 12px;
          border: 1px solid #ddd;
        }
      }
      .mapPos {
        img {
          width: 20px;
        }
        .cityName {
          font-weight: bold;
        }
      }
      .beijing {
        right: 120px;
        top: 155px;
      }
      .shanghai {
        right: 75px;
        top: 240px;
      }
    }
    .right {
      .rightItem {
        width: 300px;
        height: 180px;
        background: #fff;
        box-shadow: 0px 2px 5px 3px rgba(102, 102, 102, 0.05);
        border-radius: 3px;
        margin-left: 120px;
        text-align: left;
        padding: 10px 0;
        margin-bottom: 30px;
      }
      .body {
        width: 80%;
        margin: 0 auto;
        text-align: left;
        .title {
          text-align: left;
          font-weight: bold;
          padding: 15px 0;
          font-size: 14px;
          border-bottom: 1px solid #f0f0f0;
        }
        p {
          color: #001962;
          font-size: 12px;
          margin-bottom: 5px;
        }
      }
    }
  }
  .concatBottom {
    background: #fff;
    padding: 45px 0 75px 0;
    .bottomBody {
      width: 960px;
      margin: 0 auto;
    }
    .concatItem {
      font-size: 14px;
      color: #001962;
      display: flex;
      justify-content: center;
      .name {
        font-weight: 500;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        img {
          width: 25px;
          margin-left: 10px;
        }
      }
      .text {
        color: #001962;
        cursor: pointer;
      }
    }
  }
  .el-tabs__nav-scroll {
    padding-top: 5px;
    display: flex;
    justify-content: center;
    background: #f8fbff;
    .el-tabs__nav {
      margin: 0 auto;
    }
  }
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__item {
    color: #666;
    padding: 0 40px;
    font-size: 16px;
    font-weight: normal;
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .el-tabs__active-bar {
    display: none;
  }
  .el-tabs__item.is-active {
    color: #001962;
  }
  .el-tabs__item.is-active:hover {
    color: #001962;
  }
  .el-tabs__item:hover {
    color: #666;
  }
}
</style>
