/**
 * API URL for uploading test results to receive TOM file and PDF report.
 * Set EXPO_PUBLIC_UPLOAD_API_URL in .env to enable this feature.
 */
export const UPLOAD_API_URL = "https://hu.mobak-digiko.de/api/process";

export interface ProcessMOBAKDataRequest {
	mail: string;
	results: {
		firstName: string;
		lastName: string;
		birthdate: string;
		balance: number | null;
		roll: number | null;
		jump: number | null;
		catch: number | null;
		throw: number | null;
		walk: number | null;
		bouncing: number | null;
		dribble: number | null;
	}[];
}
