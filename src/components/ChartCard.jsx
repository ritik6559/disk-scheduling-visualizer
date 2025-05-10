import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const ChartCard = ({ title, description, children, className = '' }) => {
    return (
        <Card className={`bg-gray-900/70 backdrop-blur-sm ${className} text-white`}>
            <CardHeader className="pb-2">
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};

export default ChartCard;
