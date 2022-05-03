/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2022-04-23 17:48:19
 * @LastEditors: sueRimn
 * @LastEditTime: 2022-05-03 08:09:51
 */
// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取上线清单 */
export async function fetchDeployReq(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.DeployReqList>('/api/deploy/req', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建上线清单 */
export async function createDeployReq(
  body: API.CreateDeployReqBody,
  options?: { [key: string]: any },
) {
  return request<API.CreateDeployReqRes>('/api/deploy/req', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取项目 */
export async function fetchAllProject(
  options?: { [key: string]: any },
) {
  return request<API.BaseOptionsListItem>('/api/project/all/', {
    method: 'GET',
    params: {},
    ...(options || {}),
  });
}

/** 获取项目下的应用 */
export async function getProjectApp(
  pid: number,
  options?: { [key: string]: any },
) {
  return request<API.BaseOptionsListItem>('/api/project/app/', {
    method: 'GET',
    params: {pid: pid},
    ...(options || {}),
  });
}

/** 获取应用下的版本 */
export async function getAppVersion(
  appId: number,
  daterangeBegin: string,
  daterangeEnd: string,
  options?: { [key: string]: any },
) {
  return request<API.BaseOptionsListItem>('/api/project/app/version/', {
    method: 'GET',
    params: {appId: appId, daterangeBegin: daterangeBegin, daterangeEnd: daterangeEnd},
    ...(options || {}),
  });
}

/** 获取应用下的发布区域 */
export async function getAppRegion(
  appId: number,
  options?: { [key: string]: any },
) {
  return request<API.BaseOptionsListItem>('/api/project/app/region/', {
    method: 'GET',
    params: {appId: appId},
    ...(options || {}),
  });
}

/** 获取某一个上线清单数据 */
export async function getDeployReqById(
  deployReqId?: number,
  options?: { [key: string]: any },
) {
  return request<API.ReqInitialValuesRes>('/api/deploy/req/' + deployReqId, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 修改上线清单 */
export async function updateDeployReq(
  deployReqId: number,
  body: API.CreateDeployReqBody,
  options?: { [key: string]: any },
) {
  return request<API.CreateDeployReqRes>('/api/deploy/req/' + deployReqId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
