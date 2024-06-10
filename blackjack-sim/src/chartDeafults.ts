// src/chartDefaults.ts
import { Chart as ChartJS, ChartOptions, Defaults } from "chart.js";

// Set global defaults for all charts
const globalDefaults: Defaults = ChartJS.defaults;

globalDefaults.color = "white"; // Default text color for all elements

export default ChartJS;
