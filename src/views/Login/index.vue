<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" class="page-nav-bar">
      <van-icon name="cross" slot="left" @click="$router.back()" />
    </van-nav-bar>
    <!-- 表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="headline hl-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="headline hl-yanzhengma"></i>
        <template #button>
          <!-- 倒计时 -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 10"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="small"
            type="default"
            @click="onSendSms"
            native-type="button"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit" class="login-btn"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from "../../api/user";
export default {
  name: "LoginPage",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "",
        code: "",
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: "手机号不能为空",
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: "手机号格式错误",
          },
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空",
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误",
          },
        ],
      },
      isCountDownShow: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      // 1.获取表单数据
      const user = this.user;
      // 2.验证表单数据
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true,
        duration: 0,
      });
      // 3.提交表单数据
      try {
        const res = await login(this.user);
        // console.log(res);
        this.$store.commit("setUser", res.data.data);
        this.$toast.success("登录成功");
        // 登录成功跳转回原来的页面
        this.$router.back();
      } catch (err) {
        // console.log(err.response);
        if (err.response.status === 400) {
          // console.log("手机号或验证码错误");
          this.$toast.fail("手机号或验证码错误");
        } else {
          // console.log("登录失败", err);
          this.$toast.fail("登录失败");
        }
      }
      // 4.后续操作
    },
    async onSendSms() {
      // 1.验证手机号
      try {
        await this.$refs.loginForm.validate("mobile");
        // console.log("手机号验证通过");
      } catch (err) {
        //  console.log("手机号验证失败", err);
        return;
      }
      //  2.开启倒计时
      this.isCountDownShow = true;
      // 3.请求发送验证码
      try {
        await sendSms(this.user.mobile);
        this.$toast("发送成功");
      } catch (err) {
        this.isCountDownShow = false;
        console.log(err.response.status);
        if (err.response.status === 429) {
          this.$toast("发送频繁,请稍后重试");
        } else {
          this.$toast("发送失败,请稍后重试");
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
    border: 0;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
