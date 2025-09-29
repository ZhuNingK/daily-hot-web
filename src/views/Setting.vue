<template>
  <div class="setting">
    <div class="title">全局设置</div>
    <n-h6 prefix="bar"> 基础设置 </n-h6>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">明暗模式</n-text>
        </div>
        <n-select
          class="set"
          v-model:value="siteTheme"
          :options="themeOptions"
          @update:value="siteThemeAuto = false"
        />
      </div>
    </n-card>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">明暗模式跟随系统</n-text>
          <n-text class="tip" :depth="3"> 明暗模式是否跟随系统当前模式 </n-text>
        </div>
        <n-switch
          v-model:value="siteThemeAuto"
          :round="false"
          @update:value="themeAutoOpen"
        />
      </div>
    </n-card>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">链接跳转方式</n-text>
          <n-text class="tip" :depth="3"> 选择榜单列表内容的跳转方式 </n-text>
        </div>
        <n-select
          class="set"
          v-model:value="linkOpenType"
          :options="linkOptions"
        />
      </div>
    </n-card>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">固定导航栏</n-text>
          <n-text class="tip" :depth="3"> 导航栏是否固定 </n-text>
        </div>
        <n-switch v-model:value="headerFixed" :round="false" />
      </div>
    </n-card>
    <n-card class="set-item">
      <div class="top" style="flex-direction: column; align-items: flex-start">
        <div class="name">
          <n-text class="text">列表文本大小</n-text>
          <n-card
            class="tip"
            :style="{
              backgroundColor: 'var(--n-border-color)',
              margin: '12px 0',
            }"
          >
            <n-text :style="{ fontSize: listFontSize + 'px' }">
              我是将要显示的文字的大小
            </n-text>
          </n-card>
        </div>

        <n-slider
          v-model:value="listFontSize"
          :tooltip="false"
          :max="20"
          :min="14"
          :step="0.01"
          :marks="{
            14: '小一点',
            16: '默认',
            20: '最大',
          }"
        />
      </div>
    </n-card>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">榜单排序</n-text>
          <n-text class="tip" :depth="3">
            拖拽以排序，开关用以控制在页面中的显示状态
          </n-text>
        </div>
        <n-popconfirm @positive-click="restoreDefault">
          <template #trigger>
            <n-button class="control" size="small"> 恢复默认 </n-button>
          </template>
          确认将排序恢复到默认状态？
        </n-popconfirm>
      </div>
      <draggable
        :list="newsArr"
        :animation="200"
        class="mews-group"
        item-key="order"
        @end="saveSoreData()"
      >
        <template #item="{ element }">
          <n-card
            class="item"
            embedded
            :content-style="{ display: 'flex', alignItems: 'center' }"
          >
            <div class="desc" :style="{ opacity: element.show ? null : 0.6 }">
              <img class="logo" :src="`/logo/${element.name}.png`" alt="logo" />
              <n-text class="news-name" v-html="element.label" />
            </div>
            <n-switch
              class="switch"
              :round="false"
              v-model:value="element.show"
              @update:value="saveSoreData(element.label, element.show)"
            />
          </n-card>
        </template>
      </draggable>
    </n-card>
    <n-h6 prefix="bar"> 杂项设置 </n-h6>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">清除应用缓存</n-text>
          <n-text class="tip" :depth="3">
            清除浏览器缓存，包括 Service Worker、IndexedDB 等，但保留设置数据
          </n-text>
        </div>
        <n-popconfirm @positive-click="clearCacheOnly">
          <template #trigger>
            <n-button type="info"> 清除缓存 </n-button>
          </template>
          确认清除应用缓存？你的设置将会保留，但缓存的数据将被清除。
        </n-popconfirm>
      </div>
    </n-card>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">重置所有数据</n-text>
          <n-text class="tip" :depth="3">
            重置所有数据，你的自定义设置都将会丢失
          </n-text>
        </div>
        <n-popconfirm @positive-click="reset">
          <template #trigger>
            <n-button type="warning"> 重置 </n-button>
          </template>
          确认重置所有数据？你的自定义设置都将会丢失！
        </n-popconfirm>
      </div> <div class="top">
        <div class="name">
          <n-text class="text">明暗模式</n-text>
        </div>
        <n-select
          class="set"
          v-model:value="siteTheme"
          :options="themeOptions"
          @update:value="siteThemeAuto = false"
        />
      </div>
    </n-card>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">明暗模式跟随系统</n-text>
          <n-text class="tip" :depth="3"> 明暗模式是否跟随系统当前模式 </n-text>
        </div>
        <n-switch
          v-model:value="siteThemeAuto"
          :round="false"
          @update:value="themeAutoOpen"
        />
      </div>
    </n-card>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">链接跳转方式</n-text>
          <n-text class="tip" :depth="3"> 选择榜单列表内容的跳转方式 </n-text>
        </div>
        <n-select
          class="set"
          v-model:value="linkOpenType"
          :options="linkOptions"
        />
      </div>
    </n-card>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">固定导航栏</n-text>
          <n-text class="tip" :depth="3"> 导航栏是否固定 </n-text>
        </div>
        <n-switch v-model:value="headerFixed" :round="false" />
      </div>
    </n-card>
    <n-card class="set-item">
      <div class="top" style="flex-direction: column; align-items: flex-start">
        <div class="name">
          <n-text class="text">列表文本大小</n-text>
          <n-card
            class="tip"
            :style="{
              backgroundColor: 'var(--n-border-color)',
              margin: '12px 0',
            }"
          >
            <n-text :style="{ fontSize: listFontSize + 'px' }">
              我是将要显示的文字的大小
            </n-text>
          </n-card>
        </div>

        <n-slider
          v-model:value="listFontSize"
          :tooltip="false"
          :max="20"
          :min="14"
          :step="0.01"
          :marks="{
            14: '小一点',
            16: '默认',
            20: '最大',
          }"
        />
      </div>
    </n-card>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">榜单排序</n-text>
          <n-text class="tip" :depth="3">
            拖拽以排序，开关用以控制在页面中的显示状态
          </n-text>
        </div>
        <n-popconfirm @positive-click="restoreDefault">
          <template #trigger>
            <n-button class="control" size="small"> 恢复默认 </n-button>
          </template>
          确认将排序恢复到默认状态？
        </n-popconfirm>
      </div>
      <draggable
        :list="newsArr"
        :animation="200"
        class="mews-group"
        item-key="order"
        @end="saveSoreData()"
      >
        <template #item="{ element }">
          <n-card
            class="item"
            embedded
            :content-style="{ display: 'flex', alignItems: 'center' }"
          >
            <div class="desc" :style="{ opacity: element.show ? null : 0.6 }">
              <img class="logo" :src="`/logo/${element.name}.png`" alt="logo" />
              <n-text class="news-name" v-html="element.label" />
            </div>
            <n-switch
              class="switch"
              :round="false"
              v-model:value="element.show"
              @update:value="saveSoreData(element.label, element.show)"
            />
          </n-card>
        </template>
      </draggable>
    </n-card>
    <n-h6 prefix="bar"> 杂项设置 </n-h6>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">清除应用缓存</n-text>
          <n-text class="tip" :depth="3">
            清除浏览器缓存，包括 Service Worker、IndexedDB 等，但保留设置数据
          </n-text>
        </div>
        <n-popconfirm @positive-click="clearCacheOnly">
          <template #trigger>
            <n-button type="info"> 清除缓存 </n-button>
          </template>
          确认清除应用缓存？你的设置将会保留，但缓存的数据将被清除。
        </n-popconfirm>
      </div>
    </n-card>
    <n-card class="set-item">
      <div class="top">
        <div class="name">
          <n-text class="text">重置所有数据</n-text>
          <n-text class="tip" :depth="3">
            重置所有数据，你的自定义设置都将会丢失
          </n-text>
        </div>
        <n-popconfirm @positive-click="reset">
          <template #trigger>
            <n-button type="warning"> 重置 </n-button>
          </template>
          确认重置所有数据？你的自定义设置都将会丢失！
        </n-popconfirm>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "@/store";
import { useOsTheme } from "naive-ui";
import draggable from "vuedraggable";

const store = mainStore();
const osThemeRef = useOsTheme();
const {
  siteTheme,
  siteThemeAuto,
  newsArr,
  linkOpenType,
  headerFixed,
  listFontSize,
} = storeToRefs(store);

// 深浅模式
const themeOptions = ref([
  {
    label: "浅色模式",
    value: "light",
  },
  {
    label: "深色模式",
    value: "dark",
  },
]);

// 榜单跳转
const linkOptions = [
  {
    label: "新页面打开",
    value: "open",
  },
  {
    label: "当前页打开",
    value: "href",
  },
];

// 开启明暗自动跟随
const themeAutoOpen = (val) => {
  console.log(osThemeRef.value);
  if (val) {
    siteTheme.value = osThemeRef.value;
  }
};

// 恢复默认排序
const restoreDefault = () => {
  newsArr.value = newsArr.value.sort((a, b) => a.order - b.order);
  $message.success("恢复默认榜单排序成功");
};

// 将排序结果写入
const saveSoreData = (name = null, open = false) => {
  $message.success(
    name ? `${name}榜单已${open ? "开启" : "关闭"}` : "榜单排序成功"
  );
};

// 重置数据
const reset = async () => {
  try {
    // 停止定时器
    if (typeof $timeInterval !== "undefined") clearInterval($timeInterval);
    
    // 使用新的缓存清理方法
    $message.loading("正在重置所有数据并清除缓存...", { duration: 0 });
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
    if (typeof $timeInterval !== "undefined") clearInterval($timeInterval);
    localStorage.clear();
    location.reload();
  }
};

// 只清除缓存，不重置设置
const clearCacheOnly = async () => {
  try {
    $message.loading("正在清除应用缓存...", { duration: 0 });
    
    // 使用缓存清理方法，但不清除 localStorage 中的设置数据
    const { clearIndexedDB, clearServiceWorkerCaches, clearSessionStorage, resetServiceWorker } = await import("@/utils/clearCache");
    
    const results = [];
    // 只清除 sessionStorage（临时数据）
    results.push(clearSessionStorage());
    // 清除 IndexedDB
    results.push(await clearIndexedDB());
    // 清除 Service Worker 缓存
    results.push(await clearServiceWorkerCaches());
    // 重置 Service Worker
    results.push(await resetServiceWorker());
    
    const allSuccessful = results.every(result => result === true);
    
    if (allSuccessful) {
      $message.destroyAll();
      $message.success("缓存清除完成！", { duration: 3000 });
    } else {
      $message.destroyAll();
      $message.warning("部分缓存清除失败，但主要缓存已清理");
    }
  } catch (error) {
    console.error("清除缓存过程中发生错误:", error);
    $message.destroyAll();
    $message.error("清除缓存失败，请手动刷新页面重试");
  }
};
</script>

<style lang="scss" scoped>
.setting {
  .title {
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 40px;
    font-weight: bold;
  }

  .n-h {
    padding-left: 16px;
    font-size: 20px;
    margin-left: 4px;
  }

  .set-item {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 12px;

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .name {
        font-size: 18px;
        display: flex;
        flex-direction: column;

        .tip {
          font-size: 12px;
          border-radius: 8px;
        }
      }

      .set {
        max-width: 200px;
      }
    }

    .mews-group {
      margin-top: 16px;
      display: grid;
      grid-template-columns: repeat(5, minmax(0px, 1fr));
      gap: 24px;

      @media (max-width: 1666px) {
        grid-template-columns: repeat(4, minmax(0px, 1fr));
      }

      @media (max-width: 1200px) {
        grid-template-columns: repeat(3, minmax(0px, 1fr));
      }

      @media (max-width: 890px) {
        grid-template-columns: repeat(2, minmax(0px, 1fr));
      }

      @media (max-width: 620px) {
        grid-template-columns: repeat(1, minmax(0px, 1fr));
      }

      .item {
        cursor: pointer;

        .desc {
          display: flex;
          align-items: center;
          width: 100%;
          transition: all 0.3s;

          .logo {
            width: 40px;
            height: 40px;
            margin-right: 12px;
          }

          .news-name {
            font-size: 16px;
          }
        }

        .switch {
          margin-left: auto;
        }
      }
    }
  }
}
</style>
