import { RawExaminee } from './raw-examinee.interface';

export interface SpecializationGroup {
  school: string;
  code: string;
  county: string;
  specialization: string;
  language: string;
  candidates: RawExaminee[];
  highestAdmissionGrade: number;
  lowestAdmissionGrade: number;
  firstCandidate?: RawExaminee;
  lastCandidate?: RawExaminee;
  positionRange?: string;
}
