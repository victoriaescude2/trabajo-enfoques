export class Character {
    id: string;
    name: string;
    type: string;
    powerstats: {};
    about: {};
    appearance: {};
    work: {};
    image: {};
  
    constructor(
      id?: string,
      name?: string,
      type?: string,
      powerstats?: {},
      about?: {},
      appearance?: {},
      work?: {},
      image?: {}
    ) {
      this.id = id;
      this.name = name;
      this.type = type;
      this.powerstats = powerstats;
      this.about = about;
      this.appearance = appearance;
      this.work = work;
      this.image = image;
    }
  }