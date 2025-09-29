<template>
  <div class="home">
    <!-- <n-alert type="info" :show-icon="false" style="margin-bottom: 20px">
      站点未完工
    </n-alert> -->
    <n-grid
      v-if="store.newsArr[0] && store.newsArr.filter((item) => item.show)[0]"
      cols="1 560:2 800:3 1100:4 1500:5"
      :x-gap="24"
      :y-gap="24"
    >
      <n-grid-item
        class="news-card"
        v-for="(item, index) in store.newsArr.filter((item) => item.show)"
        :key="item"
        :style="{ animationDelay: index / 10 + 0.2 + 's' }"
      >
        <HotList :hotData="item" />
      </n-grid-item>
    </n-grid>
    <div class="error" v-else>
      <n-divider dashed class="tip"> 此处暂无内容 </n-divider>
      <n-space justify="center">
        <n-button size="large" secondary strong @click="reset">
          出错了？点此重置
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup>
import { mainStore } from "@/store";
import HotList from "@/components/HotList.vue";

const store = mainStore();

// 重置
const reset = () => {
  $dialog.warning({
    title: "重置站点",
    content:
      "确认重置站点？你的自定义数据将会恢复为默认状态！（当设置页面能正常进入并显示时请不要执行此操作！）",
    positiveText: "重置",
    negativeText: "取消",
    onPositiveClick: async () => {
      try {
        // 停止定时器
        if ($timeInterval) clearInterval($timeInterval);
        
        // 使用新的缓存清理方法
        $message.loading("正在重置站点并清除所有缓存...", { duration: 0 });
        const success = await store.clearAllClientCache({
          includeServiceWorker: true,
          reloadPage: false
        });
        
        if (success) {
          $message.destroyAll();
          $message.success("重置完成，页面即将刷新", { duration: 2000 });
          // 等待消息显示后再刷新
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          $message.destroyAll();
          $message.warning("重置可能不完整，建议手动刷新页面");
          // 如果缓存清理失败，仍然执行传统的重置方法
          localStorage.clear();
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      } catch (error) {
        console.error("重置过程中发生错误:", error);
        $message.destroyAll();
        $message.error("重置失败，正在尝试传统重置方法");
        // 降级到传统重置方法
        if ($timeInterval) clearInterval($timeInterval);
        localStorage.clear();
        location.reload();
      }
    },
  });
};
</script>

<style lang="scss" scoped>
.home {
  .news-card {
    opacity: 0;
    transform: translateY(20px);
    animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    animation: cardShow 0.3s forwards ease-in-out;
  }
  .tip {
    font-size: 22px;
  }
}

// 出现动画
@keyframes cardShow {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
