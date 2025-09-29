/**
 * 清除客户端本地所有缓存的工具函数
 * 包括 localStorage、sessionStorage、IndexedDB、Service Worker 缓存等
 */

/**
 * 清除 localStorage 存储
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    console.log('✅ LocalStorage 已清除');
    return true;
  } catch (error) {
    console.error('❌ 清除 LocalStorage 失败:', error);
    return false;
  }
};

/**
 * 清除 sessionStorage 存储
 */
export const clearSessionStorage = () => {
  try {
    sessionStorage.clear();
    console.log('✅ SessionStorage 已清除');
    return true;
  } catch (error) {
    console.error('❌ 清除 SessionStorage 失败:', error);
    return false;
  }
};

/**
 * 清除 IndexedDB 数据库
 */
export const clearIndexedDB = async () => {
  try {
    if (!window.indexedDB) {
      console.log('⚠️ 浏览器不支持 IndexedDB');
      return true;
    }

    // 获取所有数据库名称
    const databases = await indexedDB.databases();
    
    // 删除每个数据库
    const deletePromises = databases.map(db => {
      return new Promise((resolve, reject) => {
        const deleteRequest = indexedDB.deleteDatabase(db.name);
        deleteRequest.onsuccess = () => {
          console.log(`✅ IndexedDB 数据库 "${db.name}" 已删除`);
          resolve();
        };
        deleteRequest.onerror = () => {
          console.error(`❌ 删除 IndexedDB 数据库 "${db.name}" 失败`);
          reject(deleteRequest.error);
        };
      });
    });

    await Promise.all(deletePromises);
    console.log('✅ 所有 IndexedDB 数据库已清除');
    return true;
  } catch (error) {
    console.error('❌ 清除 IndexedDB 失败:', error);
    return false;
  }
};

/**
 * 清除 Service Worker 缓存
 */
export const clearServiceWorkerCaches = async () => {
  try {
    if (!('serviceWorker' in navigator)) {
      console.log('⚠️ 浏览器不支持 Service Worker');
      return true;
    }

    if (!('caches' in window)) {
      console.log('⚠️ 浏览器不支持 Cache API');
      return true;
    }

    // 获取所有缓存名称
    const cacheNames = await caches.keys();
    
    // 删除所有缓存
    const deletePromises = cacheNames.map(cacheName => {
      return caches.delete(cacheName).then(success => {
        if (success) {
          console.log(`✅ Service Worker 缓存 "${cacheName}" 已删除`);
        } else {
          console.error(`❌ 删除 Service Worker 缓存 "${cacheName}" 失败`);
        }
        return success;
      });
    });

    await Promise.all(deletePromises);
    console.log('✅ 所有 Service Worker 缓存已清除');
    return true;
  } catch (error) {
    console.error('❌ 清除 Service Worker 缓存失败:', error);
    return false;
  }
};

/**
 * 注销并重新注册 Service Worker
 */
export const resetServiceWorker = async () => {
  try {
    if (!('serviceWorker' in navigator)) {
      console.log('⚠️ 浏览器不支持 Service Worker');
      return true;
    }

    // 获取所有已注册的 Service Worker
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    // 注销所有 Service Worker
    const unregisterPromises = registrations.map(registration => {
      return registration.unregister().then(success => {
        if (success) {
          console.log('✅ Service Worker 已注销');
        } else {
          console.error('❌ Service Worker 注销失败');
        }
        return success;
      });
    });

    await Promise.all(unregisterPromises);
    console.log('✅ 所有 Service Worker 已注销');
    return true;
  } catch (error) {
    console.error('❌ 重置 Service Worker 失败:', error);
    return false;
  }
};

/**
 * 清除应用程序数据 (Application Cache - 已废弃，但为兼容性保留)
 */
export const clearApplicationCache = () => {
  try {
    if (window.applicationCache) {
      // Application Cache 已废弃，但某些旧浏览器可能还在使用
      window.applicationCache.update();
      console.log('✅ Application Cache 已更新');
    } else {
      console.log('⚠️ 浏览器不支持 Application Cache（这是正常的）');
    }
    return true;
  } catch (error) {
    console.error('❌ 处理 Application Cache 失败:', error);
    return false;
  }
};

/**
 * 清除 Web SQL 数据库 (已废弃，但为兼容性保留)
 */
export const clearWebSQL = () => {
  try {
    if (window.openDatabase) {
      console.log('⚠️ 检测到 Web SQL 支持，但已废弃，建议迁移到 IndexedDB');
      // 这里不实际清除 Web SQL，因为它已经废弃
    } else {
      console.log('⚠️ 浏览器不支持 Web SQL（这是正常的）');
    }
    return true;
  } catch (error) {
    console.error('❌ 处理 Web SQL 失败:', error);
    return false;
  }
};

/**
 * 清除所有可能的客户端缓存
 * @param {Object} options 配置选项
 * @param {boolean} options.includeServiceWorker 是否包括 Service Worker 重置，默认 true
 * @param {boolean} options.reloadPage 是否在清除后重新加载页面，默认 true
 * @returns {Promise<boolean>} 返回清除是否成功
 */
export const clearAllCache = async (options = {}) => {
  const {
    includeServiceWorker = true,
    reloadPage = true
  } = options;

  console.log('🧹 开始清除所有客户端缓存...');
  
  const results = [];

  // 清除各类存储
  results.push(clearLocalStorage());
  results.push(clearSessionStorage());
  results.push(await clearIndexedDB());
  results.push(await clearServiceWorkerCaches());
  results.push(clearApplicationCache());
  results.push(clearWebSQL());

  // 可选：重置 Service Worker
  if (includeServiceWorker) {
    results.push(await resetServiceWorker());
  }

  const allSuccessful = results.every(result => result === true);

  if (allSuccessful) {
    console.log('✅ 所有缓存清除完成！');
    
    // 可选：重新加载页面以确保新的开始
    if (reloadPage) {
      console.log('🔄 即将重新加载页面...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } else {
    console.error('❌ 部分缓存清除失败，请检查浏览器控制台');
  }

  return allSuccessful;
};

/**
 * 获取当前缓存使用情况的统计信息
 */
export const getCacheInfo = async () => {
  const info = {
    localStorage: 0,
    sessionStorage: 0,
    indexedDB: 0,
    serviceWorkerCaches: 0
  };

  try {
    // 计算 localStorage 大小（估算）
    let localStorageSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorageSize += localStorage[key].length;
      }
    }
    info.localStorage = localStorageSize;

    // 计算 sessionStorage 大小（估算）
    let sessionStorageSize = 0;
    for (let key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        sessionStorageSize += sessionStorage[key].length;
      }
    }
    info.sessionStorage = sessionStorageSize;

    // 计算 IndexedDB 数量
    if (window.indexedDB) {
      const databases = await indexedDB.databases();
      info.indexedDB = databases.length;
    }

    // 计算 Service Worker 缓存数量
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      info.serviceWorkerCaches = cacheNames.length;
    }

  } catch (error) {
    console.error('获取缓存信息失败:', error);
  }

  return info;
};

export default {
  clearLocalStorage,
  clearSessionStorage,
  clearIndexedDB,
  clearServiceWorkerCaches,
  resetServiceWorker,
  clearApplicationCache,
  clearWebSQL,
  clearAllCache,
  getCacheInfo
};