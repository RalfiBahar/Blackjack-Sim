# ![Logo](./blackjack-sim/public/logo.png)

# Blackjack Simulator

Welcome to the **Blackjack Simulator**! This project allows users to simulate millions of blackjack games, providing insights into the performance of optimal strategies, card counting, and other techniques. The final results are displayed through dynamic charts, offering users a deep analysis of blackjack gameplay.

## Live Demo

You can access the live demo of the application at: [blackjack-sim.com](https://blackjack-sim.com)

---

## Features

- **Simulate Millions of Blackjack Games**: Run simulations using various strategies, including card counting, and view aggregated and mean statistics.
- **Full-Stack Web Application**: Built with a React.js frontend and a RESTful Express API backend.
- **Statistics and Charts**: Visualize the final results through interactive charts for a clear understanding of strategy outcomes.
- **Custom Caching with AWS S3**: Efficiently handle large-scale simulations by caching results in AWS S3, ensuring fast data retrieval and improved performance.

## Summary

This blackjack simulator utilizes optimal (or basic) strategy and card counting to simulate games of blackjack. It allows you to decide the number of games to simulate, ensuring flexibility. The simulator also implements a betting strategy based on the running count, adjusting bets as the game progresses. Upon completion, it displays essential statistics such as expected value, profit, win rate, and other aggregated data, helping you evaluate the effectiveness of the chosen strategy.

## Technology Stack

- **Frontend**:

  - [Next.js](https://nextjs.org/) – React framework for server-side rendering and static site generation
  - [Typescript](https://www.typescriptlang.org/) – Superset of JavaScript providing type safety
  - [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for styling

- **Backend**:
  - [Express.js](https://expressjs.com/) – Web framework for Node.js to create RESTful APIs
  - [Python](https://www.python.org/) – Simulating blackjack games and calculating strategies
  - [AWS S3](https://aws.amazon.com/s3/) – Cloud storage for caching large tasks and results

## How to Use

1. Navigate to the simulator page.
2. Choose a strategy to simulate, such as basic blackjack or card counting.
3. Set the number of simulations.
4. Click "Run Simulation" and watch the charts populate with statistics!

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

---

Happy simulating! If you have any questions or issues, feel free to reach out through the [Issues](https://github.com/yourusername/blackjack-simulator/issues) section.
