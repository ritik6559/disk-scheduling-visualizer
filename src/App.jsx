import { useState, useRef, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ReferenceLine, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { fcfs, cscan, clook, look, scan, sstf } from './utils/index.js';
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {motion}  from "framer-motion";

import { AlertCircle, RefreshCw, ChartLine, BarChart as BarChartIcon } from "lucide-react";

import AlgorithmCard from './components/AlgorithmCard';
import MetricCard from './components/MetricCard';
import ChartCard from './components/ChartCard';
import SeekSequence from './components/SeekSequence';
import {toast} from "sonner";

const DiskSchedulingVisualizer = () => {
    const [algorithm, setAlgorithm] = useState('fcfs');
    const [diskSize, setDiskSize] = useState(200);
    const [headPosition, setHeadPosition] = useState(50);
    const [requests, setRequests] = useState('82, 170, 43, 140, 24, 16, 190');
    const [direction, setDirection] = useState('right');
    const [results, setResults] = useState(null);
    const [comparisonResults, setComparisonResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('config');

    const chartRef = useRef(null);

    const algorithmDescriptions = {
        fcfs: "Processes requests in the order they arrive, simple but not optimal.",
        sstf: "Selects the request closest to the current head position.",
        scan: "Moves in one direction, servicing requests until end, then reverses.",
        cscan: "Moves in one direction, jumps back to beginning when reaching the end.",
        look: "Like SCAN but only goes as far as the last request in each direction.",
        clook: "Like C-SCAN but only goes as far as the last request in each direction."
    };

    // Custom chart colors
    const chartColors = {
        primary: '#06b6d4', // cyan-500
        secondary: '#8b5cf6', // violet-500
        reference: '#f43f5e', // rose-500
        comparison: {
            fcfs: '#06b6d4', // cyan-500
            sstf: '#8b5cf6', // violet-500
            scan: '#10b981', // emerald-500
            cscan: '#f59e0b', // amber-500
            look: '#3b82f6', // blue-500
            clook: '#ec4899', // pink-500
        }
    };

    // Validation function
    const validateInput = () => {
        try {
            const requestArray = requests.split(',').map(r => parseInt(r.trim()));
            const validRequests = requestArray.every(r => !isNaN(r) && r >= 0 && r < diskSize);
            if (!validRequests) {
                setError(`Requests must be numbers between 0 and ${diskSize-1}`);
                return false;
            }
        } catch (e) {
            console.log(e);
            setError('Invalid request format. Use comma-separated numbers.');
            return false;
        }

        // Check if head position is valid
        if (headPosition < 0 || headPosition >= diskSize) {
            setError(`Head position must be between 0 and ${diskSize-1}`);
            return false;
        }

        setError(null);
        return true;
    };

    // Simulate the selected algorithm
    const simulateAlgorithm = () => {
        if (!validateInput()) return;

        setIsLoading(true);
        setActiveTab('results');

        setTimeout(() => {
            try {
                const requestArray = requests.split(',').map(r => parseInt(r.trim()));
                let result;

                switch (algorithm) {
                    case 'fcfs':
                        result = fcfs(requestArray, headPosition);
                        break;
                    case 'sstf':
                        result = sstf(requestArray, headPosition);
                        break;
                    case 'scan':
                        result = scan(requestArray, headPosition, direction);
                        break;
                    case 'cscan':
                        result = cscan(requestArray, headPosition);
                        break;
                    case 'look':
                        result = look(requestArray, headPosition, direction);
                        break;
                    case 'clook':
                        result = clook(requestArray, headPosition);
                        break;
                    default:
                        result = fcfs(requestArray, headPosition);
                }

                setResults(result);
                toast({
                    title: "Simulation Complete",
                    description: `Successfully simulated ${result.algorithm} algorithm.`
                });
                setIsLoading(false);
            } catch (err) {
                setError('Error simulating algorithm: ' + err.message);
                setIsLoading(false);
            }
        }, 600); // Small delay for better UX
    };

    const compareAlgorithms = () => {
        if (!validateInput()) return;

        setIsLoading(true);
        setActiveTab('comparison');

        setTimeout(() => {
            try {
                const requestArray = requests.split(',').map(r => parseInt(r.trim()));

                const results = {
                    fcfs: fcfs(requestArray, headPosition),
                    sstf: sstf(requestArray, headPosition),
                    scan: scan(requestArray, headPosition, direction),
                    cscan: cscan(requestArray, headPosition),
                    look: look(requestArray, headPosition, direction),
                    clook: clook(requestArray, headPosition)
                };

                const comparisonData = Object.entries(results).map(([key, value]) => ({
                    name: value.algorithm.split(' ')[0],
                    totalSeekTime: value.totalSeekTime,
                    averageSeekTime: value.averageSeekTime,
                    algorithm: key
                }));

                setComparisonResults({
                    algorithms: results,
                    comparisonData
                });

                toast({
                    title: "Comparison Complete",
                    description: "Successfully compared all algorithms."
                });
                setIsLoading(false);
            } catch (err) {
                setError('Error comparing algorithms: ' + err.message);
                setIsLoading(false);
            }
        }, 800);
    };

    const generateRandomRequests = () => {
        const count = Math.floor(Math.random() * 7) + 7; // 7-13 requests
        const randomRequests = [];

        for (let i = 0; i < count; i++) {
            randomRequests.push(Math.floor(Math.random() * diskSize));
        }

        setRequests(randomRequests.join(', '));
        setHeadPosition(Math.floor(Math.random() * diskSize));

        toast({
            title: "Random Data Generated",
            description: `Created ${count} random disk requests.`
        });
    };

    useEffect(() => {
        if (activeTab === 'results' && !results) {
            setActiveTab('config');
        }
        if (activeTab === 'comparison' && !comparisonResults) {
            setActiveTab('config');
        }
    }, [activeTab, results, comparisonResults]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8 text-center">
                    <motion.h1
                        className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Disk Scheduling Algorithm Visualizer
                    </motion.h1>
                    <motion.p
                        className="text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Visualize and compare different disk scheduling techniques
                    </motion.p>
                </header>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid grid-cols-3 max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm">
                        <TabsTrigger value="config">Configuration</TabsTrigger>
                        <TabsTrigger value="results" disabled={!results}>Results</TabsTrigger>
                        <TabsTrigger value="comparison" disabled={!comparisonResults}>Comparison</TabsTrigger>
                    </TabsList>

                    <TabsContent value="config">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="grid gap-6"
                        >
                            <Card className="bg-gray-900/70 backdrop-blur-sm border-gray-800 text-white">
                                <CardHeader>
                                    <CardTitle>Select Algorithm</CardTitle>
                                    <CardDescription>Choose a disk scheduling algorithm to simulate</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(algorithmDescriptions).map(([key, description]) => (
                                            <AlgorithmCard
                                                key={key}
                                                title={key.toUpperCase()}
                                                description={description}
                                                selected={algorithm === key}
                                                onClick={() => setAlgorithm(key)}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="bg-gray-900/70 backdrop-blur-sm border-gray-800 text-white">
                                    <CardHeader>
                                        <CardTitle>Parameters</CardTitle>
                                        <CardDescription>Configure disk and head parameters</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="diskSize">Disk Size</Label>
                                            <Input
                                                id="diskSize"
                                                type="number"
                                                value={diskSize}
                                                onChange={(e) => setDiskSize(parseInt(e.target.value))}
                                                min={10}
                                                max={1000}
                                                className="bg-gray-800 border-gray-700"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="headPosition">Head Start Position</Label>
                                            <Input
                                                id="headPosition"
                                                type="number"
                                                value={headPosition}
                                                onChange={(e) => setHeadPosition(parseInt(e.target.value))}
                                                min={0}
                                                max={diskSize - 1}
                                                className="bg-gray-800 border-gray-700"
                                            />
                                            <p className="text-xs text-gray-400">Position must be between 0 and {diskSize - 1}</p>
                                        </div>

                                        {(algorithm === 'scan' || algorithm === 'look') && (
                                            <div className="space-y-2">
                                                <Label htmlFor="direction">Initial Direction</Label>
                                                <Select value={direction} onValueChange={setDirection}>
                                                    <SelectTrigger className="bg-gray-800 border-gray-700">
                                                        <SelectValue placeholder="Select direction" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="right">Right/Up</SelectItem>
                                                        <SelectItem value="left">Left/Down</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="bg-gray-900/70 backdrop-blur-sm border-gray-800 text-white">
                                    <CardHeader>
                                        <CardTitle>Disk Requests</CardTitle>
                                        <CardDescription>Enter comma-separated cylinder requests</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="requests">Request Sequence</Label>
                                            <Textarea
                                                id="requests"
                                                value={requests}
                                                onChange={(e) => setRequests(e.target.value)}
                                                placeholder="e.g., 82, 170, 43, 140, 24, 16, 190"
                                                className="min-h-[120px] bg-gray-800 border-gray-700"
                                            />
                                            <p className="text-xs text-gray-400">Enter numbers between 0 and {diskSize - 1}, separated by commas</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col space-y-4">
                                        <div className="flex flex-wrap gap-2 w-full">
                                            <Button
                                                onClick={simulateAlgorithm}
                                                disabled={isLoading}
                                                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                                            >
                                                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <ChartLine className="mr-2 h-4 w-4" />}
                                                Simulate
                                            </Button>
                                            <Button
                                                onClick={compareAlgorithms}
                                                disabled={isLoading}
                                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                                            >
                                                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <BarChartIcon className="mr-2 h-4 w-4" />}
                                                Compare All
                                            </Button>
                                            <Button
                                                onClick={generateRandomRequests}
                                                variant="outline"
                                                className="flex-1 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                                            >
                                                Random Data
                                            </Button>
                                        </div>

                                        {error && (
                                            <Alert variant="destructive" className="bg-red-900/50 border-red-800">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertTitle>Error</AlertTitle>
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        )}
                                    </CardFooter>
                                </Card>
                            </div>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="results">
                        {results && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                <Card className="bg-gray-900/70 backdrop-blur-sm border-gray-800 text-white">
                                    <CardHeader>
                                        <div className="flex justify-between items-start flex-wrap gap-2">
                                            <div>
                                                <CardTitle className="text-2xl">{results.algorithm}</CardTitle>
                                                <CardDescription>Simulation Results</CardDescription>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    onClick={() => setActiveTab('config')}
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                                                >
                                                    Back to Config
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-gray-400">Seek Sequence</h3>
                                            <SeekSequence
                                                headPosition={headPosition}
                                                sequence={results.seekSequence}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <MetricCard
                                                title="Total Seek Time"
                                                value={results.totalSeekTime}
                                                unit=""
                                            />
                                            <MetricCard
                                                title="Average Seek Time"
                                                value={results.averageSeekTime.toFixed(2)}
                                                unit=""
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <ChartCard title="Seek Operations Visualization" description="Head movement across disk cylinders">
                                    <div className="h-[400px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={results.chartData}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                                                ref={chartRef}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                <XAxis
                                                    dataKey="name"
                                                    stroke="#9CA3AF"
                                                    tick={{ fill: '#9CA3AF' }}
                                                />
                                                <YAxis
                                                    domain={[0, diskSize - 1]}
                                                    label={{
                                                        value: 'Cylinder Position',
                                                        angle: -90,
                                                        position: 'insideLeft',
                                                        style: { fill: '#9CA3AF' }
                                                    }}
                                                    stroke="#9CA3AF"
                                                    tick={{ fill: '#9CA3AF' }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#111827',
                                                        borderColor: '#374151',
                                                        color: '#F9FAFB'
                                                    }}
                                                    itemStyle={{ color: '#F9FAFB' }}
                                                    labelStyle={{ color: '#F9FAFB' }}
                                                />
                                                <Legend />
                                                <Line
                                                    type="stepAfter"
                                                    connectNulls
                                                    dataKey="position"
                                                    stroke={chartColors.primary}
                                                    strokeWidth={3}
                                                    dot={{ r: 6, fill: chartColors.primary, strokeWidth: 2, stroke: '#fff' }}
                                                    activeDot={{ r: 8, stroke: chartColors.primary, strokeWidth: 2 }}
                                                    isAnimationActive={true}
                                                    animationDuration={1500}
                                                    name="Head Position"
                                                />
                                                <ReferenceLine
                                                    y={headPosition}
                                                    stroke={chartColors.reference}
                                                    strokeDasharray="5 5"
                                                    label={{
                                                        value: 'Initial Head Position',
                                                        position: 'insideBottomRight',
                                                        style: { fill: chartColors.reference, fontSize: 12 }
                                                    }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </ChartCard>
                            </motion.div>
                        )}
                    </TabsContent>

                    <TabsContent value="comparison">
                        {comparisonResults && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                <Card className="bg-gray-900/70 backdrop-blur-sm border-gray-800 text-white">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>Algorithm Comparison</CardTitle>
                                                <CardDescription>Performance comparison of all scheduling algorithms</CardDescription>
                                            </div>
                                            <Button
                                                onClick={() => setActiveTab('config')}
                                                variant="outline"
                                                size="sm"
                                                className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                                            >
                                                Back to Config
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                                                        Algorithm
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                                                        Total Seek Time
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">
                                                        Average Seek Time
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-800">
                                                {comparisonResults.comparisonData.map((result, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-800/50">
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                                            {result.name}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                            {result.totalSeekTime} cylinders
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                            {result.averageSeekTime.toFixed(2)} cylinders
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-white">
                                    <ChartCard title="Total Seek Time Comparison">
                                        <div className="h-[400px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={comparisonResults.comparisonData}
                                                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                    <XAxis
                                                        dataKey="name"
                                                        stroke="#9CA3AF"
                                                        tick={{ fill: '#9CA3AF' }}
                                                        angle={-45}
                                                        textAnchor="end"
                                                        height={60}
                                                    />
                                                    <YAxis
                                                        label={{
                                                            value: 'Total Seek Time',
                                                            angle: -90,
                                                            position: 'insideLeft',
                                                            style: { fill: '#9CA3AF' }
                                                        }}
                                                        stroke="#9CA3AF"
                                                        tick={{ fill: '#9CA3AF' }}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: '#111827',
                                                            borderColor: '#374151',
                                                            color: '#F9FAFB'
                                                        }}
                                                    />
                                                    <Legend />
                                                    <Bar
                                                        dataKey="totalSeekTime"
                                                        name="Total Seek Time"
                                                        animationDuration={1500}
                                                    >
                                                        {comparisonResults.comparisonData.map((entry) => (
                                                            <motion.cell
                                                                key={`cell-${entry.algorithm}`}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ duration: 0.5 }}
                                                                fill={chartColors.comparison[entry.algorithm]}
                                                                radius={[4, 4, 0, 0]}
                                                            />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </ChartCard>

                                    <ChartCard title="Average Seek Time Comparison">
                                        <div className="h-[400px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={comparisonResults.comparisonData}
                                                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                    <XAxis
                                                        dataKey="name"
                                                        stroke="#9CA3AF"
                                                        tick={{ fill: '#9CA3AF' }}
                                                        angle={-45}
                                                        textAnchor="end"
                                                        height={60}
                                                    />
                                                    <YAxis
                                                        label={{
                                                            value: 'Average Seek Time',
                                                            angle: -90,
                                                            position: 'insideLeft',
                                                            style: { fill: '#9CA3AF' }
                                                        }}
                                                        stroke="#9CA3AF"
                                                        tick={{ fill: '#9CA3AF' }}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: '#111827',
                                                            borderColor: '#374151',
                                                            color: '#F9FAFB'
                                                        }}
                                                    />
                                                    <Legend />
                                                    <Bar
                                                        dataKey="averageSeekTime"
                                                        name="Average Seek Time"
                                                        animationDuration={1500}
                                                    >
                                                        {comparisonResults.comparisonData.map((entry) => (
                                                            <motion.cell
                                                                key={`cell-${entry.algorithm}`}
                                                                fill={chartColors.comparison[entry.algorithm]}
                                                                radius={[4, 4, 0, 0]}
                                                            />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </ChartCard>
                                </div>
                            </motion.div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

        </div>
    );
};

export default DiskSchedulingVisualizer;
