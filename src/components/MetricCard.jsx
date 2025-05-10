import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

const MetricCard= ({ title, value, unit = '', className = '' }) => {
    return (
        <Card className={`bg-gray-900/70 backdrop-blur-sm ${className} text-white`}>
            <CardHeader className="pb-2">
                <CardDescription className="text-gray-400">{title}</CardDescription>
                <CardTitle className="text-2xl flex items-baseline">
                    {value}
                    {unit && <span className="text-sm ml-1 text-gray-400">{unit}</span>}
                </CardTitle>
            </CardHeader>
        </Card>
    );
};

export default MetricCard;
