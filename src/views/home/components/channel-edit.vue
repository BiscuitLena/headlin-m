<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        class="edit-btn"
        @click="isEdit = !isEdit"
      >
        {{ isEdit ? "完成" : "编辑" }}
      </van-button>
    </van-cell>
    <van-grid :gutter="10" class="grid-item my-grid">
      <van-grid-item
        v-for="(channel, index) in myChannel"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon
          slot="icon"
          name="clear"
          v-show="isEdit && !fixedChannels.includes(channel.id)"
        ></van-icon>
        <span class="text" slot="text" :class="{ active: index === active }">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <!-- 通过 gutter 属性设置格子之间的距离 -->
    <van-grid :gutter="10" class="grid-item recommend-grid">
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel,
} from "../../../api/channel";
import { mapState } from "vuex";
import { setItem } from "../../../utils/storage";
export default {
  name: "ChannelEdit",
  components: {},
  props: {
    myChannel: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      allChannels: [],
      // 控制我的频道中宫格上删除按钮的显示
      isEdit: false,
      // 固定频道不允许删除
      fixedChannels: [0],
    };
  },
  computed: {
    ...mapState(["user"]),
    // 计算属性会观测内部依赖数据的变化,如果依赖的数据发生变化,则计算属性会重新执行
    recommendChannels() {
      // 数组的filter方法:遍历数组,把符合条件的元素存储到新数组中
      return this.allChannels.filter((channel) => {
        return !this.myChannel.find((myChannel) => {
          return myChannel.id === channel.id;
        });
      });
    },
    // recommendChannels() {
    //   const channels = [];
    //   this.allChannels.forEach((channel) => {
    //     // find遍历数组,找到满足条件的元素项
    //     const ret = this.myChannel.find((myChannel) => {
    //       return myChannel.id === channel.id;
    //     });
    //     // 如果我的频道中不包括该频道项,则收集到推荐频道中
    //     if (!ret) {
    //       channels.push(channel);
    //     }
    //   });
    //   // 把计算结果返回
    //   return channels;
    // },
  },
  watch: {},
  created() {
    this.loadAllChannels();
  },
  mounted() {},
  methods: {
    async loadAllChannels() {
      try {
        const res = await getAllChannels();
        // console.log(res);
        this.allChannels = res.data.data.channels;
      } catch (err) {}
    },
    async onAddChannel(channel) {
      // console.log(channel);
      this.myChannel.push(channel);
      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录,把数据请求接口放到线上
          await addUserChannel({
            id: channel.id,
            seq: this.myChannel.length,
          });
        } catch (err) {
          this.$toast("保存失败,请稍后重试");
        }
      } else {
        // 未登录, 把数据存储在本地;
        setItem("TOUTIAO_CHANNELS", this.myChannel);
      }
    },
    async deleteChannel(channel) {
      try {
        if (this.user) {
          await deleteUserChannel(channel.id);
        } else {
          // 未登录, 把数据存储在本地;
          setItem("TOUTIAO_CHANNELS", this.myChannel);
        }
      } catch (err) {
        this.$toast("删除频道失败");
      }
    },
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        // 编辑状态:删除频道;
        //1. 如果是固定频道,不删
        if (this.fixedChannels.includes(channel.id)) {
          return;
        }
        // 2.如果是删除激活频道之前的频道项,则active-1,更新频道状态
        if (index <= this.active) {
          this.$emit("update-active", this.active - 1, true);
        }
        // 3.删除频道项
        this.myChannel.splice(index, 1);
        // 4.处理持久化
        this.deleteChannel(channel);
      } else {
        // 完成状态:切换频道
        this.$emit("update-active", index, false);
      }
    },
  },
};
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .van-grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      background-color: #f4f5f6;
      white-space: nowrap;
      .van-grid-item__text,
      .text {
        margin-top: 0;
        font-size: 28px;
        color: #222;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/ .my-grid {
    .van-icon-clear {
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 30px;
      color: #cacaca;
      z-index: 2;
    }
  }
  /deep/.recommend-grid {
    .van-grid-item__content {
      flex-direction: row;
      .van-icon-plus {
        font-size: 28px;
        margin-right: 6px;
      }
    }
  }
}
</style>