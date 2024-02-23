import clsx from 'clsx';
import React from 'react';
import { useDisplayCurrency } from '@hooks';
import { Cell, Pie, PieChart, Sector, ResponsiveContainer } from 'recharts';

import type { AssetDistributionData } from '../../hooks/use_dashboard_state';

interface AssetDistributionChartProps {
  data: AssetDistributionData[];
  className?: string;
}

export const AssetDistributionChart: React.FC<AssetDistributionChartProps> = ({ data, className }) => {
  const { symbol, error: displayCurrencyError } = useDisplayCurrency();
  const [distributionChartIndex, setDistributionChartIndex] = React.useState<number>(0);

  return (
    // TODO: mobile screen
    <div className={clsx('h-full w-full p-6 pt-0', className)}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={80}
            outerRadius={100}
            dataKey="percentage"
            activeIndex={distributionChartIndex}
            onMouseEnter={(_, index) => setDistributionChartIndex(index)}
            // TO FIX: do not use any type for props
            activeShape={(props: any) => {
              const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, name, amount, percentage } = props;
              return (
                <g>
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
                  <text x={cx} y={cy} dy={-14} textAnchor="middle" fill="#333" className="text-sm">
                    {name}
                  </text>
                  <text x={cx} y={cy} dy={6} textAnchor="middle" fill="#999" className="text-xs">
                    {`${symbol} ${amount}`}
                  </text>
                  <text x={cx} y={cy} dy={24} textAnchor="middle" fill="#999" className="text-xs">
                    {`${percentage}%`}
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

export default AssetDistributionChart;
