/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly MODE: string;
  readonly VITE_API_DEV_URL: string;
  readonly VITE_API_PROD_URL: string;
  // more env variables...
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};
