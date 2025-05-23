declare module '@citation-js/core' {
  export class Cite {
    constructor(data: string | object | object[]);
    get(options?: { type?: string; format?: string }): any;
    format(
      format: string,
      options?: { type?: string; style?: string; lang?: string }
    ): string;
  }
}

declare module '@citation-js/plugin-bibtex';