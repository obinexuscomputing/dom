export interface PPIConfig {
    mode: 'html' | 'css';
    optimize?: boolean;
  }
  
  export interface PPI {
    process(input: string, config: PPIConfig): string;
  }
  