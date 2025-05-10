import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const AlgorithmCard= ({ title, description, selected, onClick }) => {
    return (
        <Card
            className={`cursor-pointer transition-all duration-300 h-full ${
                selected
                    ? 'border-2 border-cyan-500 bg-gradient-to-br from-gray-900/70 to-slate-900/90'
                    : 'hover:border-cyan-500/50 bg-gray-900/50 hover:bg-gray-900/70'
            }`}
            onClick={onClick}
        >
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-white">{title}</CardTitle>
                    {selected && <Badge className="bg-cyan-500 hover:bg-cyan-600">Selected</Badge>}
                </div>
                <CardDescription className="text-gray-400">{description}</CardDescription>
            </CardHeader>
        </Card>
    );
};

export default AlgorithmCard;
