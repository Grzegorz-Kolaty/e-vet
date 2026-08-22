export enum AnimalTaxonometry {
  animals = 'animalia',
  mammals = 'mammalia',
  birds = 'aves',
  reptiles = 'reptilia',
  amphibians = 'amphibia',
  fishes = 'actinopterygii',
  insects = 'insecta',
  arachnids = 'arachnida'
}

export interface ITreatment {
  id?: string;
  petId: string;
  appointmentId: string | null;
  clinicId: string | null;
  vetId: string | null;
  isCreatedByUser: boolean;
  type: string;
  date: Date | null;
  vet: string;
  clinic: string;
  diagnosis: string;
  description: string;
  recommendation: string;
  prescription: string;
  attachments?: IAttachment[];
}

export interface IAttachment {
  name: string;
  url: string;
}

export interface IPet {
  id: string;
  ownerId: string;
  name: string;
  species: string;
  breed: string;
  sex: 'Samiec' | 'Samica' | 'Nieokreślona';
  birthDate?: string;
  weight?: number | null;
  photoUrl?: string;
  lastVisit?: string;
  clinic?: string;
}

export type INewPetData = Omit<IPet, 'id' | 'ownerId'>;
