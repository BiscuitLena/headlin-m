<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <router-view> </router-view>
    <!-- 标签导航栏 -->
    <van-tabbar class="layout-tabbar" route>
      <van-tabbar-item to="/">
        <i slot="icon" class="headline hl-shouye" />
        <span class="text"> 首页 </span>
      </van-tabbar-item>
      <van-tabbar-item to="/qa">
        <i slot="icon" class="headline hl-wenda" />
        <span class="text"> 问答 </span>
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <i slot="icon" class="headline hl-shipin" />
        <span class="text"> 视频 </span>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <i slot="icon" class="headline hl-wode" />
        <span class="text"> {{ user ? "我的" : "未登录" }}</span>
        <!-- {{ $store.stats.user ? "我的" : "未登录" }} -->
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "LayoutIndex",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less">
.layout-container {
  .layout-tabbar {
    i.toutiao {
      font-size: 40px;
    }
    span.text {
      font-size: 20px;
    }
  }
}
</style>