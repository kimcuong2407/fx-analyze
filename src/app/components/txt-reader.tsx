'use client';

import React, { ChangeEvent, ChangeEventHandler, useState } from 'react';

interface Props {
    setDataBuffer: (value: any) => void;
    setLoading: (value: boolean) => void;
}
interface Result {
    [key: string]: number;
}
const textToJson = (text: string): string => {
    const parts = text.split('\r\n');

    return parts.map((part) => {
        return part.split('-').filter((item, key) => key < 1);
    }).join('');
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
    // .reduce((acc: Result[], cur: string) => {
    //     const find: Result | undefined = acc.find((item) => item.value == cur);
    //     if (!find) {
    //         acc.push({
    //             value: parseInt(cur),
    //             count: 1
    //         });
    //     } else {
    //         find.count = find.count + 1;
    //     }
    //     return acc;
    // }, []);
    console.log(a);

    return {
        "hello": 1,
    };

}
const TxtReader: React.FC<Props> = ({ setDataBuffer, setLoading }) => {
    const [textFromFile, setTextFromFile] = useState<string>('');


    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {

        const file = event.target.files ? event.target.files[0] : null;

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const text = e.target?.result;
            const results = textToJson(text as string);
            console.log(results.split('').map((item) => item == '2' ? 'Lose' : 'Win').join(''));
            calculateRepeat(results);

        };

        reader.readAsText(file); // Đọc nội dung file dưới dạng văn bản
    }


    return (
        <input type="file" accept=".txt" multiple={true} onChange={(e) => handleFileChange(e)} />
    );
};

export default TxtReader;
