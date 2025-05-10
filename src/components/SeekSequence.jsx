import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const SeekSequence= ({ headPosition, sequence }) => {
    return (
        <div className="p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700/50">
            <div className="flex flex-wrap items-center gap-2">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="px-3 py-1.5 rounded-md bg-purple-600 text-white font-medium"
                >
                    Head ({headPosition})
                </motion.div>

                {sequence.map((pos, idx) => (
                    <React.Fragment key={idx}>
                        <ArrowRight className="text-gray-400 h-4 w-4" />
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="px-3 py-1.5 rounded-md bg-cyan-600/80 text-white"
                        >
                            {pos}
                        </motion.div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default SeekSequence;
