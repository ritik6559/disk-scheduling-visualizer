export const fcfs = (requests, head) => {
    const sequence = [head, ...requests];
    let totalSeekTime = 0;

    for (let i = 0; i < requests.length; i++) {
        totalSeekTime += Math.abs(sequence[i+1] - sequence[i]);
    }

    const chartData = sequence.map((pos, index) => ({
        index: index === 0 ? 'Head' : index,
        position: pos,
        name: index === 0 ? 'Head' : `R${index}`
    }));

    return {
        algorithm: 'FCFS (First Come First Serve)',
        seekSequence: sequence.slice(1),
        totalSeekTime,
        averageSeekTime: totalSeekTime / requests.length,
        chartData
    };
};
