import type { Socket } from "bun";
import { LineSplitter } from "./line-splitter.js";
import { HerdrTransportError } from "../protocol/error.js";

export interface ConnectionHandlers {
  onLine(line: string): void;
  onClose(): void;
  onError(err: unknown): void;
}

/**
 * A single unix-socket connection that delivers newline-delimited frames.
 * Knows nothing about JSON or the protocol; that is one layer up.
 */
export class Connection {
  private constructor(private readonly sock: Socket<undefined>) {}

  static async open(path: string, h: ConnectionHandlers): Promise<Connection> {
    const split = new LineSplitter();
    try {
      const sock = await Bun.connect({
        unix: path,
        socket: {
          data: (_s, d) => { for (const l of split.push(d.toString())) h.onLine(l); },
          close: () => h.onClose(),
          error: (_s, e) => h.onError(e),
          connectError: (_s, e) => h.onError(e),
        },
      });
      return new Connection(sock);
    } catch (e) {
      throw new HerdrTransportError(`cannot connect to herdr socket at ${path}`, e);
    }
  }

  writeLine(line: string): void { this.sock.write(line + "\n"); }
  close(): void { this.sock.end(); }
}
