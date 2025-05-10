export const scan = (requests, head, direction) => {
    const sortedRequests = [...requests].sort((a, b) => a - b);

    // Find the first request greater than head
    let splitIndex = sortedRequests.findIndex(req => req >= head);
    if (splitIndex === -1) splitIndex = sortedRequests.length;

    let sequence = [head];
    let totalSeekTime = 0;
    let current = head;

    // If moving right (up), service all requests to the right, then go back
    if (direction === 'right') {
        // Requests to the right of head
        for (let i = splitIndex; i < sortedRequests.length; i++) {
            sequence.push(sortedRequests[i]);
            totalSeekTime += Math.abs(sortedRequests[i] - current);
            current = sortedRequests[i];
        }

        // Go to the end of the disk
        if (current < diskSize - 1) {
            sequence.push(diskSize - 1);
            totalSeekTime += Math.abs(diskSize - 1 - current);
            current = diskSize - 1;
        }

        // Service requests to the left of head
        for (let i = splitIndex - 1; i >= 0; i--) {
            sequence.push(sortedRequests[i]);
            totalSeekTime += Math.abs(sortedRequests[i] - current);
            current = sortedRequests[i];
        }
    }
    // If moving left (down), service all requests to the left, then go back
    else {
        // Requests to the left of head
        for (let i = splitIndex - 1; i >= 0; i--) {
            sequence.push(sortedRequests[i]);
            totalSeekTime += Math.abs(sortedRequests[i] - current);
            current = sortedRequests[i];
        }

        // Go to the beginning of the disk
        if (current > 0) {
            sequence.push(0);
            totalSeekTime += current; // Distance to 0
            current = 0;
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
        name: index === 0 ? 'Head' : `S${index}`
    }));

    return {
        algorithm: 'SCAN (Elevator)',
        seekSequence: sequence.slice(1),
        totalSeekTime,
        averageSeekTime: totalSeekTime / requests.length,
        chartData
    };
};
