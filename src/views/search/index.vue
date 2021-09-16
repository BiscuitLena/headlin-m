<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
      />
    </form>
    <!-- 搜索历史记录 -->
    <!-- 联想建议 -->
    <!-- 历史记录 -->
  </div>
</template>

<script>
export default {
  name: "SearchPage",
  components: {},
  props: {},
  data() {
    return {
      searchText: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSearch(val) {
      Toast(val);
    },
    onCancel() {
      this.$router.back();
    },
  },
};
</script>

<style scoped lang='less'>
.search-container {
  .van-search__action {
    color: #fff;
  }
}
</style>
