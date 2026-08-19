export type LibraryId = 'quantum' | 'shadcn' | 'magicui' | 'aceternity' | 'mantine';

export interface LibraryDefinition {
  id: LibraryId;
  name: string;
  description: string;
  icon: string;
  /** Optional real logo image — falls back to the Lucide `icon` above when not set */
  logoUrl?: string;
  website: string;
  color: string;
  isOfficial: boolean;
}

export interface LibraryCategoryDefinition {
  id: string;
  libraryId: LibraryId;
  name: string;
  slug: string;
  icon: string;
}