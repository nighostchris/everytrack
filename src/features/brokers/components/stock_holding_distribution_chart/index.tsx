import clsx from 'clsx';
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Cell, Pie, PieChart, Sector, ResponsiveContainer } from 'recharts';

import { StockHoldingDistributionData } from '../../hooks/use_brokers_state';

interface StockHoldingDistributionChartProps {
  data: StockHoldingDistributionData[];
  className?: string;
}

export const StockHoldingDistributionChart: React.FC<StockHoldingDistributionChartProps> = ({ data, className }) => {
  const { displayCurrency } = useOutletContext<{ displayCurrency: string }>();
  const [distributionChartIndex, setDistributionChartIndex] = React.useState<number>(0);

  return (
    // TODO: mobile screen
    <div className={clsx('h-full w-full p-6 pt-0', className)}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={100}
            dataKey="percentage"
            activeIndex={distributionChartIndex}
            onMouseEnter={(_, index) => setDistributionChartIndex(index)}
            activeShape={(props) => {
              const RADIAN = Math.PI / 180;
              const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, name, balance, percentage } = props;
              const sin = Math.sin(-RADIAN * midAngle);
              const cos = Math.cos(-RADIAN * midAngle);
              const sx = cx + (outerRadius + 10) * cos;
              const sy = cy + (outerRadius + 10) * sin;
              const mx = cx + (outerRadius + 30) * cos;
              const my = cy + (outerRadius + 30) * sin;
              const ex = mx + (cos >= 0 ? 1 : -1) * 22;
              const ey = my;
              const textAnchor = cos >= 0 ? 'start' : 'end';

              return (
                <g>
                  <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#000000">
                    {payload.name}
                  </text>
                  <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                  />
                  <Sector
                    cx={cx}
                    cy={cy}
                    fill={fill}
                    endAngle={endAngle}
                    startAngle={startAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                  />
                  <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                  <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                  <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
                    {name}
                  </text>
                  <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`${displayCurrency} ${balance} (${percentage}%)`}
                  </text>
                </g>
              );
            }}
          >
            {data.map(({ color }) => (
              <Cell fill={color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockHoldingDistributionChart;
