import * as child from "child_process";
import * as os from "os";
import { Logger } from "@/modules/Logger";

export class Info {
  public static OS() {
    if(os.platform() == "win32"){
      return "windows";
    }

    if(os.platform() == "darwin"){
      return "mac";
    }

    if(os.platform() == "linux"){
      return "linux";
    }
    return "unknown";
  }
}

export class Command {

  public static ping(server_address: string) {
    if(!server_address){
      return "Error: address not found";
    } else {

      let ping_cmd: string;
      let ping;
      let ping_cat;
      Logger.SystemInfo("os: " + Info.OS());
      if(Info.OS() == "windows"){
        return "0ms";
      } else {
        ping_cmd = child.execSync("ping -c 1 " + server_address + " | grep time").toString();
        Logger.Debug("command data: " + ping_cmd);
        ping_cat = ping_cmd.indexOf("time");
        ping = ping_cmd.substring(ping_cat + 5);
        ping = ping.replace(/\r?\n/g, "");
        ping = ping.replace(/ /g, "");
        ping = ping.replace("ms", "");
        ping = Number(ping);
        ping = Math.ceil(ping);
        ping = String(ping);
        ping = ping + "ms";
        return ping;
      }
    }
  }
}