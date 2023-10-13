/* eslint-disable @typescript-eslint/ban-types */
export type Json =
  | string
  | number
  | boolean
  | undefined
  | {[key: string]: Json | undefined}
  | Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never
		};
		Views: {
			[_ in never]: never
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never
		};
		CompositeTypes: {
			[_ in never]: never
		};
	};
	public: {
		Tables: {
			general_overview: {
				Row: {
					ansprechperson_bezirksebene: string | undefined;
					ansprechperson_landesebene: string | undefined;
					beschreibung: string | undefined;
					dateiformat: string | undefined;
					datenhoheit_bei: string | undefined;
					datenqualitaet: string | undefined;
					datensatz_titel: string | undefined;
					id: number;
					it_fachverfahren: string | undefined;
					raeumlicher_bezug: string | undefined;
					thema: string | undefined;
					typ: string | undefined;
					user_id: string | undefined;
					verantwortlichkeit_bezirksebene: string | undefined;
					verantwortlichkeit_landesebene: string | undefined;
				};
				Insert: {
					ansprechperson_bezirksebene?: string | undefined;
					ansprechperson_landesebene?: string | undefined;
					beschreibung?: string | undefined;
					dateiformat?: string | undefined;
					datenhoheit_bei?: string | undefined;
					datenqualitaet?: string | undefined;
					datensatz_titel?: string | undefined;
					id?: number;
					it_fachverfahren?: string | undefined;
					raeumlicher_bezug?: string | undefined;
					thema?: string | undefined;
					typ?: string | undefined;
					user_id?: string | undefined;
					verantwortlichkeit_bezirksebene?: string | undefined;
					verantwortlichkeit_landesebene?: string | undefined;
				};
				Update: {
					ansprechperson_bezirksebene?: string | undefined;
					ansprechperson_landesebene?: string | undefined;
					beschreibung?: string | undefined;
					dateiformat?: string | undefined;
					datenhoheit_bei?: string | undefined;
					datenqualitaet?: string | undefined;
					datensatz_titel?: string | undefined;
					id?: number;
					it_fachverfahren?: string | undefined;
					raeumlicher_bezug?: string | undefined;
					thema?: string | undefined;
					typ?: string | undefined;
					user_id?: string | undefined;
					verantwortlichkeit_bezirksebene?: string | undefined;
					verantwortlichkeit_landesebene?: string | undefined;
				};
				Relationships: [
					{
						foreignKeyName: 'general_overview_user_id_fkey';
						columns: ['user_id'];
						referencedRelation: 'user_profiles';
						referencedColumns: ['id'];
					},
				];
			};
			user_profiles: {
				Row: {
					created_at: string;
					id: string;
					name: string | undefined;
					role: Database['public']['Enums']['role'] | undefined;
				};
				Insert: {
					created_at?: string;
					id: string;
					name?: string | undefined;
					role?: Database['public']['Enums']['role'] | undefined;
				};
				Update: {
					created_at?: string;
					id?: string;
					name?: string | undefined;
					role?: Database['public']['Enums']['role'] | undefined;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never
		};
		Functions: {
			[_ in never]: never
		};
		Enums: {
			role: 'viewer' | 'editor' | 'admin';
		};
		CompositeTypes: {
			[_ in never]: never
		};
	};
	storage: {
		Tables: {
			buckets: {
				Row: {
					allowed_mime_types: string[] | undefined;
					avif_autodetection: boolean | undefined;
					created_at: string | undefined;
					file_size_limit: number | undefined;
					id: string;
					name: string;
					owner: string | undefined;
					public: boolean | undefined;
					updated_at: string | undefined;
				};
				Insert: {
					allowed_mime_types?: string[] | undefined;
					avif_autodetection?: boolean | undefined;
					created_at?: string | undefined;
					file_size_limit?: number | undefined;
					id: string;
					name: string;
					owner?: string | undefined;
					public?: boolean | undefined;
					updated_at?: string | undefined;
				};
				Update: {
					allowed_mime_types?: string[] | undefined;
					avif_autodetection?: boolean | undefined;
					created_at?: string | undefined;
					file_size_limit?: number | undefined;
					id?: string;
					name?: string;
					owner?: string | undefined;
					public?: boolean | undefined;
					updated_at?: string | undefined;
				};
				Relationships: [
					{
						foreignKeyName: 'buckets_owner_fkey';
						columns: ['owner'];
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
				];
			};
			migrations: {
				Row: {
					executed_at: string | undefined;
					hash: string;
					id: number;
					name: string;
				};
				Insert: {
					executed_at?: string | undefined;
					hash: string;
					id: number;
					name: string;
				};
				Update: {
					executed_at?: string | undefined;
					hash?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			objects: {
				Row: {
					bucket_id: string | undefined;
					created_at: string | undefined;
					id: string;
					last_accessed_at: string | undefined;
					metadata: Json | undefined;
					name: string | undefined;
					owner: string | undefined;
					path_tokens: string[] | undefined;
					updated_at: string | undefined;
					version: string | undefined;
				};
				Insert: {
					bucket_id?: string | undefined;
					created_at?: string | undefined;
					id?: string;
					last_accessed_at?: string | undefined;
					metadata?: Json | undefined;
					name?: string | undefined;
					owner?: string | undefined;
					path_tokens?: string[] | undefined;
					updated_at?: string | undefined;
					version?: string | undefined;
				};
				Update: {
					bucket_id?: string | undefined;
					created_at?: string | undefined;
					id?: string;
					last_accessed_at?: string | undefined;
					metadata?: Json | undefined;
					name?: string | undefined;
					owner?: string | undefined;
					path_tokens?: string[] | undefined;
					updated_at?: string | undefined;
					version?: string | undefined;
				};
				Relationships: [
					{
						foreignKeyName: 'objects_bucketId_fkey';
						columns: ['bucket_id'];
						referencedRelation: 'buckets';
						referencedColumns: ['id'];
					},
				];
			};
		};
		Views: {
			[_ in never]: never
		};
		Functions: {
			can_insert_object: {
				Args: {
					bucketid: string;
					name: string;
					owner: string;
					metadata: Json;
				};
				Returns: undefined;
			};
			extension: {
				Args: {
					name: string;
				};
				Returns: string;
			};
			filename: {
				Args: {
					name: string;
				};
				Returns: string;
			};
			foldername: {
				Args: {
					name: string;
				};
				Returns: unknown;
			};
			get_size_by_bucket: {
				Args: Record<PropertyKey, never>;
				Returns: Array<{
					size: number;
					bucket_id: string;
				}>;
			};
			search: {
				Args: {
					prefix: string;
					bucketname: string;
					limits?: number;
					levels?: number;
					offsets?: number;
					search?: string;
					sortcolumn?: string;
					sortorder?: string;
				};
				Returns: Array<{
					name: string;
					id: string;
					updated_at: string;
					created_at: string;
					last_accessed_at: string;
					metadata: Json;
				}>;
			};
		};
		Enums: {
			[_ in never]: never
		};
		CompositeTypes: {
			[_ in never]: never
		};
	};
};

