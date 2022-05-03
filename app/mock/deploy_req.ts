/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2022-04-23 21:45:35
 * @LastEditors: sueRimn
 * @LastEditTime: 2022-05-03 08:19:20
 */

import { Request, Response } from 'express';
import moment from 'moment';
import { parse } from 'url';

// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: API.DeployReqListItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      key: index,
      id: index,
      name: `上线单 ${index}`,
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function fetchDeployReq(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query as unknown as API.PageParams &
    API.RuleListItem & {
      sorter: any;
      filter: any;
    };

  let dataSource = [...tableListDataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );
  if (params.sorter) {
    const sorter = JSON.parse(params.sorter);
    dataSource = dataSource.sort((prev, next) => {
      let sortNumber = 0;
      Object.keys(sorter).forEach((key) => {
        if (sorter[key] === 'descend') {
          if (prev[key] - next[key] > 0) {
            sortNumber += -1;
          } else {
            sortNumber += 1;
          }
          return;
        }
        if (prev[key] - next[key] > 0) {
          sortNumber += 1;
        } else {
          sortNumber += -1;
        }
      });
      return sortNumber;
    });
  }
  if (params.filter) {
    const filter = JSON.parse(params.filter as any) as {
      [key: string]: string[];
    };
    if (Object.keys(filter).length > 0) {
      dataSource = dataSource.filter((item) => {
        return Object.keys(filter).some((key) => {
          if (!filter[key]) {
            return true;
          }
          if (filter[key].includes(`${item[key]}`)) {
            return true;
          }
          return false;
        });
      });
    }
  }

  if (params.name) {
    dataSource = dataSource.filter((data) => data?.name?.includes(params.name || ''));
  }
  const result = {
    data: dataSource,
    total: tableListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.current}`, 10) || 1,
  };

  return res.json(result);
}

function createDeployReq(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;

  const result = {
    success: true,
    message: ""
  };

  res.json(result);
}

function updateDeployReq(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  console.log(body);

  const result = {
    success: true,
    message: ""
  };

  res.json(result);
}

function getProjectAll(req: Request, res: Response, u: string, b: Request) {
  const result = {
    total: 3,
    data: [
      {'id': 1, "name": 'p1'},
      {'id': 2, "name": 'p2'},
      {'id': 3, "name": 'p3'},
    ],
    success: true
  };
  res.json(result);
}

function getProjectApp(req: Request, res: Response, u: string, b: Request) {
  const body = (b && b.body) || req.body;
  const { pid } = req.query;

  var data = [
    {id: 3, name: "app_default"},
  ]
  switch(pid) {
    case "1":
      data = [
        {id: 1, name: "app1"},
        {id: 2, name: "app2"}
      ]
      break;
    case "2":
      data = [
        {id: 4, name: "app4"},
        {id: 5, name: "app5"}
      ]
      break;
    case "3":
      data = [
        {id: 6, name: "app6"},
        {id: 7, name: "app7"}
      ]
      break;
    default:
      break;
  }
  const result = {
    total: data.length,
    data: data,
    success: true
  };
  res.json(result);
}

function getAppVersion(req: Request, res: Response, u: string, b: Request) {
  const body = (b && b.body) || req.body;
  const { appId, daterangeBegin, daterangeEnd } = req.query;

  var data = [
    {id: 3, name: "v3"},
  ]
  switch(appId) {
    case "1":
      data = [
        {id: 1, name: "v1"+daterangeBegin+"---"+daterangeEnd},
        {id: 2, name: "v2"}
      ]
      break;
    case "2":
      data = [
        {id: 4, name: "v4"},
        {id: 5, name: "v5"}
      ]
      break;
    case "3":
      data = [
        {id: 6, name: "v6"},
        {id: 7, name: "v7"}
      ]
      break;
    case "4":
      data = [
        {id: 8, name: "v8"},
        {id: 9, name: "v9"}
      ]
      break;
    case "5":
      data = [
        {id: 10, name: "v10"},
        {id: 11, name: "v11"}
      ]
      break;
    default:
      break;
  }
  const result = {
    total: data.length,
    data: data,
    success: true
  };
  res.json(result);
}

function getAppRegion(req: Request, res: Response, u: string, b: Request) {
  const body = (b && b.body) || req.body;
  const { appId } = req.query;

  var data = [
    {id: 1, name: "region01"},
    {id: 2, name: "region02"},
  ]
  
  const result = {
    total: data.length,
    data: data,
    success: true
  };
  res.json(result);
}

function getDeployReqById(req: Request, res: Response, u: string, b: Request) {
  var data = {
    "deploy_req_id": 1,
    "deploy_time": "2022-05-02 17:20:20",
    "deploy_type": "1111",
    "sql_req_id": "111",
    "deploy_req_data": [
      {
        "id": 1,
        "key": 1,
        "project": {"id": 1, "name": "n1"},
        "app": {"id": 1, "name": "app1"},
        "version": {"id": 1, "name": "v1"},
        "create_time": "2022-02-03 22:22:22",
        "state": "未发布",
        "has_sq": false,
        "region": {"id": 1, "name": "region01"},
      }
    ]
  };
  
  const result = {
    data: data,
    success: true
  };
  res.json(result);
}

export default {
  'GET /api/deploy/req': fetchDeployReq,
  'POST /api/deploy/req': createDeployReq,
  'PUT /api/deploy/req': updateDeployReq,
  'GET /api/project/all': getProjectAll,
  'GET /api/project/app': getProjectApp,
  'GET /api/project/app/version': getAppVersion,
  'GET /api/project/app/region': getAppRegion,
  'GET /api/deploy/req/*/': getDeployReqById,
  'PUT /api/deploy/req/*/': updateDeployReq,
};
