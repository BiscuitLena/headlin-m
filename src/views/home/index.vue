<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        round
        type="info"
        slot="title"
        size="small"
        icon="search"
        to="/search"
      >
        搜索
      </van-button>
    </van-nav-bar>
    <!-- 标签页 -->
    <van-tabs v-model="active" animated swipeable class="channel-tabs">
      <van-tab :title="obj.name" v-for="obj in channels" :key="obj.id">
        <!-- 文章列表 -->
        <ArticleList :channel="obj"></ArticleList>
      </van-tab>
      <!-- 汉堡按钮 -->
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i class="headline hl-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :myChannel="channels"
        :active="active"
        @update-active="onUpdateActive"
      />
    </van-popup>
  </div>
</template>

<script>
import ChannelEdit from "./components/channel-edit";
import ArticleList from "./components/article-list";
import { getUserChannels } from "../../api/user.js";
import { mapState } from "vuex";
import { getItem } from "../../utils/storage";
export default {
  name: "HomePage",
  components: {
    ArticleList,
    ChannelEdit,
  },
  props: {},
  data() {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {},
  created() {
    this.loadChannels();
  },
  mounted() {},
  methods: {
    async loadChannels() {
      try {
        let channels = [];
        if (this.user) {
          // this.user代表用户登录成功user内有token
          const { data } = await getUserChannels();
          channels = data.data.channels;
          // 如果用户登录成功发送请求获取用户频道列表
        } else {
          // 如果用户未登陆
          const localChannels = getItem("TOUTIAO_CHANNELS");
          // 有本地频道列表数据(localstorage)
          if (localChannels) {
            channels = localChannels;
          } else {
            // 没有本地频道列表数据,请求默认频道列表
            const { data } = await getUserChannels();
            // console.log(data);
            channels = data.data.channels;
          }
        }
        this.channels = channels;
      } catch (err) {
        this.$toast("获取用户列表失败");
      }
    },
    onUpdateActive(index, isChannelEditShow = true) {
      // 更新激活的频道项
      this.active = index;
      // 关闭编辑频道弹层
      this.isChannelEditShow = isChannelEditShow;
    },
  },
};
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  .page-nav-bar {
    background-color: #3296fa;
    /deep/.van-nav-bar__title {
      max-width: unset;
    }
    .search-btn {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      border: none;
      font-size: 28px;
      i.van-icon {
        color: #fff;
        font-size: 32px;
      }
    }
  }
  /deep/.channel-tabs {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      width: 31px;
      height: 6px;
      bottom: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.headline {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
