declare module "@root/system.json" {
  type JSONType = {
    version: string;
    beta: boolean;
  }

  const value: JSONType;
  export = value;
}