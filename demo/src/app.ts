import { Terminal } from "xterm";
import { openpty } from "xterm-pty";
import "xterm/css/xterm.css";

const entry = (id: string, loadJS: () => Promise<any>) => {
  const xterm = new Terminal();
  const div = document.getElementById(id + "-xterm");
  if (div) xterm.open(div);
  const { master, slave } = openpty();
  xterm.loadAddon(master);
  const button = document.getElementById(id + "-run") as HTMLButtonElement;
  let module: any;
  const invoke = async () => {
    xterm.clear();
    button.disabled = true;
    const { default: initEmscripten } = await loadJS();
    module = await initEmscripten({
      pty: slave,
      onExit: () => {
        module = undefined;
        button.disabled = false;
        xterm.write("\r[Terminated. Push the 'Run' button to restart it.]\r\n");
      }
    });
  };
  button.onclick = invoke;
};

// As "new Worker(...)" is an idiom to allow parcel to track dependency,
// we need to write them literally

entry("gdb", () => import("../static/gdb.js"));
