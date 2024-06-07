// src/types/chartjs-plugin-downsample.d.ts
declare module "chartjs-plugin-downsample" {
  const downsample: (data: any[], options: { threshold: number }) => any[];
  export default downsample;
}
