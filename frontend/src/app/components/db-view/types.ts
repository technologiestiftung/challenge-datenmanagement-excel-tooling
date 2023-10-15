export type Row = {
  id: number;
  thema: string;
  typ: string;
  datensatz_titel: string;
  beschreibung: string;
  raeumlicher_bezug: string;
  verantwortlichkeit_bezirksebene: string;
  ansprechperson_bezirksebene: string;
  verantwortlichkeit_landesebene: string;
  ansprechperson_landesebene: string;
  datenhoheit_bei: string;
  it_fachverfahren: string;
  datenqualitaet: string;
  user_id: string;
  recentlyModified?: string[];
};
