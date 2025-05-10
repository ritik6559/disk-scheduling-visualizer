export const look = (requests, head, direction) => {
    const sortedRequests = [...requests].sort((a, b) => a - b);

    // Find the first request greater than head
    let splitIndex = sortedRequests.findIndex(req => req >= head);
    if (splitIndex === -1) splitIndex = sortedRequests.length;

    let sequence = [head];
    let totalSeekTime = 0;
    let current = head;

    // If moving right (up), service all requests to the right, then go left
    if (direction === 'right') {
        // Requests to the right of head
        for (let i = splitIndex; i < sortedRequests.length; i++) {
            sequence.push(sortedRequests[i]);
            totalSeekTime += Math.abs(sortedRequests[i] - current);
            current = sortedRequests[i];
        }

        // Service requests to the left of head
        for (let i = splitIndex - 1; i >= 0; i--) {
            sequence.push(sortedRequests[i]);
            totalSeekTime += Math.abs(sortedRequests[i] - current);
            current = sortedRequests[i];
        }
    }
    // If moving left (down), service all requests to the left, then go right
    else {
        // Requests to the left of head
        for (let i = splitIndex - 1; i >= 0; i--) {
            sequence.push(sortedRequests[i]);
            totalSeekTime += Math.abs(sortedRequests[i] - current);
            current = sortedRequests[i];
        }

        // Service requests to the right of head
        for (let i = splitIndex; i < sortedRequests.length; i++) {
            sequence.push(sortedRequests[i]);
            totalSeekTime += Math.abs(sortedRequests[i] - current);
            current = sortedRequests[i];
        }
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
