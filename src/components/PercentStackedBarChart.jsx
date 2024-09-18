import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { TbDots } from 'react-icons/tb';

const data = [
    { name: 'Ahsan Tapdar', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Koyes Ahmed', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Group C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Group D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Group E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Group F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Group G', uv: 3490, pv: 4300, amt: 2100 },
];

const CustomLegend = () => {
    return (
        <ul className="custom-legend">
            <li><span className="legend-icon text-muted" style={{ backgroundColor: '#8252ED',borderRadius:'20px' }}></span> Task Completed</li>
            <li><span className="legend-icon text-muted" style={{ backgroundColor: '#5EAFED' }}></span> Presence</li>
            <li><span className="legend-icon text-muted" style={{ backgroundColor: '#5ab7ad' }}></span> Completed Meeting</li>
        </ul>
    );
};

const PercentStackedBarChart = () => {
    return (
        <div className="card tw-border-gray-100 h-100 tw-border-2">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <h5>Employee Performance Ratings</h5>
                    <button className="btn border-0">
                        <TbDots />
                    </button>
                </div>
                <div className="d-flex gap-2 align-items-center">
                    <span className="fw-bold tw-text-2xl">98%</span>
                    <p className="tw-text-xs my-0 tw-text-gray-400">
                        At Tur.Agency, we're proud of our employees' consistency, punctuality, and quality work
                    </p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} layout="vertical" margin={{ top: 20, right: 10, left: 0, bottom: 5 }} barGap={10} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" className="tw-text-xs tw-tracking-wide" dataKey="name" />
                        <Tooltip />
                        <Legend content={<CustomLegend />} />
                        <Bar dataKey="uv" stackId="a" fill="#8252ED" radius={[0, 20, 20, 0]} />
                        <Bar dataKey="pv" stackId="a" fill="#5EAFED" radius={[20, 20, 20, 20]} />
                        <Bar dataKey="amt" stackId="a" fill="#5ab7ad" radius={[20, 20, 20, 20]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PercentStackedBarChart;