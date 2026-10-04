import pytest
from backend.app.services.analytics_service import analytics_service

def test_summary_kpis():
    kpis = analytics_service.get_summary()
    assert kpis.total_titles >= 8807
    assert kpis.total_movies >= 6131
    assert kpis.total_tv_shows >= 2676
    assert round(kpis.movies_percentage + kpis.tv_shows_percentage, 0) == 100.0
    assert kpis.min_release_year <= 1925
    assert kpis.max_release_year >= 2021

def test_movies_stats():
    stats = analytics_service.get_movies_stats()
    assert stats.total_movies >= 6131
    assert 90 <= stats.avg_duration_minutes <= 110
    assert len(stats.duration_distribution) > 0
    assert len(stats.top_genres) > 0

def test_tv_shows_stats():
    tv_stats = analytics_service.get_tv_shows_stats()
    assert tv_stats.total_tv_shows == 2676
    assert len(tv_stats.season_distribution) > 0

def test_countries_stats():
    countries = analytics_service.get_countries_stats(10)
    assert len(countries) == 10
    assert countries[0].country == 'United States'
    assert countries[0].total_shows > 1000

def test_trends():
    trends = analytics_service.get_trends()
    assert len(trends) > 20
    # verify year ordering
    years = [t.year for t in trends]
    assert years == sorted(years)

def test_search_and_pagination():
    res = analytics_service.search_titles(query="drama", page=1, page_size=10)
    assert res.total > 0
    assert len(res.items) <= 10
    assert res.page == 1
    assert res.total_pages > 1
