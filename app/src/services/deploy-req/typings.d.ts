/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2022-04-23 21:55:49
 * @LastEditors: sueRimn
 * @LastEditTime: 2022-05-03 08:11:03
 */
// @ts-ignore
/* eslint-disable */

declare namespace API {

  /* 上线单列表行数据结构 */
  type DeployReqListItem = {
    key?: number;
    id?: number;
    name?: string;
  };

  type DeployReqList = {
    data?: DeployReqListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  /* 项目数据结构 */
  type ProjectListItem = {
    id?: number;
    name?: string;
  }

  type ProjectList = {
    data: ProjectListItem[];
    total: number;
    success: boolean;
  }

  /* 选择框下拉菜单数据结构 */
  type BaseOptionsListItem = {
    data: BaseOptionsItem[];
    total: number;
    success: boolean;
  }

  type BaseOptionsItem = {
    id: number;
    name: string;
  }

  type CreateDeployReqRes = {
    success: boolean;
    message: string;
  }

  type DeployReqItemType = {
    id?: number;
    key?: string;
    project?: {id: number, name: string};
    app?: {id: number, name: string};
    version?: {id: number, name: string};
    create_time?: string;
    state?: string;
    creater?: string;
    has_sql?: boolean;
    region?: {id: number, name: string};
  }

  type CreateDeployReqBody = {
    deploy_time: string;
    deploy_type: string;
    sql_req_id: string;
    deploy_req_id: number;
    deploy_req_data: DeployReqItemType[];
  }

  type ReqInitialValues = {
    deploy_time: moment.Moment;
    deploy_type: string;
    sql_req_id: string;
  }

  type ReqInitialValuesRes = {
    success: boolean;
    data: CreateDeployReqBody
  }
}
