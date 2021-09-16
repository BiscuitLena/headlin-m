<template>
  <div class="my-container">
    <!-- 头像区域 -->
    <!-- 已登录 -->
    <div class="header user-info" v-if="user">
      <div class="base-info">
        <div class="left">
          <van-image fit="cover" round class="avatar" :src="userInfo.photo" />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fan_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录 -->
    <div class="header not-login" v-else>
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" />
        <span class="text"> 登录 | 注册 </span>
      </div>
    </div>
    <!-- 导航 -->
    <van-grid :column-num="2" class="grid-nav" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="headline hl-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="headline hl-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 消息通知,小智同学 -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <van-cell
      clickable
      title="退出登录"
      class="lgout-cell"
      v-if="user"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getUserInfo } from "@/api/user";
export default {
  name: "MyPage",
  components: {},
  props: {},
  data() {
    return {
      userInfo: {},
      // 用户信息
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {},
  created() {
    if (this.user) {
      this.loadUserInfo();
    }
  },
  mounted() {},
  methods: {
    onLogout() {
      this.$dialog
        .confirm({
          title: "确认退出吗?",
        })
        .then(() => {
          // 确认退出:删除本地user和存储的user
          // on confirm
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          // on cancel
          console.log("取消执行这个操作");
        });
    },
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo();
        // console.log(data);
        this.userInfo = data.data;
      } catch (err) {
        console.log(err);
        this.$toast("获取用户信息失败,请稍后重试");
      }
    },
  },
};
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png") no-repeat;
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .mobile-img {
        width: 132px;
        height: 132px;
      }
      .text {
        font-size: 28px;
        color: #fff;
        margin-top: 15px;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: #fff solid 4px;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      height: 130px;
      display: flex;
      .data-item {
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      i.headline {
        font-size: 45px;
      }
      .hl-shoucang {
        color: #eb5253;
      }
      .hl-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .lgout-cell {
    text-align: center;
    margin-top: 9px;
    color: #d86262;
  }
}
</style>
