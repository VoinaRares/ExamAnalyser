import { RawExaminee } from './raw-examinee.interface';

export interface SpecializationGroup {
  school: string;
  code: string;
  county: string;
  specialization: string; // `sp`
  language: string;       // `lm`
  candidates: RawExaminee[];
  lowestAdmissionGrade: number;
  highestAdmissionGrade: number;
}
