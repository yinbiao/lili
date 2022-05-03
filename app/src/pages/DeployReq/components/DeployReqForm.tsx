/*
 * @Descripttion: 
 * @version: 
 * @Author: yinbiao
 * @Date: 2022-05-01 09:32:16
 * @LastEditors: sueRimn
 * @LastEditTime: 2022-05-03 09:30:40
 */
import React, { useEffect, useState } from 'react';
import { Form, Card, Input, Row, Col, Table, Modal, Select, DatePicker, Checkbox, message, Space, Button } from 'antd';
import { useIntl } from 'umi';
import moment from 'moment';
import type { ProColumns } from '@ant-design/pro-table';
import { DragSortTable } from '@ant-design/pro-table';
import { MenuOutlined } from '@ant-design/icons';
import { 
  fetchAllProject, 
  getAppVersion, 
  getProjectApp, 
  getAppRegion, 
  createDeployReq, 
  updateDeployReq, 
  getDeployReqById 
} from '@/services/deploy-req/api';
import { getNameFromOptions } from '@/utils/func';

const { RangePicker } = DatePicker;


export type DeployReqFormProps = {
  onSubmit: () => void;
  // reqInitialValues?: API.CreateDeployReqBody;
  visible?: boolean;
  deployReqId?: number;
};



const DeployReqForm: React.FC<DeployReqFormProps> = (props) => {
  const intl = useIntl();
  const {onSubmit, visible, deployReqId} = props;
  let reqInitialValues: API.ReqInitialValues = {
    deploy_time: moment(),
    deploy_type: "",
    sql_req_id: ""
  };
  const [deployReqData, setDeployReqData] = useState<API.DeployReqItemType[]>([]);
  const [showDeployReqModal, setShowDeployReqModal] = useState<boolean>(false);
  const [projects, setProjects] = useState<API.BaseOptionsItem[]>([]);
  const [apps, setApps] = useState<API.BaseOptionsItem[]>([]);
  const [versions, setVersions] = useState<API.BaseOptionsItem[]>([]);
  const [regions, setRegions] = useState<API.BaseOptionsItem[]>([]);
  const dateFormat = 'YYYY-MM-DD';
  const imageTimeBegin = moment().subtract(7, 'day');
  const imageTimeEnd = moment();
  const [addDeployReqForm] = Form.useForm();
  const [createForm] = Form.useForm();

  useEffect(()=>{
    if(showDeployReqModal) {
      fetchAllProject().then((res) => {
        setProjects(res.data);
      })
    }
  }, [showDeployReqModal])

  useEffect(()=>{
    if(visible) {
      if(deployReqId) {
        getDeployReqById(deployReqId).then((res)=>{
          setDeployReqData(res.data.deploy_req_data);
          createForm.setFieldsValue({
            deploy_time: moment(res.data.deploy_time),
            deploy_type: res.data.deploy_type,
            sql_req_id: res.data.sql_req_id
          });
        });
      }
    }else{
      createForm.resetFields();
      setDeployReqData([]);
    }
  }, [visible])

  const onAddDeployReq = () => {
    setShowDeployReqModal(true);
  }

  const _checkDeployReqExist = (_reqItem: API.DeployReqItemType) => {
    for(let item of deployReqData) {
      if(_reqItem.key == item.key) {
        return true;
      }
    }
    return false;
  }

  const doAddDeployReq = () => {
    addDeployReqForm.validateFields().then((values) => {
      const _reqItem = {
        'id': -1,
        'key': values.project + "-" + values.app + "-" + values.version,
        "project": {
          "id": values.project,
          "name": getNameFromOptions(values.project, projects)
        },
        "app": {
          "id": values.app,
          "name": getNameFromOptions(values.app, apps)
        },
        "version": {
          "id": values.version,
          "name": getNameFromOptions(values.version, versions)
        },
        "region": {
          "id": values.region,
          "name": getNameFromOptions(values.region, regions)
        },
        "creater": "",
        "state": values.version,
        "has_sql": values.has_sql
      };
      if(_checkDeployReqExist(_reqItem)) {
        message.warning("该应用的版本号已经添加");
      }else{
        const _deployReqData: API.DeployReqItemType[] = [_reqItem];
        for(let item of deployReqData) {
          _deployReqData.push(item);
        }
        setDeployReqData(_deployReqData);
        setShowDeployReqModal(false);
      }
    })
    
  }

  const onRemoveDeployReq = (_reqItem: API.DeployReqItemType) => {
    const _deployReqData = deployReqData;
    const index = _deployReqData.indexOf(_reqItem);
    if(index>-1) {
      _deployReqData.splice(index, 1);
    }
    const _newData = [];
    for(let item of _deployReqData) {
      _newData.push(item);
    }
    setDeployReqData(_newData);
  }

  const onProjectChange = (pid: number) => {
    addDeployReqForm.resetFields(["app", "version"]);
    getProjectApp(pid).then((res) => {
      setApps(res.data);
    })
  }

  const onAppChange = (appId: number) => {
    addDeployReqForm.resetFields(["version"]);
    const image_range_time = addDeployReqForm.getFieldValue("image_range_time");
    const daterangeBegin = image_range_time[0].format(dateFormat);
    const daterangeEnd = image_range_time[1].format(dateFormat);
    getAppVersion(appId, daterangeBegin, daterangeEnd).then((res) => {
      setVersions(res.data);
    })
    getAppRegion(appId).then((res) => {
      setRegions(res.data);
    })
  }

  const onRangeTimeChange = (rangeDate: any) => {
    const daterangeBegin = rangeDate[0].format(dateFormat);
    const daterangeEnd = rangeDate[1].format(dateFormat);
    const appId = addDeployReqForm.getFieldValue("app");
    if(appId) {
      getAppVersion(appId, daterangeBegin, daterangeEnd).then((res) => {
        setVersions(res.data);
      })
    }
  }

  const doCreate = () => {
    /**
     * 创建上线单
     */
    createForm.validateFields().then((values)=>{
      if(deployReqData.length==0) {
        message.warning("还没有添加任何上线清单");
      }else{
        const deploy_time = values.deploy_time.format("YYYY-MM-DD HH:mm:ss");
        const body = {...values, deploy_time: deploy_time, deploy_req_data: deployReqData};
        if(deployReqId) {
          updateDeployReq(deployReqId, body).then((res)=>{
            if(res.success) {
              message.success("修改成功")
            }else{
              message.error(res.message);
            }
          })
        }else{
          createDeployReq(body).then((res)=>{
            if(res.success) {
              message.success("创建成功")
            }else{
              message.error(res.message);
            }
          })
        }
        onSubmit();
      }
    })
  }

  const deployReqColumns: ProColumns[] = [
    {
      title: '排序',
      dataIndex: 'sort',
      // render: (dom, rowData, index) => {
      //   return <span className="customRender">{`${index}`}</span>;
      // },
    },
    {
      title: '项目名称',
      dataIndex: 'project',
      render: (dom, rowData, index) => rowData.project.name,
    },
    {
      title: '应用名称',
      dataIndex: 'app',
      render: (dom, rowData, index) => rowData.app.name,
    },
    {
      title: '版本号',
      dataIndex: 'version',
      render: (dom, rowData, index) => rowData.version.name,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '版本状态',
      dataIndex: 'state',
    },
    {
      title: '创建人',
      dataIndex: 'creater',
    },
    {
      title: '是否有SQL',
      dataIndex: 'has_sql',
      render: (dom, rowData, index) => {
        if(rowData.has_sql) {
          return <span>有</span>;
        }else{
          return <span>没有</span>;
        }
      }
    },
    {
      title: '发布区域',
      dataIndex: 'region',
      render: (dom, rowData, index) => rowData.region.name,
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (dom, rowData, index) => (
        <Space size="middle">
          <Button danger onClick={()=> {onRemoveDeployReq(rowData)}}>删除</Button>
        </Space>
      )
    }
  ];

  const handleDragSortEnd2 = (newDataSource: any) => {
    setDeployReqData(newDataSource);
    message.success('修改列表排序成功');
  };

  const dragHandleRender = (rowData: any, idx: any) => (
    <>
      <MenuOutlined style={{ cursor: 'grab', color: 'gold' }} />
      &nbsp;{idx}
    </>
  );

  return (
    <>
    <Form 
      name="create_deploy_req" 
      form={createForm} 
      // initialValues={{deploy_type: reqInitialValues.deploy_type}}
    >
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card title="基础信息">
          <Row gutter={24}>
            <Col span={8} key="deploy_time">
              <Form.Item
                label="上线时间"
                name="deploy_time"
                rules={[{ required: true, message: '上线时间' }]}
              >
                <DatePicker showTime />
              </Form.Item>
            </Col>

            <Col span={8} key="deploy_type">
              <Form.Item
                label="发布类型"
                name="deploy_type"
                rules={[{ required: true, message: '发布类型' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8} key="sql_req_id">
              <Form.Item
                label="SQL工单ID"
                name="sql_req_id"
                rules={[{ required: true, message: 'SQL工单ID' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>  
        </Card>

        <Card title="发布清单" extra={<Button type="primary" onClick={onAddDeployReq}>添加发布清单</Button>}>
          <DragSortTable
            headerTitle=""
            options={false}
            columns={deployReqColumns}
            rowKey="key"
            search={false}
            pagination={false}
            dataSource={deployReqData}
            dragSortKey="sort"
            dragSortHandlerRender={dragHandleRender}
            onDragSortEnd={handleDragSortEnd2}
          />
        </Card>

        <Row gutter={24}>
          <Col span={24} key="action" offset={21}>
            {deployReqId ? (
              <Button type="primary" onClick={doCreate}>修改上线单</Button>
            ) : (
              <Button type="primary" onClick={doCreate}>创建上线单</Button>
            )}
          </Col>
        </Row>
      </Space>
    </Form>

    <Modal
    title="添加发布清单"
    centered
    visible={showDeployReqModal}
    onOk={doAddDeployReq}
    onCancel={() => {setShowDeployReqModal(false);}}
    width={1000}
    >
    <Form
      name="basic"
      form={addDeployReqForm}
      initialValues={{ image_range_time: [imageTimeBegin, imageTimeEnd] }}
      autoComplete="off"
    >
      <Form.Item
        label="选择镜像时间"
        name="image_range_time"
        rules={[{ type: 'array' as const, required: true, message: '请选择镜像时间!' }]}
      >
        <RangePicker onChange={onRangeTimeChange} format={dateFormat} />
      </Form.Item>

      <Form.Item
        label="项目"
        name="project"
        rules={[{ required: true, message: '请选择项目!' }]}
      >
        <Select
          showSearch
          placeholder=""
          optionFilterProp="children"
          onChange={onProjectChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          options={projects.map((item)=>{ return {"label": item.name, "value": item.id}})}
        >
        </Select>
      </Form.Item>

      <Form.Item
        label="应用"
        name="app"
        rules={[{ required: true, message: '请选择应用!' }]}
      >
        <Select
          showSearch
          placeholder=""
          optionFilterProp="children"
          onChange={onAppChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          options={apps.map((item)=>{ return {"label": item.name, "value": item.id}})}
        >
        </Select>
      </Form.Item>

      <Form.Item
        label="版本号"
        name="version"
        rules={[{ required: true, message: '请选择版本号!' }]}
      >
        <Select
          showSearch
          placeholder=""
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          options={versions.map((item)=>{ return {"label": item.name, "value": item.id}})}
        >
        </Select>
      </Form.Item>

      <Form.Item
        label="发布区域"
        name="region"
        rules={[{ required: true, message: '请选择发布区域!' }]}
      >
        <Select
          showSearch
          placeholder=""
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          options={regions.map((item)=>{ return {"label": item.name, "value": item.id}})}
        >
        </Select>
      </Form.Item>

      <Form.Item
        name="has_sql"
        valuePropName="checked"
      >
        <Checkbox>
          是否有SQL
        </Checkbox>
      </Form.Item>

    </Form>
    </Modal>
  </>
  );
};

export default DeployReqForm;
