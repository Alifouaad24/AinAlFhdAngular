export class Area {
    id?: number;
    description?: string;


    constructor(data?: Partial<Area>) {
        if (data) {
          Object.assign(this, data);
        }
      }
}

