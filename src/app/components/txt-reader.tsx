'use client';

import React, {ChangeEvent} from 'react';
import {DataTypeTable} from '@/app/components/table';
import {groupBy, last, max, min} from 'lodash';

interface Props {
  setDataBuffer: (value: any) => void;
  setLoading: (value: boolean) => void;
}

enum TradeStatus {
  Pending = 3, // File Virtual thì không có tác dụng. File CommandTrade thì tương ứng là chưa bắt đầu chuỗi
  Start = 0,   // File Virtual thì lệnh được mở. File CommandTrade thì tương ứng bắt đầu chuỗi
  Win = 1,     // File Virtual thì lệnh win. File CommandTrade thì tương ứng kết thúc chuỗi reset về Pending
  Loss = 2,    // File Virtual thì lệnh loss. File CommandTrade thì tương ứng chuỗi thua, xử lý input x2 lot hoặc khi RR = 0 thì reset về Pending
}

enum BuysellProperty {
  Buy = '1',
  Sell = '2',
  Pending = '0',
}

interface DataTypeTxt {

  Status: TradeStatus;
  BuySell: BuysellProperty;
  Entry: number;
  Sl: number;
  Tp: number;
  StartTime: Date;
  EndTime: Date;
  Ticket: number;
  SignalNumber: number;
  RR: number;
  SignalName: string;
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
      Status: content[0] == '1' ? true : false,
      orderType: content[1] == '1' ? 'Buy' : 'Sell',
      entry: parseFloat(content[2]),
      sl: parseFloat(content[3]),
      tp: parseFloat(content[4]),
      start: new Date(content[5]),
      end: new Date(content[6]),
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
const TxtReader: React.FC<Props> = ({setDataBuffer, setLoading}) => {


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
      const count = 15;
      const rr: any = data.reduce((acc: any, element: any, index, arr) => {
        const result = arr.slice(index, index + count);
        if (index + count >= arr.length) {
          return acc;
        }

        const totalRR = result.reduce((acc: any, element: any) => {
          const r = element.result ? 1 : -3;
          return acc + r;
        }, 0);

        acc.push(totalRR);
        return acc;
      }, []).filter((i: any) => i < -15).length;
      console.log(rr);
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
    };

    reader.readAsText(file); // Đọc nội dung file dưới dạng văn bản
  }


  return (
    <input type="file" accept=".txt" multiple={true} onChange={(e) => handleFileChange(e)}/>
  );
};

export default TxtReader;
