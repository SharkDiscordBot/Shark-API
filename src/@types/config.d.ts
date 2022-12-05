declare module "@configs/config.json" {
  type JSONType = {
      server: {
        port: number;
        mongodb_url: string;
        ssl: {
          enable: boolean;
          key_path: string;
          cert_path: string;
          ssl_port: number;
        }
      },
      settings: {
        debug_mode: boolean;
        debug_logger: boolean;
        check_status: {
          frontend_status_URL: string,
          bot_status_URL: string,
          enable: boolean,
          disabled_status: string
        }
      },
      maintenance_mode: {
        enable: boolean,
        res_status: number
      }
  }

  const config: JSONType;
  export = config;
}