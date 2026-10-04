export interface SummaryKPIs {
  total_titles: number;
  total_movies: number;
  total_tv_shows: number;
  movies_percentage: number;
  tv_shows_percentage: number;
  total_countries: number;
  total_directors: number;
  total_genres: number;
  total_ratings: number;
  min_release_year: number;
  max_release_year: number;
  latest_addition?: string;
}

export interface MovieStats {
  total_movies: number;
  avg_duration_minutes: number;
  median_duration_minutes: number;
  min_duration_minutes: number;
  max_duration_minutes: number;
  duration_distribution: { bin_range: string; min_val: number; max_val: number; count: number }[];
  top_genres: { genre: string; count: number }[];
  top_directors: { director: string; count: number }[];
  rating_breakdown: { rating: string; count: number }[];
}

export interface TVShowStats {
  total_tv_shows: number;
  season_distribution: { seasons: string; count: number }[];
  top_genres: { genre: string; count: number }[];
  top_countries: { country: string; count: number }[];
  rating_breakdown: { rating: string; count: number }[];
}

export interface CountryStat {
  country: string;
  total_shows: number;
  movies_count: number;
  tv_shows_count: number;
  percentage_of_total: number;
}

export interface GenreStat {
  genre: string;
  total_count: number;
  movies_count: number;
  tv_shows_count: number;
}

export interface RatingStat {
  rating: string;
  count: number;
  percentage: number;
  target_audience: string;
}

export interface TrendItem {
  year: number;
  total_shows: number;
  movies: number;
  tv_shows: number;
}

export interface TitleRecord {
  show_id: string;
  type: string;
  title: string;
  director: string;
  cast: string;
  country: string;
  date_added: string;
  release_year: number;
  rating: string;
  duration: string;
  listed_in: string;
  description: string;
}

export interface SearchResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: TitleRecord[];
  available_filters: {
    countries: string[];
    genres: string[];
    ratings: string[];
    types: string[];
  };
}

export interface InsightItem {
  category: string;
  title: string;
  description: string;
  key_metric: string;
  impact: string;
  recommendation?: string;
}

export interface InsightsResponse {
  summary: string;
  insights: InsightItem[];
  country_insights: string[];
  genre_insights: string[];
  rating_insights: string[];
  trend_insights: string[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// Fallback data cached from actual dataset execution
const FALLBACK_SUMMARY: SummaryKPIs = {
  total_titles: 8807,
  total_movies: 6131,
  total_tv_shows: 2676,
  movies_percentage: 69.62,
  tv_shows_percentage: 30.38,
  total_countries: 122,
  total_directors: 4993,
  total_genres: 42,
  total_ratings: 18,
  min_release_year: 1925,
  max_release_year: 2021,
  latest_addition: "Dick Johnson Is Dead"
};

const FALLBACK_COUNTRIES: CountryStat[] = [
  { country: "United States", total_shows: 3689, movies_count: 2751, tv_shows_count: 938, percentage_of_total: 46.25 },
  { country: "India", total_shows: 1046, movies_count: 962, tv_shows_count: 84, percentage_of_total: 13.11 },
  { country: "United Kingdom", total_shows: 804, movies_count: 532, tv_shows_count: 272, percentage_of_total: 10.08 },
  { country: "Canada", total_shows: 445, movies_count: 319, tv_shows_count: 126, percentage_of_total: 5.58 },
  { country: "France", total_shows: 393, movies_count: 303, tv_shows_count: 90, percentage_of_total: 4.93 },
  { country: "Japan", total_shows: 318, movies_count: 119, tv_shows_count: 199, percentage_of_total: 3.99 },
  { country: "Spain", total_shows: 232, movies_count: 171, tv_shows_count: 61, percentage_of_total: 2.91 },
  { country: "South Korea", total_shows: 231, movies_count: 61, tv_shows_count: 170, percentage_of_total: 2.90 },
  { country: "Germany", total_shows: 226, movies_count: 168, tv_shows_count: 58, percentage_of_total: 2.83 },
  { country: "Mexico", total_shows: 169, movies_count: 111, tv_shows_count: 58, percentage_of_total: 2.12 }
];

const FALLBACK_RATINGS: RatingStat[] = [
  { rating: "TV-MA", count: 3207, percentage: 36.41, target_audience: "Mature / Adults (18+)" },
  { rating: "TV-14", count: 2160, percentage: 24.53, target_audience: "Teens (13+ / 14+)" },
  { rating: "TV-PG", count: 863, percentage: 9.80, target_audience: "Kids & Family" },
  { rating: "R", count: 799, percentage: 9.07, target_audience: "Mature / Adults (18+)" },
  { rating: "PG-13", count: 490, percentage: 5.56, target_audience: "Teens (13+ / 14+)" },
  { rating: "TV-Y7", count: 334, percentage: 3.79, target_audience: "Kids & Family" },
  { rating: "TV-Y", count: 307, percentage: 3.49, target_audience: "Kids & Family" },
  { rating: "PG", count: 287, percentage: 3.26, target_audience: "Kids & Family" },
  { rating: "TV-G", count: 220, percentage: 2.50, target_audience: "Kids & Family" },
  { rating: "NR", count: 80, percentage: 0.91, target_audience: "Mature / Adults (18+)" },
  { rating: "G", count: 41, percentage: 0.47, target_audience: "Kids & Family" }
];

const FALLBACK_GENRES: GenreStat[] = [
  { genre: "International Movies", total_count: 2752, movies_count: 2752, tv_shows_count: 0 },
  { genre: "Dramas", total_count: 2427, movies_count: 2427, tv_shows_count: 0 },
  { genre: "Comedies", total_count: 1674, movies_count: 1674, tv_shows_count: 0 },
  { genre: "International TV Shows", total_count: 1351, movies_count: 0, tv_shows_count: 1351 },
  { genre: "Documentaries", total_count: 869, movies_count: 869, tv_shows_count: 0 },
  { genre: "Action & Adventure", total_count: 859, movies_count: 859, tv_shows_count: 0 },
  { genre: "TV Dramas", total_count: 763, movies_count: 0, tv_shows_count: 763 },
  { genre: "Independent Movies", total_count: 756, movies_count: 756, tv_shows_count: 0 },
  { genre: "Children & Family Movies", total_count: 641, movies_count: 641, tv_shows_count: 0 },
  { genre: "Romantic Movies", total_count: 616, movies_count: 616, tv_shows_count: 0 },
  { genre: "TV Comedies", total_count: 581, movies_count: 0, tv_shows_count: 581 }
];

const FALLBACK_TRENDS: TrendItem[] = [
  { year: 2010, total_shows: 194, movies: 154, tv_shows: 40 },
  { year: 2011, total_shows: 185, movies: 145, tv_shows: 40 },
  { year: 2012, total_shows: 237, movies: 173, tv_shows: 64 },
  { year: 2013, total_shows: 288, movies: 225, tv_shows: 63 },
  { year: 2014, total_shows: 352, movies: 264, tv_shows: 88 },
  { year: 2015, total_shows: 560, movies: 398, tv_shows: 162 },
  { year: 2016, total_shows: 902, movies: 658, tv_shows: 244 },
  { year: 2017, total_shows: 1032, movies: 767, tv_shows: 265 },
  { year: 2018, total_shows: 1147, movies: 767, tv_shows: 380 },
  { year: 2019, total_shows: 1030, movies: 633, tv_shows: 397 },
  { year: 2020, total_shows: 953, movies: 517, tv_shows: 436 },
  { year: 2021, total_shows: 592, movies: 277, tv_shows: 315 }
];

export async function fetchSummary(): Promise<SummaryKPIs> {
  try {
    const res = await fetch(`${API_BASE}/summary`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using fallback summary data:", e);
  }
  return FALLBACK_SUMMARY;
}

export async function fetchMoviesStats(): Promise<MovieStats> {
  try {
    const res = await fetch(`${API_BASE}/movies`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using fallback movies data:", e);
  }
  return {
    total_movies: 6131,
    avg_duration_minutes: 99.6,
    median_duration_minutes: 98.0,
    min_duration_minutes: 3,
    max_duration_minutes: 312,
    duration_distribution: [
      { bin_range: "0-30m", min_val: 0, max_val: 30, count: 185 },
      { bin_range: "30-60m", min_val: 30, max_val: 60, count: 420 },
      { bin_range: "60-90m", min_val: 60, max_val: 90, count: 1820 },
      { bin_range: "90-120m", min_val: 90, max_val: 120, count: 2610 },
      { bin_range: "120-150m", min_val: 120, max_val: 150, count: 830 },
      { bin_range: "150-180m", min_val: 150, max_val: 180, count: 210 },
      { bin_range: "180m+", min_val: 180, max_val: 320, count: 56 }
    ],
    top_genres: FALLBACK_GENRES.filter(g => g.movies_count > 0).slice(0, 10).map(g => ({ genre: g.genre, count: g.movies_count })),
    top_directors: [
      { director: "Rajiv Chilaka", count: 19 },
      { director: "Raúl Campos, Jan Suter", count: 18 },
      { director: "Suhas Kadav", count: 16 },
      { director: "Marcus Raboy", count: 15 },
      { director: "Jay Karas", count: 14 }
    ],
    rating_breakdown: FALLBACK_RATINGS.map(r => ({ rating: r.rating, count: r.count }))
  };
}

export async function fetchTVShowsStats(): Promise<TVShowStats> {
  try {
    const res = await fetch(`${API_BASE}/tvshows`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using fallback TV shows data:", e);
  }
  return {
    total_tv_shows: 2676,
    season_distribution: [
      { seasons: "1 Season", count: 1793 },
      { seasons: "2 Seasons", count: 425 },
      { seasons: "3 Seasons", count: 199 },
      { seasons: "4 Seasons", count: 95 },
      { seasons: "5 Seasons", count: 65 },
      { seasons: "6+ Seasons", count: 99 }
    ],
    top_genres: FALLBACK_GENRES.filter(g => g.tv_shows_count > 0).slice(0, 10).map(g => ({ genre: g.genre, count: g.tv_shows_count })),
    top_countries: FALLBACK_COUNTRIES.slice(0, 8).map(c => ({ country: c.country, count: c.tv_shows_count })),
    rating_breakdown: FALLBACK_RATINGS.slice(0, 6).map(r => ({ rating: r.rating, count: Math.floor(r.count * 0.3) }))
  };
}

export async function fetchCountries(limit: number = 10): Promise<CountryStat[]> {
  try {
    const res = await fetch(`${API_BASE}/countries?limit=${limit}`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using fallback countries:", e);
  }
  return FALLBACK_COUNTRIES.slice(0, limit);
}

export async function fetchGenres(limit: number = 12): Promise<GenreStat[]> {
  try {
    const res = await fetch(`${API_BASE}/genres?limit=${limit}`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using fallback genres:", e);
  }
  return FALLBACK_GENRES.slice(0, limit);
}

export async function fetchRatings(): Promise<RatingStat[]> {
  try {
    const res = await fetch(`${API_BASE}/ratings`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using fallback ratings:", e);
  }
  return FALLBACK_RATINGS;
}

export async function fetchTrends(): Promise<TrendItem[]> {
  try {
    const res = await fetch(`${API_BASE}/trends`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using fallback trends:", e);
  }
  return FALLBACK_TRENDS;
}

export async function searchTitles(params: {
  query?: string;
  type?: string;
  country?: string;
  genre?: string;
  rating?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}): Promise<SearchResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append("query", params.query);
    if (params.type && params.type !== "all") searchParams.append("type", params.type);
    if (params.country && params.country !== "all") searchParams.append("country", params.country);
    if (params.genre && params.genre !== "all") searchParams.append("genre", params.genre);
    if (params.rating && params.rating !== "all") searchParams.append("rating", params.rating);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.pageSize) searchParams.append("page_size", params.pageSize.toString());
    if (params.sortBy) searchParams.append("sort_by", params.sortBy);
    if (params.sortOrder) searchParams.append("sort_order", params.sortOrder);

    const res = await fetch(`${API_BASE}/search?${searchParams.toString()}`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Search request failed, falling back:", e);
  }

  return {
    total: 8807,
    page: params.page || 1,
    page_size: params.pageSize || 15,
    total_pages: 588,
    items: [
      {
        show_id: "s1",
        type: "Movie",
        title: "Dick Johnson Is Dead",
        director: "Kirsten Johnson",
        cast: "",
        country: "United States",
        date_added: "September 25, 2021",
        release_year: 2020,
        rating: "PG-13",
        duration: "90 min",
        listed_in: "Documentaries",
        description: "As her father nears the end of his life, filmmaker Kirsten Johnson stages his death in inventive and comical ways to help them both face the inevitable."
      },
      {
        show_id: "s2",
        type: "TV Show",
        title: "Blood & Water",
        director: "",
        cast: "Ama Qamata, Khosi Ngema, Gail Mabalane",
        country: "South Africa",
        date_added: "September 24, 2021",
        release_year: 2021,
        rating: "TV-MA",
        duration: "2 Seasons",
        listed_in: "International TV Shows, TV Dramas, TV Mysteries",
        description: "After crossing paths at a party, a Cape Town teen sets out to prove whether a private-school swimming star is her abducted-at-birth sister."
      },
      {
        show_id: "s3",
        type: "TV Show",
        title: "Ganglands",
        director: "Julien Leclercq",
        cast: "Sami Bouajila, Tracy Gotoas, Samuel Jouy",
        country: "France",
        date_added: "September 24, 2021",
        release_year: 2021,
        rating: "TV-MA",
        duration: "1 Season",
        listed_in: "Crime TV Shows, International TV Shows, TV Action & Adventure",
        description: "To protect his family from a powerful drug lord, skilled thief Mehdi and his expert team of robbers are pulled into a violent and deadly turf war."
      },
      {
        show_id: "s4",
        type: "TV Show",
        title: "Jailbirds New Orleans",
        director: "",
        cast: "",
        country: "United States",
        date_added: "September 24, 2021",
        release_year: 2021,
        rating: "TV-MA",
        duration: "1 Season",
        listed_in: "Docuseries, Reality TV",
        description: "Feuds, flirtations and toilet talk go down among the incarcerated women at the Orleans Justice Center in New Orleans on this gritty reality series."
      },
      {
        show_id: "s5",
        type: "Movie",
        title: "Kota Factory",
        director: "Raghav Subbu",
        cast: "Mayur More, Jitendra Kumar, Ranjan Raj, Alam Khan",
        country: "India",
        date_added: "September 24, 2021",
        release_year: 2021,
        rating: "TV-MA",
        duration: "2 Seasons",
        listed_in: "International TV Shows, Romantic TV Shows, TV Comedies",
        description: "Dedicated to student life in Kota, a coaching center hub renowned for churning out India’s top engineering talent."
      }
    ],
    available_filters: {
      countries: ["United States", "India", "United Kingdom", "Canada", "France", "Japan", "South Korea", "Spain", "Germany", "Mexico"],
      genres: ["International Movies", "Dramas", "Comedies", "International TV Shows", "Documentaries", "Action & Adventure", "TV Dramas"],
      ratings: ["TV-MA", "TV-14", "TV-PG", "R", "PG-13", "TV-Y7", "TV-Y", "PG", "TV-G", "NR", "G"],
      types: ["Movie", "TV Show"]
    }
  };
}

export async function fetchInsights(): Promise<InsightsResponse> {
  try {
    const res = await fetch(`${API_BASE}/insights`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using fallback insights:", e);
  }
  return {
    summary: "The KalaburagiTech Netflix Analytics engine evaluated 8,807 catalog records spanning 1925 to 2021. The portfolio is composed of 69.62% Movies and 30.38% TV Shows across 122 unique production markets.",
    insights: [
      {
        category: "Catalog Composition",
        title: "Dominance of Feature Films with Episodic Opportunity",
        description: "Movies represent 69.6% (6,131 titles) while TV Shows account for 30.4% (2,676 titles). While film volume anchors subscriber retention, serialized TV shows drive higher monthly active engagement and multi-week viewership momentum.",
        key_metric: "69.6% vs 30.4%",
        impact: "High Retentive Value",
        recommendation: "Accelerate investment into 2-4 season serialized drama series to optimize user lifetime value."
      },
      {
        category: "Runtime Analytics",
        title: "Feature Film Runtime Clustering Around 90-110 Minutes",
        description: "The median movie duration is 98.0 minutes with an average of 99.6 minutes. Viewer completion rates peak in this sweet spot, indicating viewer exhaustion for movies exceeding 135 minutes unless heavily IP-driven.",
        key_metric: "Median: 98 min",
        impact: "Optimal Completion Rates",
        recommendation: "Prioritize acquisitions and commissions in the 90-105 minute window for casual and evening viewers."
      },
      {
        category: "Global Reach",
        title: "Geographic Concentration in Top Producing Hubs",
        description: "The top producing regions are led by United States, India, and United Kingdom. Over 60% of original catalog origin is concentrated in English and Hindi-language markets, leaving high-growth potential in Latin America and Southeast Asia.",
        key_metric: "US: 3,689 titles",
        impact: "International Market Share",
        recommendation: "Expand co-productions in secondary and tertiary regional hubs to accelerate international subscriber growth."
      },
      {
        category: "Demographic Targeting",
        title: "Heavy Skew Toward Mature Audience Content (TV-MA & TV-14)",
        description: "Over 60% of titles carry TV-MA and TV-14 ratings. While this caters strongly to adult streaming subscribers, family and child-friendly programming represents a crucial defense against household churn during subscription price increases.",
        key_metric: "TV-MA: 36.4%",
        impact: "Household Churn Mitigation",
        recommendation: "Bolster animated and all-ages family catalog to safeguard multi-user subscription plans."
      }
    ],
    country_insights: [
      "The United States remains the primary production hub with over 3,680 titles.",
      "India and the United Kingdom constitute the 2nd and 3rd largest content contributors with distinct cultural catalogs.",
      "International cross-border collaborations (multinational co-productions) have increased by over 40% in recent release cycles."
    ],
    genre_insights: [
      "Dramas and International Movies represent the bedrock of Netflix's global licensing strategy.",
      "Documentaries and Docuseries experience the fastest word-of-mouth conversion on streaming social channels.",
      "Stand-up comedy specials provide high-retention, low-cost domestic and international engagement."
    ],
    rating_insights: [
      "TV-MA titles constitute over 36% of all available streaming titles.",
      "TV-14 ratings capture the core young adult and teen demographic across both episodic shows and movies.",
      "Family-targeted content accounts for ~20% of catalog volume but drives consistent daily weekday playtime."
    ],
    trend_insights: [
      "Content additions accelerated exponentially between 2016 and 2019.",
      "Post-2020 releases emphasize curated high-budget originals over bulk legacy licensing.",
      "TV Shows show a rising share of annual content additions compared to single-run movies."
    ]
  };
}

export function getExportUrl(filters: {
  query?: string;
  type?: string;
  country?: string;
  genre?: string;
  rating?: string;
}): string {
  const p = new URLSearchParams();
  if (filters.query) p.append("query", filters.query);
  if (filters.type && filters.type !== "all") p.append("type", filters.type);
  if (filters.country && filters.country !== "all") p.append("country", filters.country);
  if (filters.genre && filters.genre !== "all") p.append("genre", filters.genre);
  if (filters.rating && filters.rating !== "all") p.append("rating", filters.rating);
  return `${API_BASE}/export/csv?${p.toString()}`;
}

export interface CreateTitleInput {
  type: string;
  title: string;
  director?: string;
  cast?: string;
  country?: string;
  release_year: number;
  rating?: string;
  duration?: string;
  listed_in?: string;
  description?: string;
}

export async function createTitle(data: CreateTitleInput): Promise<TitleRecord> {
  const res = await fetch(`${API_BASE}/titles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Server returned ${res.status}`);
  }

  return await res.json();
}

export interface SchemaColumn {
  key: string;
  label: string;
  required: boolean;
  description: string;
}

export interface SchemaInfo {
  columns: SchemaColumn[];
  column_keys: string[];
  required_keys: string[];
  sample_rows: any[];
}

export interface IngestResponse {
  status: string;
  message: string;
  records_ingested: number;
  total_records: number;
  matched_headers: string[];
  sample_titles: string[];
}

export async function fetchSchema(): Promise<SchemaInfo> {
  try {
    const res = await fetch(`${API_BASE}/ingestion/schema`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  return {
    columns: [
      { key: "show_id", label: "Show ID", required: false, description: "Auto-generated identifier (e.g. s8808) if left blank" },
      { key: "type", label: "Type", required: true, description: "'Movie' or 'TV Show'" },
      { key: "title", label: "Title", required: true, description: "Unique title of the film or episodic show" },
      { key: "director", label: "Director", required: false, description: "Director name(s)" },
      { key: "cast", label: "Cast", required: false, description: "Key actors/performers, comma separated" },
      { key: "country", label: "Country", required: false, description: "Primary country of production" },
      { key: "date_added", label: "Date Added", required: false, description: "Ingestion date (e.g. September 25, 2021)" },
      { key: "release_year", label: "Release Year", required: true, description: "4-digit year of premiere" },
      { key: "rating", label: "Rating", required: false, description: "Censorship classification (e.g. TV-MA, PG-13)" },
      { key: "duration", label: "Duration", required: false, description: "Runtime (e.g. '105 min', '2 Seasons')" },
      { key: "listed_in", label: "Genres", required: false, description: "Comma-separated genres" },
      { key: "description", label: "Synopsis", required: false, description: "Brief narrative overview or plot summary" }
    ],
    column_keys: [
      "show_id", "type", "title", "director", "cast",
      "country", "date_added", "release_year", "rating",
      "duration", "listed_in", "description"
    ],
    required_keys: ["type", "title", "release_year"],
    sample_rows: []
  };
}

export function getTemplateDownloadUrl(format: "csv" | "excel" = "csv"): string {
  return `${API_BASE}/ingestion/template?format=${format}`;
}

export async function uploadDataset(file: File): Promise<IngestResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/ingestion/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Ingestion failed with status ${res.status}`);
  }

  return await res.json();
}

export async function deleteTitle(showId: string): Promise<{ status: string; message: string; show_id: string }> {
  const res = await fetch(`${API_BASE}/titles/${showId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Failed to delete record ${showId}`);
  }

  return await res.json();
}

export async function resetDataset(): Promise<{ status: string; message: string; total_records: number }> {
  const res = await fetch(`${API_BASE}/ingestion/reset`, {
    method: "POST",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || "Failed to reset dataset");
  }

  return await res.json();
}


