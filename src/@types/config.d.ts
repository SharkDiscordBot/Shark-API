declare module '@configs/config.json' {
  type JSONType = {
      server: {
        port: number;
        mongodb_url: string;
      }
      settings: {
        debug_mode: boolean;
        debug_logger: boolean;
      }
  }

  const value: JSONType;
  export = value;
}