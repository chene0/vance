'use client'

import { motion } from "framer-motion";

export default function AnimatedLogo() {
    const icon = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i: number) => {
            const delay = 1 + i * 0.5;
            return {
                pathLength: 1,
                opacity: 1,
                transition: {
                    pathLength: { delay, type: "spring", duration: 2, bounce: 0 },
                    opacity: { delay, duration: 2 }
                }
            };
        }
    }

    return (
        <motion.svg
            viewBox="0 0 937 484"
            width={95}
            height={50}
            initial="hidden"
            animate="visible"
        >
            <motion.path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M797.63 72.4803C795.562 67.1698 793.065 61.9486 790.128 56.8609C769.063 20.375 730.723 0.0806735 691.405 0.344528C671.988 0.214066 652.282 5.09026 634.252 15.5C630.397 17.7253 626.724 20.1434 623.236 22.7351L287.324 216.674L211.222 84.8609C180.018 30.8138 110.908 12.2959 56.8609 43.5C2.81381 74.7041 -15.7041 143.814 15.5 197.861L148 427.358C175.011 474.143 230.426 494.305 279.887 478.638C287.873 476.182 295.709 472.795 303.251 468.44L649.77 268.378L725.391 399.358C756.595 453.405 825.704 471.923 879.752 440.718C933.799 409.514 952.317 340.405 921.112 286.358L797.63 72.4803Z"
                fill="url(#paint0_linear_19_32)"
                stroke="#22577E"
                strokeWidth={10}
                variants={icon}
                custom={1}
            />
            <motion.defs>
                <linearGradient id="paint0_linear_19_32" x1="468.306" y1="0.34198" x2="468.306" y2="483.876" gradientUnits="userSpaceOnUse">
                    <motion.stop stop-color="#95D1CC" />
                    <motion.stop offset="1" stop-color="#5584AC" stop-opacity="0.419608" />
                </linearGradient>
            </motion.defs>
        </motion.svg>
    )
}
