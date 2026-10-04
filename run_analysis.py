"""KalaburagiTech Netflix Analytics Platform - CLI Analysis Pipeline
Executes data loading, cleaning, statistics computation, and visualization rendering.
"""

from pathlib import Path
import sys
import matplotlib.pyplot as plt
from backend.app.services.data_cleaner import data_cleaner
from backend.app.services.analytics_service import analytics_service

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def main():
    print("=" * 70)
    print("KalaburagiTech Netflix Analytics Pipeline")
    print("=" * 70)

    # 1. Ingestion & Preprocessing
    df = data_cleaner.clean_data()
    df_clean = data_cleaner.get_eda_clean_subset()
    print(f"Ingested raw dataset: {len(df):,} total records")
    print(f"Cleaned EDA subset: {len(df_clean):,} records")

    # 2. Key Metrics
    summary = analytics_service.get_summary()
    print(f"Movies: {summary.total_movies:,} ({summary.movies_percentage}%)")
    print(f"TV Shows: {summary.total_tv_shows:,} ({summary.tv_shows_percentage}%)")
    print(f"Countries: {summary.total_countries} | Genres: {summary.total_genres}")
    print(f"Release Range: {summary.min_release_year} - {summary.max_release_year}")

    # 3. Output directory
    output_dir = Path("outputs")
    output_dir.mkdir(parents=True, exist_ok=True)

    # Visualizations
    print("\nGenerating visual charts into 'outputs/'...")

    # Chart 1: Movies vs TV Shows
    type_counts = df_clean['type'].value_counts()
    plt.figure(figsize=(6, 4))
    plt.bar(type_counts.index, type_counts.values, color=['#E50914', '#F59E0B'])
    plt.title('Number of Movies vs TV Shows (KalaburagiTech)')
    plt.xlabel('Type')
    plt.ylabel('Count')
    plt.tight_layout()
    plt.savefig(output_dir / 'movies_vs_tv.png', dpi=300)
    plt.close()
    print("  ✓ outputs/movies_vs_tv.png")

    # Chart 2: Content Ratings Pie
    rating_counts = df_clean['rating'].value_counts()
    plt.figure(figsize=(8, 6))
    plt.pie(rating_counts, labels=rating_counts.index, autopct='%1.1f%%', startangle=90)
    plt.title('Percentage of Content Ratings (KalaburagiTech)')
    plt.tight_layout()
    plt.savefig(output_dir / 'content_rating_pie.png', dpi=300)
    plt.close()
    print("  ✓ outputs/content_rating_pie.png")

    # Chart 3: Movie Duration Histogram
    movies_df = df_clean[df_clean['type'] == 'Movie'].copy()
    movies_df['duration_int'] = movies_df['duration'].str.replace('min', '', regex=False).str.strip().astype(int)
    plt.figure(figsize=(8, 6))
    plt.hist(movies_df['duration_int'], bins=30, color='#8B5CF6', edgecolor='black')
    plt.title('Distribution of Movie Duration (KalaburagiTech)')
    plt.xlabel('Duration (minutes)')
    plt.ylabel('Number of movies')
    plt.tight_layout()
    plt.savefig(output_dir / 'movie_dur_hist.png', dpi=300)
    plt.close()
    print("  ✓ outputs/movie_dur_hist.png")

    # Chart 4: Top 10 Countries
    top10 = df_clean['country'].value_counts().head(10)
    plt.figure(figsize=(10, 7))
    plt.barh(top10.index[::-1], top10.values[::-1], color='#0D9488')
    plt.title('Top 10 Countries by Number of Shows (KalaburagiTech)')
    plt.xlabel('Number of Shows')
    plt.ylabel('Country')
    plt.tight_layout()
    plt.savefig(output_dir / 'top10_countries.png', dpi=300)
    plt.close()
    print("  ✓ outputs/top10_countries.png")

    # Chart 5: Release Year vs Number of Shows
    release_counts = df_clean['release_year'].value_counts().sort_index()
    plt.figure(figsize=(10, 6))
    plt.scatter(release_counts.index, release_counts.values, color='#E50914')
    plt.title('Release Year versus Number of Shows (KalaburagiTech)')
    plt.xlabel('Release Year')
    plt.ylabel('Number of Shows')
    plt.tight_layout()
    plt.savefig(output_dir / 'release_year_vs_show.png', dpi=300)
    plt.close()
    print("  ✓ outputs/release_year_vs_show.png")

    # Chart 6: Movies vs TV Shows Released Over Years
    movies_by_year = df_clean[df_clean['type'] == 'Movie']['release_year'].value_counts().sort_index()
    tv_by_year = df_clean[df_clean['type'] == 'TV Show']['release_year'].value_counts().sort_index()
    plt.figure(figsize=(10, 5))
    plt.plot(movies_by_year.index, movies_by_year.values, color='#E50914', label='Movies')
    plt.plot(tv_by_year.index, tv_by_year.values, color='#F59E0B', label='TV Shows')
    plt.title('Comparison of Movies and TV Shows Released Over Years (KalaburagiTech)')
    plt.xlabel('Year')
    plt.ylabel('Number of Titles')
    plt.legend()
    plt.tight_layout()
    plt.savefig(output_dir / 'movies_tv_shows_comp.png', dpi=300)
    plt.close()
    print("  ✓ outputs/movies_tv_shows_comp.png")

    # Chart 7: Top Genres Comparison
    movie_genres = df_clean[df_clean['type'] == 'Movie']['listed_in'].str.split(', ').explode().value_counts().head(10)
    tv_genres = df_clean[df_clean['type'] == 'TV Show']['listed_in'].str.split(', ').explode().value_counts().head(10)
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    axes[0].barh(movie_genres.index[::-1], movie_genres.values[::-1], color='#3B82F6')
    axes[0].set_title('Top 10 Movie Genres')
    axes[0].set_xlabel('Count')
    axes[1].barh(tv_genres.index[::-1], tv_genres.values[::-1], color='#F59E0B')
    axes[1].set_title('Top 10 TV Show Genres')
    axes[1].set_xlabel('Count')
    plt.tight_layout()
    plt.savefig(output_dir / 'genre_distribution.png', dpi=300)
    plt.close()
    print("  ✓ outputs/genre_distribution.png")

    print("\n✅ All visualizations and analytics successfully generated!")
    print("=" * 70)

if __name__ == "__main__":
    main()
