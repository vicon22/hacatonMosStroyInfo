export type BlueprintID = string | number;

export enum Seriality {
    individual = 'individual',
    serial = 'serial',
}

export enum Material {
    timber = 'timber',
    aeratedConcrete = 'aeratedConcrete',
    reinforcedConcrete = 'reinforcedConcrete',
    bricks = 'bricks',
}

export type Blueprint = {
    id: BlueprintID;
    image_url: string;
    title: string;
    area: number;
    price: number;
    floors: number;
    rooms: number;
    bedrooms: number;
    bathrooms: number;
    material: Material;
    seriality: Seriality;
}