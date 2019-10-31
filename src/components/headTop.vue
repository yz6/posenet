<template>
  <div class="header_container noselect">
    <div class="logoBox">
      <div>
        <img src="../assets/img/主页logo@2x.png" alt />
      </div>融梦科技
    </div>
    <div class="topNewBox">
      <div
        class="menuBtn"
        v-for="(item, idx) in menuData"
        :key="idx"
        :class="currentPath==item.path?'act':''"
        @click="item.path == $route.path?'':switchMenu(item)"
      >{{item.name}}</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getCookie, delCookie, setCookie } from "../api/cookie";
import { getCurrentStaff, getAllFloorNumbers } from "../api/getData";

export default {
  data() {
    return {
      showWebNum: false,
      currentPath: "/index",
      menuData: [
        {
          path: "/index",
          name: "首页",
          id: 1
        },
        {
          path: "/products",
          name: "智慧体测机器人",
          id: 2
        },
        {
          path: "/about",
          name: "关于我们",
          id: 3
        }
      ]
    };
  },
  mounted() {},
  watch: {},
  activated() {},
  created() {
    this.currentPath = this.$route.path;
  },
  computed: {},
  methods: {
    switchMenu(item) {
      console.log(item);
      this.$router.push(item.path);
      this.currentPath = item.path;
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
</style>
