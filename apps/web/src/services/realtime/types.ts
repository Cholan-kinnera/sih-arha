export * from '../../types/realtime.types';

export type RealtimeListener<T = unknown> = (data: T) => void;
