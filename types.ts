
export interface Dog {
  id: string;
  name: string;
  registeredName: string;
  breed: string;
  gender: 'Male' | 'Female';
  dob: string;
  image: string;
  description: string;
  healthClearances: string[];
  prizes?: string[];
}

export interface Litter {
  id: string;
  sire: string;
  dam: string;
  whelpDate: string;
  goHomeDate: string;
  status: 'Planned' | 'Born' | 'Available' | 'Sold Out';
  puppiesCount: number;
  description: string;
  image: string;
  gallery?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
