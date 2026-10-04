from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
import math
from backend.app.services.data_cleaner import data_cleaner
from backend.app.models.schemas import (
    SummaryKPIs,
    MovieStatsResponse,
    TVShowStatsResponse,
    CountryStatItem,
    GenreStatItem,
    RatingStatItem,
    TrendItem,
    TitleRecord,
    SearchResponse
)

class AnalyticsService:
    def __init__(self):
        pass

    def get_df(self) -> pd.DataFrame:
        return data_cleaner.clean_data()

    def get_summary(self) -> SummaryKPIs:
        df = self.get_df()
        total = len(df)
        movies_cnt = int((df['type'] == 'Movie').sum())
        tv_cnt = int((df['type'] == 'TV Show').sum())
        
        # Countries: split by comma to count distinct countries
        countries = set()
        for c in df['country'].dropna():
            for item in str(c).split(','):
                name = item.strip()
                if name and name != 'Unknown Country':
                    countries.add(name)

        # Directors
        directors = set()
        for d in df['director'].dropna():
            for item in str(d).split(','):
                name = item.strip()
                if name and name != 'Unknown Director':
                    directors.add(name)

        # Genres
        genres = set()
        for g in df['listed_in'].dropna():
            for item in str(g).split(','):
                name = item.strip()
                if name:
                    genres.add(name)

        ratings = int(df['rating'].nunique())
        min_yr = int(df['release_year'].min())
        max_yr = int(df['release_year'].max())

        latest_record = df.dropna(subset=['date_added_dt']).sort_values('date_added_dt', ascending=False).head(1)
        latest_str = latest_record['title'].iloc[0] if not latest_record.empty else "N/A"

        return SummaryKPIs(
            total_titles=total,
            total_movies=movies_cnt,
            total_tv_shows=tv_cnt,
            movies_percentage=round((movies_cnt / total) * 100, 2) if total else 0.0,
            tv_shows_percentage=round((tv_cnt / total) * 100, 2) if total else 0.0,
            total_countries=len(countries),
            total_directors=len(directors),
            total_genres=len(genres),
            total_ratings=ratings,
            min_release_year=min_yr,
            max_release_year=max_yr,
            latest_addition=latest_str
        )

    def get_movies_stats(self) -> MovieStatsResponse:
        df = self.get_df()
        movies = df[df['type'] == 'Movie'].copy()
        durations = movies['duration_num'].dropna().astype(int)

        avg_dur = float(durations.mean()) if not durations.empty else 0.0
        med_dur = float(durations.median()) if not durations.empty else 0.0
        min_dur = int(durations.min()) if not durations.empty else 0
        max_dur = int(durations.max()) if not durations.empty else 0

        # Duration histogram with 30 bins matching notebook
        bins_data = []
        if not durations.empty:
            counts, bin_edges = np.histogram(durations, bins=15)
            for i in range(len(counts)):
                low = int(bin_edges[i])
                high = int(bin_edges[i+1])
                bins_data.append({
                    "bin_range": f"{low}-{high}m",
                    "min_val": low,
                    "max_val": high,
                    "count": int(counts[i])
                })

        # Top Genres
        movie_genres = (
            movies['listed_in']
            .str.split(', ')
            .explode()
            .str.strip()
            .value_counts()
            .head(10)
        )
        top_genres = [{"genre": g, "count": int(c)} for g, c in movie_genres.items()]

        # Top Directors
        directors = (
            movies[movies['director'] != 'Unknown Director']['director']
            .str.split(', ')
            .explode()
            .str.strip()
            .value_counts()
            .head(10)
        )
        top_directors = [{"director": d, "count": int(c)} for d, c in directors.items()]

        # Ratings
        ratings = movies['rating'].value_counts()
        rating_breakdown = [{"rating": r, "count": int(c)} for r, c in ratings.items()]

        return MovieStatsResponse(
            total_movies=len(movies),
            avg_duration_minutes=round(avg_dur, 1),
            median_duration_minutes=round(med_dur, 1),
            min_duration_minutes=min_dur,
            max_duration_minutes=max_dur,
            duration_distribution=bins_data,
            top_genres=top_genres,
            top_directors=top_directors,
            rating_breakdown=rating_breakdown
        )

    def get_tv_shows_stats(self) -> TVShowStatsResponse:
        df = self.get_df()
        tv = df[df['type'] == 'TV Show'].copy()

        # Seasons distribution
        seasons = tv['duration_num'].dropna().astype(int).value_counts().sort_index()
        season_dist = []
        for s, c in seasons.items():
            season_dist.append({
                "seasons": f"{s} Season{'s' if s > 1 else ''}",
                "count": int(c)
            })

        # Top Genres
        tv_genres = (
            tv['listed_in']
            .str.split(', ')
            .explode()
            .str.strip()
            .value_counts()
            .head(10)
        )
        top_genres = [{"genre": g, "count": int(c)} for g, c in tv_genres.items()]

        # Top Countries
        tv_countries = (
            tv[tv['country'] != 'Unknown Country']['country']
            .str.split(', ')
            .explode()
            .str.strip()
            .value_counts()
            .head(10)
        )
        top_countries = [{"country": k, "count": int(v)} for k, v in tv_countries.items()]

        # Ratings
        ratings = tv['rating'].value_counts()
        rating_breakdown = [{"rating": r, "count": int(c)} for r, c in ratings.items()]

        return TVShowStatsResponse(
            total_tv_shows=len(tv),
            season_distribution=season_dist[:10],
            top_genres=top_genres,
            top_countries=top_countries,
            rating_breakdown=rating_breakdown
        )

    def get_countries_stats(self, limit: int = 15) -> List[CountryStatItem]:
        df = self.get_df()
        valid = df[df['country'] != 'Unknown Country'].copy()
        
        # Explode multiple countries per record
        exploded = valid.assign(
            single_country=valid['country'].str.split(', ')
        ).explode('single_country')
        exploded['single_country'] = exploded['single_country'].str.strip()

        counts = exploded['single_country'].value_counts().head(limit)
        total_valid = len(valid)

        results = []
        for country, total_c in counts.items():
            sub = exploded[exploded['single_country'] == country]
            movies = int((sub['type'] == 'Movie').sum())
            tv = int((sub['type'] == 'TV Show').sum())
            pct = round((total_c / total_valid) * 100, 2) if total_valid else 0.0

            results.append(CountryStatItem(
                country=country,
                total_shows=int(total_c),
                movies_count=movies,
                tv_shows_count=tv,
                percentage_of_total=pct
            ))
        return results

    def get_genres_stats(self, limit: int = 15) -> List[GenreStatItem]:
        df = self.get_df()
        exploded = df.assign(
            single_genre=df['listed_in'].str.split(', ')
        ).explode('single_genre')
        exploded['single_genre'] = exploded['single_genre'].str.strip()

        counts = exploded['single_genre'].value_counts().head(limit)

        results = []
        for g, count in counts.items():
            sub = exploded[exploded['single_genre'] == g]
            movies = int((sub['type'] == 'Movie').sum())
            tv = int((sub['type'] == 'TV Show').sum())
            results.append(GenreStatItem(
                genre=g,
                total_count=int(count),
                movies_count=movies,
                tv_shows_count=tv
            ))
        return results

    def get_ratings_stats(self) -> List[RatingStatItem]:
        df = self.get_df()
        counts = df['rating'].value_counts()
        total = len(df)

        results = []
        for r, c in counts.items():
            sub = df[df['rating'] == r]
            category = sub['audience_category'].iloc[0] if not sub.empty else 'General / Unrated'
            pct = round((c / total) * 100, 2) if total else 0.0
            results.append(RatingStatItem(
                rating=str(r),
                count=int(c),
                percentage=pct,
                target_audience=category
            ))
        return results

    def get_trends(self) -> List[TrendItem]:
        df = self.get_df()
        # Group by release_year
        grouped = df.groupby(['release_year', 'type']).size().unstack(fill_value=0)
        
        # Ensure Movie and TV Show columns exist
        if 'Movie' not in grouped.columns:
            grouped['Movie'] = 0
        if 'TV Show' not in grouped.columns:
            grouped['TV Show'] = 0

        grouped['total'] = grouped['Movie'] + grouped['TV Show']
        
        # Filter reasonable year range for charting (e.g., from 1990 onwards or all)
        # We include from 2000 to current for main trend, but return all sorted
        trends = []
        for year in sorted(grouped.index):
            if year > 1920: # sanitize any corrupted outliers
                trends.append(TrendItem(
                    year=int(year),
                    total_shows=int(grouped.loc[year, 'total']),
                    movies=int(grouped.loc[year, 'Movie']),
                    tv_shows=int(grouped.loc[year, 'TV Show'])
                ))
        return trends

    def search_titles(
        self,
        query: Optional[str] = None,
        content_type: Optional[str] = None,
        country: Optional[str] = None,
        genre: Optional[str] = None,
        rating: Optional[str] = None,
        release_year_min: Optional[int] = None,
        release_year_max: Optional[int] = None,
        sort_by: str = "release_year",
        sort_order: str = "desc",
        page: int = 1,
        page_size: int = 20
    ) -> SearchResponse:
        df = self.get_df()
        filtered = df.copy()

        if content_type and content_type.lower() != 'all':
            filtered = filtered[filtered['type'].str.lower() == content_type.lower()]

        if country and country.lower() != 'all':
            filtered = filtered[filtered['country'].str.contains(country, case=False, na=False)]

        if genre and genre.lower() != 'all':
            filtered = filtered[filtered['listed_in'].str.contains(genre, case=False, na=False)]

        if rating and rating.lower() != 'all':
            filtered = filtered[filtered['rating'].str.lower() == rating.lower()]

        if release_year_min is not None:
            filtered = filtered[filtered['release_year'] >= release_year_min]

        if release_year_max is not None:
            filtered = filtered[filtered['release_year'] <= release_year_max]

        if query:
            q = query.lower()
            mask = (
                filtered['title'].str.lower().str.contains(q, na=False) |
                filtered['director'].str.lower().str.contains(q, na=False) |
                filtered['cast'].str.lower().str.contains(q, na=False) |
                filtered['description'].str.lower().str.contains(q, na=False)
            )
            filtered = filtered[mask]

        total = len(filtered)
        total_pages = math.ceil(total / page_size) if total > 0 else 1

        # Sorting
        ascending = (sort_order.lower() == 'asc')
        if sort_by in filtered.columns:
            filtered = filtered.sort_values(by=sort_by, ascending=ascending)
        else:
            filtered = filtered.sort_values(by='release_year', ascending=False)

        # Pagination
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        sliced = filtered.iloc[start_idx:end_idx]

        items = []
        for _, row in sliced.iterrows():
            items.append(TitleRecord(
                show_id=str(row['show_id']),
                type=str(row['type']),
                title=str(row['title']),
                director=str(row['director']) if row['director'] != 'Unknown Director' else '',
                cast=str(row['cast']) if row['cast'] != 'Unknown Cast' else '',
                country=str(row['country']) if row['country'] != 'Unknown Country' else '',
                date_added=str(row['date_added']) if pd.notna(row['date_added']) else '',
                release_year=int(row['release_year']),
                rating=str(row['rating']),
                duration=str(row['duration']),
                listed_in=str(row['listed_in']),
                description=str(row['description'])
            ))

        # Available filters metadata for the frontend dropdowns
        all_countries = sorted(list({
            c.strip() for c in df['country'].dropna().str.split(',').explode()
            if c.strip() and c.strip() != 'Unknown Country'
        }))
        all_genres = sorted(list({
            g.strip() for g in df['listed_in'].dropna().str.split(',').explode()
            if g.strip()
        }))
        all_ratings = sorted([r for r in df['rating'].dropna().unique() if str(r).strip()])

        return SearchResponse(
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            items=items,
            available_filters={
                "countries": all_countries[:40],
                "genres": all_genres,
                "ratings": all_ratings,
                "types": ["Movie", "TV Show"]
            }
        )

analytics_service = AnalyticsService()
