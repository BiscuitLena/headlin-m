<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ArticleItem
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "../../../api/article.js";
import ArticleItem from "../../../components/article-item/index.vue";
export default {
  name: "ArticleList",
  components: {
    ArticleItem,
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null,
      // 请求获取下一页的时间戳
      error: false,
      isreFreshLoading: false,
      refreshSuccessText: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      try {
        //   1.请求数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1,
        });
        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse("dsanjndjsa");
        // }
        // console.log(data);
        // 2.把请求结果数据放到list数组中
        const { results } = data.data;
        // 数组的展开符,他会把数组元素一个一个拿出来
        this.list.push(...results);
        // 3.本次加载结束要把加载状态改为结束
        this.loading = false;
        // 4.判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp;
        } else {
          this.finished = true;
        }
      } catch (err) {
        this.error = true;
        this.loading = false;
      }
    },
    async onRefresh() {
      try {
        //   1.请求数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1,
        });
        // 模拟随机失败的情况;
        // if (Math.random() > 0.5) {
        //   JSON.parse("dsanjndjsa");
        // }
        // console.log(data);
        // 2.把数据追加到顶部
        this.list.unshift(...data.data.results);
        // 3.关闭下拉刷新的loading
        this.isreFreshLoading = false;
        // 4.刷新加载成功消息提示
        this.refreshSuccessText = `刷新成功,更新了${data.data.results.length}条数据`;
      } catch (err) {
        this.refreshSuccessText = "刷新失败";
        this.isreFreshLoading = false;
      }
    },
  },
};
</script>

<style scoped lang='less'>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>