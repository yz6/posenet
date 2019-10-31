<template>
  <div class="footer">
    <ul style="display: flex;width: 80%;">
      <li class="bottomItem">
        <div style=" position: relative;">
          <img class="botLogo" src="../assets/img/主页左下logo@2x.png" alt />
          <ul>
            <li class="logoWords">融梦科技</li>
            <li class="normal">致力于通过计算机视觉、深度学习等人工智能技术改变体育行业,为体育行业发展作出积极贡献。</li>
          </ul>
        </div>
      </li>
      <li class="bottomItem">
        <div>
          <p class="itemTitle">产品介绍</p>
          <router-link :to="'/products'">
            <p class="normal link">智慧体测</p>
          </router-link>
          <!--<p class="normal">智慧步道</p>-->
          <!--<p class="normal">智慧体育</p>-->
        </div>
      </li>
      <li class="bottomItem">
        <div>
          <p class="itemTitle">关于我们</p>
          <router-link :to="{path:'/about',query:{tab:1}}">
            <p class="normal link">公司简介</p>
          </router-link>
          <router-link :to="{path:'/about',query:{tab:2}}">
            <p class="normal link">加入我们</p>
          </router-link>
          <router-link :to="{path:'/about',query:{tab:3}}">
            <p class="normal link">联系我们</p>
          </router-link>
        </div>
      </li>
      <li class="bottomItem">
        <div>
          <p class="itemTitle">微信公众号</p>
          <!--<p class="normal">联系我们</p>-->
          <!--<p class="normal">融梦科技公众号</p>-->
          <img style="width: 100px;margin-top: 15px" src="../assets/img/qrcode_for_gh_d.jpg" alt />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {};
  },
  methods: {
    test() {
      console.log(1234);
    }
  }
};
</script>

<style lang="less">
.footer {
  width: 100%;
  height: 290px;
  display: flex;
  align-items: center;
  background: #343437;
  justify-content: center;
  .bottomItem {
    color: #fff;
    display: flex;
    justify-content: center;

    width: 25%;
    .itemTitle {
      font-weight: bold;
    }
    .logoWords {
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 5px;
    }
    .botLogo {
      position: absolute;
      left: -50px;
      top: -3px;
      width: 34px;
    }
    .normal {
      letter-spacing: 1px;
      margin-top: 10px;
      font-size: 12px;
      line-height: 25px;
      max-width: 190px;
      color: #dbdbdb;
    }
    .normal.link:hover {
      color: #4ea2fe;
      cursor: pointer;
    }
  }
}
</style>
