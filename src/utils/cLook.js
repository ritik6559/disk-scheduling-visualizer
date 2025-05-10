export const clook = (requests, head) => {
    const sortedRequests = [...requests].sort((a, b) => a - b);

    // Find the first request greater than head
    let splitIndex = sortedRequests.findIndex(req => req >= head);
    if (splitIndex === -1) splitIndex = sortedRequests.length;

    let sequence = [head];
    let totalSeekTime = 0;
    let current = head;

    // Service requests to the right of head
    for (let i = splitIndex; i < sortedRequests.length; i++) {
        sequence.push(sortedRequests[i]);
        totalSeekTime += Math.abs(sortedRequests[i] - current);
        current = sortedRequests[i];
    }

    // Jump to the leftmost request
    if (splitIndex > 0) {
        sequence.push(sortedRequests[0]);
        totalSeekTime += Math.abs(sortedRequests[0] - current);
        current = sortedRequests[0];
    }

    // Service the remaining requests
    for (let i = 1; i < splitIndex; i++) {
        sequence.push(sortedRequests[i]);
        totalSeekTime += Math.abs(sortedRequests[i] - current);
        current = sortedRequests[i];
    }

    // Remove duplicates if head position is one of the requests
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
        name: index === 0 ? 'Head' : `CL${index}`
    }));

    return {
        algorithm: 'C-LOOK (Circular LOOK)',
        seekSequence: sequence.slice(1),
        totalSeekTime,
        averageSeekTime: totalSeekTime / requests.length,
        chartData
    };
};

