declare interface Env {
  readonly NODE_ENV: string;
  [key: string]: any;
}

declare interface ImportMeta {
  readonly env: Env;
}
declare const _NGX_ENV_: Env;
declare namespace NodeJS {
  export interface ProcessEnv extends Env {}
}
