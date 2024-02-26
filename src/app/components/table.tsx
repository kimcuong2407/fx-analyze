import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

export interface DataTypeTable {
    streakCount: number;
    isWin: boolean;
    count: number;
}

interface Props {
    dataTable: DataTypeTable[];
}



const TableComponent: React.FC<Props> = ({ dataTable }) => {
    if (dataTable.length === 0) return (<></>);

    const totalCount = dataTable.reduce((acc, element) => acc + element.count, 0);

    const columns: TableProps<DataTypeTable>['columns'] = [
        {
            title: 'Chuỗi lệnh liên tiếp',
            dataIndex: 'streakCount',
            sorter: (a, b) => a.streakCount - b.streakCount,
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Số lần lặp lại chuỗi lệnh',
            dataIndex: 'count',
            sorter: (a, b) => a.count - b.count,
        },
        {
            title: 'Type',
            dataIndex: 'isWin',
            sorter: (a, b) => a.isWin ? 1 : -1,
            render: (isWin) => <>{isWin ? 'Win' : 'Lose'}</>,
        },
        {
            key: 'percent',
            title: 'Tỉ lệ',
            dataIndex: 'count',
            render: (text) => <>{((text / totalCount) * 100).toFixed(2)}%</>,
        }
    ];
    return <Table
        className='mt-10'
        key={Math.random().toString(36).substring(7)}
        columns={columns}
        dataSource={dataTable}
        pagination={false}
    />;
}

export default TableComponent;