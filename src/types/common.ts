export type Address = string;

export interface BaseEntity {
    id: string;
    createdAt: number;
    updatedAt: number;
}

export type Status = 'pending' | 'confirmed' | 'failed'; 