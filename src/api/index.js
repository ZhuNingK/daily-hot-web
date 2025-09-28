import axios from "@/api/request";

/**
 * 获取指定平台的热榜数据
 * @param {object} data 参数对象，包含 platform、type、isCache 等
 * @returns {Promise} 返回一个包含热榜数据的 Promise
 */
export const getHotLists = (data) => {
  return axios({
    method: "post",
    url: `/api/hotSearch/getHotLists`,
    data: data,
  });
};
