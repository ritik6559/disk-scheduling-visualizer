export const cscan = (requests, head) => {
    const sortedRequests = [...requests].sort((a, b) => a - b);

    let splitIndex = sortedRequests.findIndex(req => req >= head);
    if (splitIndex === -1) splitIndex = sortedRequests.length;

    let sequence = [head];
    let totalSeekTime = 0;
    let current = head;

    for (let i = splitIndex; i < sortedRequests.length; i++) {
        sequence.push(sortedRequests[i]);
        totalSeekTime += Math.abs(sortedRequests[i] - current);
        current = sortedRequests[i];
    }

    if (current < diskSize - 1) {
        sequence.push(diskSize - 1);
        totalSeekTime += Math.abs(diskSize - 1 - current);
        current = diskSize - 1;
    }

    sequence.push(0);
    totalSeekTime += current; // This is diskSize - 1 which is the full swing
    current = 0;

    for (let i = 0; i < splitIndex; i++) {
        sequence.push(sortedRequests[i]);
        totalSeekTime += Math.abs(sortedRequests[i] - current);
        current = sortedRequests[i];
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
        name: index === 0 ? 'Head' : `C${index}`
    }));

    return {
        algorithm: 'C-SCAN (Circular SCAN)',
        seekSequence: sequence.slice(1),
        totalSeekTime,
        averageSeekTime: totalSeekTime / requests.length,
        chartData
    };
};
