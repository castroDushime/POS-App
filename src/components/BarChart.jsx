import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', uv: 8000, pv: 2000, amt: 8000 },
    { name: 'Feb', uv: 2000, pv: 5000, amt: 8000 },
    { name: 'Mar', uv: 2000, pv: 500, amt: 7000 },
    { name: 'Apr', uv: 1000, pv: 500, amt: 1000 },
    { name: 'May', uv: 9000, pv: 7000, amt: 5000 },
    { name: 'Jun', uv: 8000, pv: 6000, amt: 4000 },
    { name: 'Jul', uv: 7000, pv: 5000, amt: 3000 },
]

const CustomLegend = () => {
    return (
        <ul className="custom-legend">
            <li><span className="legend-icon text-muted" style={{ backgroundColor: '#8252ED',borderRadius:'20px' }}></span>Income</li>
            <li><span className="legend-icon text-muted" style={{ backgroundColor: '#5EAFED' }}></span> Expense</li>
        </ul>
    );
};

const BarCharts = () => {
    return (

    <div className="card tw-border-gray-100 tw-border-2">
        <div className="card-body">
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend content={<CustomLegend />} />
                    <Bar dataKey="uv" stackId="a" fill="#8252ED" className="tw-shadow-inner"/>
                    <Bar dataKey="amt" stackId="a" fill="#5EAFED" radius={[10, 10, 0, 0]}/>
                </BarChart>
            </ResponsiveContainer>        </div>
    </div>
)
    ;
};

export default BarCharts;