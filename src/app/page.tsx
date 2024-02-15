import ExcelReader from '@/app/components/excel-reader';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import faker from 'faker';
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);
const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
const data = {
  datasets: [
    {
      label: 'Red dataset',
      data: Array.from({ length: 50 }, () => ({
        x: faker.datatype.number({ min: -100, max: 100 }),
        y: faker.datatype.number({ min: -100, max: 100 }),
        r: faker.datatype.number({ min: 5, max: 20 }),
      })),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Blue dataset',
      data: Array.from({ length: 50 }, () => ({
        x: faker.datatype.number({ min: -100, max: 100 }),
        y: faker.datatype.number({ min: -100, max: 100 }),
        r: faker.datatype.number({ min: 5, max: 20 }),
      })),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

const MyApp = () => {
  return (
    <div>
      <h1>Upload and Read Excel File</h1>
      <ExcelReader />

      <Bubble options={options} data={data} />;
    </div>
  );
};

export default MyApp;
