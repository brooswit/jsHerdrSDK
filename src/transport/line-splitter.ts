/** Buffers arbitrary chunks and yields complete newline-terminated lines. Pure. */
export class LineSplitter {
  private buf = "";
  push(chunk: string): string[] {
    this.buf += chunk;
    const out: string[] = [];
    let i: number;
    while ((i = this.buf.indexOf("\n")) >= 0) {
      const line = this.buf.slice(0, i);
      this.buf = this.buf.slice(i + 1);
      if (line.length) out.push(line);
    }
    return out;
  }
  /** Anything left without a trailing newline. */
  get pending(): string { return this.buf; }
}
