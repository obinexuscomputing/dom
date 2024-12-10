import { PPIConfig } from './ppi-types';

export function validateConfig(config: PPIConfig): boolean {
  return config.mode === 'html' || config.mode === 'css';
}
