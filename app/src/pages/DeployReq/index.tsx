/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2022-04-23 11:54:22
 * @LastEditors: sueRimn
 * @LastEditTime: 2022-05-03 08:23:46
 */
import React, { useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Form, Card, Input, Row, Col, Tabs, Drawer, Button } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { fetchDeployReq, getDeployReqById } from '@/services/deploy-req/api';
import DeployReqForm from './components/DeployReqForm';
import { values } from 'lodash';
import moment from 'moment';


const { TabPane } = Tabs;

const AddDeployReq: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const [showAddReq, setShowAddReq] = useState<boolean>(false);
  const [deployReqId, setDeployReqId] = useState<number>();
  const [reqInitialValues, setReqInitialValues] = useState<API.CreateDeployReqBody>();

  const columns: ProColumns<API.DeployReqListItem>[] = [
    {
      title: "名称",
      dataIndex: 'name',
      tip: 'The rule name is the unique key'
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            // getDeployReqById(record.id).then((res)=>{
            //   setReqInitialValues(res.data);
            // });
            setDeployReqId(record.id);
            setShowAddReq(true);
         }}>
          修改
        </a>,
      ],
    },
  ];

  const onCreateDeployReq = () => {
    setShowAddReq(false);
  }

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle="上线单"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setShowAddReq(true);
              setDeployReqId(undefined);
            }}
          >
            <PlusOutlined /> 创建上线单
          </Button>,
        ]}
        request={fetchDeployReq}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      <Drawer
        width={1200}
        visible={showAddReq}
        onClose={() => {
          setDeployReqId(undefined);
          setShowAddReq(false);
        }}
        closable={false}
      >
        <DeployReqForm 
          onSubmit={onCreateDeployReq}
          // reqInitialValues={reqInitialValues}
          deployReqId={deployReqId}
          visible={showAddReq}
        />
      </Drawer>
    </PageContainer>
  );
};

export default AddDeployReq;
