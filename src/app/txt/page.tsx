"use client";
import { useEffect, useState } from 'react';

import TableComponent from '@/app/components/table';
import { Space, Spin } from 'antd';
import TxtReader from '../components/txt-reader';


const MyApp = () => {
  const [dataBuffer, setDataBuffer] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className='p-10'>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Spin spinning={loading} >
          <TxtReader setLoading={setLoading} setDataBuffer={setDataBuffer} />

          {dataBuffer && dataBuffer.map((data) => {
            return <TableComponent dataTable={data} />
          })}
        </Spin>
      </Space>
    </div >
  );
};

export default MyApp;
