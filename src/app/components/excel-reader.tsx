'use client';

import React from 'react';
import * as XLSX from 'xlsx';
import { last, includes, split, groupBy } from 'lodash';
import { DataTypeTable } from './table';
const pairs = [
    'NZDCAD',
    'NDZUSD',
    'AUDNZD',
    'AUDJPY',
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
    'USDCAD',
    'AUDUSD',
    'XAUUSD',
];
interface Props {
    setDataBuffer: (value: any) => void;
    setLoading: (value: boolean) => void;
}

const ExcelReader: React.FC<Props> = ({ setDataBuffer, setLoading }) => {

    const handleFile = (e: any) => {
        setLoading(true);

        const files = Array.from(e.target.files);
        Promise.all(
            files.map((file: any) => {
                return new Promise((resolve) => {
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
                        const data: (string | number)[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
                        // update state
                        let insert = false;
                        data.forEach((res: any, keyDataIndex: number) => {
                            if (includes(res, 'Deals')) {
                                insert = true;
                            }
                            if (insert && pairs.includes(split(res[2], '.')[0])) {
                                if (includes(last(res as string[]), 'EA')) {
                                    res.keyDataIndex = keyDataIndex;
                                    result.push(res);
                                }
                            }
                        });
                        const buffer: DataTypeTable[] = result.reduce((acc: DataTypeTable[], element: any) => {
                            if (element.length > 12) {
                                element.isWin = includes(last(data[element['keyDataIndex'] + 1]) as unknown as string[], 'tp');
                            } else {
                                return acc;
                            }

                            if (acc.length > 0) {
                                const lastElement: DataTypeTable | undefined = last(acc);
                                if (lastElement && lastElement.isWin == element.isWin) {
                                    lastElement.streakCount += 1;
                                    return acc;
                                }
                            }
                            acc.push({
                                isWin: element.isWin,
                                streakCount: 1,
                                count: 0,
                            })
                            return acc;

                        }, []).reduce((acc: DataTypeTable[], element: DataTypeTable) => {

                            const findTotal: DataTypeTable | undefined = acc.find((el: DataTypeTable) => el.streakCount == element.streakCount && el.isWin == element.isWin);
                            if (findTotal) {
                                findTotal.count += 1;
                            } else {
                                const r: DataTypeTable = {
                                    streakCount: element.streakCount,
                                    isWin: element.isWin,
                                    count: 1,
                                }
                                acc.push(r);
                            }
                            return acc;
                        }, []);
                        resolve(buffer);

                    };
                    if (file) {
                        reader.readAsArrayBuffer(file);
                    }
                });
            })
        ).then((allData) => {
            const r = groupBy(allData.flat(), (i: DataTypeTable) => {
                return i.streakCount && i.isWin;
            });
            const rBuffer: any[] = Object.keys(r).map((key) => {
                return r[key].reduce((acc: any, element: any) => {
                    const result: DataTypeTable | undefined = acc.find((el: DataTypeTable) => el.streakCount == element.streakCount);
                    if (!result) {
                        const r: DataTypeTable = {
                            streakCount: element.streakCount,
                            isWin: element.isWin,
                            count: element.count,
                        };
                        acc.push(r);
                    } else {
                        result.count += element.count;
                    }
                    return acc;
                }, []);
            });
            setDataBuffer(rBuffer);

            // Tất cả các file đã được xử lý, cập nhật state
        });


        setLoading(false);
    };

    return (
        <input type="file" accept=".xlsx, .xls" multiple={true} onChange={(e) => handleFile(e)} />
    );
};

export default ExcelReader;
