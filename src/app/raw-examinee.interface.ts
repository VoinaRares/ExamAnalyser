export interface RawExaminee {
  ja: string;   // Judet
  n: string;    // Student ID
  jp: string;   // Localitate
  s: string;    // Scoala
  sc: string;   // Cod scoala
  madm: string; // Medie admitere
  mev: string;  // Medie evaluate
  mabs: string; // Medie absolvire
  nro: string;  // Nota romana
  nmate: string;// Nota matematica
  lm: string;   // Limba materna
  nlm: string;  // Nota limba materna
  h: string;    // High school info (HTML)
  sp: string;   // Specialization info (HTML)
  rank?: number; // County-wide rank position
}
