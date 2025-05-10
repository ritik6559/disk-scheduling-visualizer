export const sstf = (requests, head) => {
    let remaining = [...requests];
    let current = head;
    let sequence = [head];
    let totalSeekTime = 0;

    while (remaining.length > 0) {
        let shortestIndex = 0;
        let shortestDistance = Math.abs(remaining[0] - current);

        for (let i = 1; i < remaining.length; i++) {
            const distance = Math.abs(remaining[i] - current);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                shortestIndex = i;
            }
        }

        const nextPosition = remaining[shortestIndex];
        sequence.push(nextPosition);
        totalSeekTime += shortestDistance;
        current = nextPosition;
        remaining.splice(shortestIndex, 1);
    }

    const chartData = sequence.map((pos, index) => ({
        index: index === 0 ? 'Head' : index,
        position: pos,
        name: index === 0 ? 'Head' : `R${index}`
    }));

    return {
        algorithm: 'SSTF (Shortest Seek Time First)',
        seekSequence: sequence.slice(1),
        totalSeekTime,
        averageSeekTime: totalSeekTime / requests.length,
        chartData
    };
};
