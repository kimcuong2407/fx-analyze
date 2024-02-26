'use client';

import React, { ChangeEvent } from 'react';
import { DataTypeTable } from '@/app/components/table';
import { groupBy, last } from 'lodash';

interface Props {
    setDataBuffer: (value: any) => void;
    setLoading: (value: boolean) => void;
}

interface DataTypeTxt {
    result: boolean;
    orderType: string;
    entry: number;
    sl: number;
    tp: number;
    start: Date;
    end: Date | null;
}
const textToJson = (text: string): string[][] => {
    const parts = text.split('\r\n');

    return parts.map((part) => {
        return part.split('-');
    });
}

const convertData = (contents: string[][]): DataTypeTxt[] => {
    return contents.map((content) => {

        return {
            result: content[0] == '1' ? true : false,
            orderType: content[1] == '1' ? 'Buy' : 'Sell',
            entry: parseFloat(content[2]),
            sl: parseFloat(content[3]),
            tp: parseFloat(content[4]),
            start: new Date(parseInt(content[5]) * 1000),
            end: content[5] ? new Date(parseInt(content[6]) * 1000) : null,
        }
    });
}

const calculateRepeat = (data: string): { [key: string]: number } => {
    const stringFind = '2222';
    const lengthStr = stringFind.length;
    const numberCharCheck = 7;
    let result = data;
    const resultArr: string[] = [];
    while (result.indexOf(stringFind) >= 0) {
        const index = result.indexOf(stringFind);
        const subString = result.substring(index + lengthStr, index + lengthStr + numberCharCheck);
        resultArr.push(subString);
        result = result.slice(index + 1, result.length);

    }
    const a = resultArr.map((item) => {
        return item
    })

    return {
        "hello": 1,
    };

}
const TxtReader: React.FC<Props> = ({ setDataBuffer, setLoading }) => {


    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {

        const file = event.target.files ? event.target.files[0] : null;

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const text = e.target?.result;
            const results: string[][] = textToJson(text as string);
            const data = convertData(results);
            const dataBufferTxt: DataTypeTable[] = data.reduce((acc: DataTypeTable[], element: DataTypeTxt) => {
                if (acc.length === 0) {
                    const r: DataTypeTable = {
                        streakCount: 1,
                        isWin: element.result,
                        count: 0,
                    };
                    acc.push(r);
                    return acc;
                }
                const findLastElement: DataTypeTable | undefined = last(acc);
                if (findLastElement?.isWin == element.result) {
                    findLastElement.streakCount += 1;
                } else {
                    acc.push({
                        streakCount: 1,
                        isWin: element.result,
                        count: 0,
                    });
                }
                return acc
            }, []).reduce((acc: DataTypeTable[], element: DataTypeTable) => {
                const findTotal: DataTypeTable | undefined = acc.find(
                    (el: DataTypeTable) => {
                        return el.streakCount == element.streakCount && el.isWin == element.isWin
                    }
                );
                if (findTotal) {
                    findTotal.count = findTotal.count ? findTotal.count + 1 : 1;
                } else {
                    acc.push({
                        streakCount: element.streakCount,
                        isWin: element.isWin,
                        count: 1,
                    });
                }
                return acc;
            }, []);
            const r = groupBy(dataBufferTxt, (i: DataTypeTable) => {
                return i.streakCount && i.isWin;
            });
            const rBuffer: any = Object.keys(r).map((key) => {
                return r[key].reduce((acc: DataTypeTable[], element: DataTypeTable) => {
                    const result: DataTypeTable | undefined = acc.find((el: DataTypeTable) => el.streakCount == element.streakCount);
                    if(!result) {
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
        };

        reader.readAsText(file); // Đọc nội dung file dưới dạng văn bản
    }


    return (
        <input type="file" accept=".txt" multiple={true} onChange={(e) => handleFileChange(e)} />
    );
};

export default TxtReader;
