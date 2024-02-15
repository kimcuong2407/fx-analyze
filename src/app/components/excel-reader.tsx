'use client';

import React from 'react';
import * as XLSX from 'xlsx';
import { has, get, last, includes } from 'lodash';
import { log } from 'console';
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

const OrderTypes = [
    'buy',
    'sell',
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
            let insert = false;
            data.forEach((res: any, keyDataIndex: number) => {
                if(includes(res, 'Deals')){
                    insert = true;
                }
                if(insert && pairs.includes(res[2])) {
                    if(includes(last(res), 'EA')){
                        res.keyDataIndex = keyDataIndex;
                        result.push(res);
                    }
                }
                
            });
            
            result.forEach((element: any) => {
                if (element.length > 12) {
                    element.isWin = includes(last(data[element['keyDataIndex'] + 1]), 'tp');
                }
            });
            console.log(result.length, result.filter((res: any) => res.isWin === true).length, result.filter((res: any) => res.isWin === false).length);
            console.log(result);
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <input type="file" accept=".xlsx, .xls" onChange={(e) => handleFile(e)} />
    );
};

export default ExcelReader;
