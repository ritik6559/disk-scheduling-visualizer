export const look = (requests, head, direction) => {
    const sortedRequests = [...requests].sort((a, b) => a - b);

    let splitIndex = sortedRequests.findIndex(req => req >= head);
    if (splitIndex === -1) splitIndex = sortedRequests.length;

    let sequence = [head];
    let totalSeekTime = 0;
    let current = head;

    if (direction === 'right') {
        for (let i = splitIndex; i < sortedRequests.length; i++) {
            sequence.push(sortedRequests[i]);
            totalSeekTime += Math.abs(sortedRequests[i] - current);
            current = sortedRequests[i];
        }

        for (let i = splitIndex - 1; i >= 0; i--) {
            sequence.push(sortedRequests[i]);
            totalSeekTime += Math.abs(sortedRequests[i] - current);
            current = sortedRequests[i];
        }
    }
    else {
        for (let i = splitIndex - 1; i >= 0; i--) {
            sequence.push(sortedRequests[i]);
            totalSeekTime += Math.abs(sortedRequests[i] - current);
            current = sortedRequests[i];
        }

        for (let i = splitIndex; i < sortedRequests.length; i++) {
            sequence.push(sortedRequests[i]);
            totalSeekTime += Math.abs(sortedRequests[i] - current);
            current = sortedRequests[i];
        }
    }

    const uniqueSequence = [head];
    for (let i = 1; i < sequence.length; i++) {
        if (sequence[i] !== sequence[i-1]) {
            uniqueSequence.push(sequence[i]);
        }
    }
    sequence = uniqueSequence;

    const chartData = sequence.map((pos, index) => ({
        index: index === 0 ? 'Head' : index,
        position: pos,
        name: index === 0 ? 'Head' : `L${index}`
    }));

    return {
        algorithm: 'LOOK',
        seekSequence: sequence.slice(1),
        totalSeekTime,
        averageSeekTime: totalSeekTime / requests.length,
        chartData
    };
};
