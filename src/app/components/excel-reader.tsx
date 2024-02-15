'use client';

import React from 'react';
import * as XLSX from 'xlsx';

const pairs = [
    'NZDCAD',
    'NZDCHF',
    'NZDJPY',
    'NDZUSD',
    'AUDNZD',
    'EURNZD',
    'GBPNZD',
    'AUDJPY',
    'CADJPY',
    'CHFJPY',
    'EURJPY',
    'GBPJPY',
    'NZDJPY',
    'USDJPY',
    'GBPAUD',
    'GBPCAD',
    'GBPCHF',
    'GBPJPY',
    'GBPNZD',
    'GBPUSD',
    'EURGBP',
    'EURAUD',
    'EURCAD',
    'EURCHF',
    'EURGBP',
    'EURJPY',
    'EURNZD',
    'EURUSD',
    'AUDCHF',
    'CADCHF',
    'CHFJPY',
    'EURCHF',
    'GBPCHF',
    'NZDCHF',
    'USDCHF',
    'AUDCAD',
    'CADCHF',
    'CADJPY',
    'EURCAD',
    'GBPCAD',
    'NZDCAD',
    'USDCAD',
    'AUDCAD',
    'AUDCHF',
    'AUDJPY',
    'AUDNZD',
    'AUDUSD',
    'EURAUD',
    'GBPAUD',
];
const ExcelReader = () => {
    const handleFile = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt: any) => {
            // parse data
            const result: any = [];
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            // get first worksheet
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            // convert array of arrays
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            // update state
            data.forEach((res: any, keyDataIndex: number) => {
                Object.values(res).forEach((value: any, index: number) => {
                    if (pairs.includes(value)) {
                        result.push(res);
                    }
                });
            });
            console.log(result);
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <input type="file" accept=".xlsx, .xls" onChange={(e) => handleFile(e)} />
    );
};

export default ExcelReader;
