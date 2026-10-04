import pytest
import pandas as pd
from backend.app.services.data_cleaner import data_cleaner

def test_clean_data_handles_nulls():
    df_clean = data_cleaner.clean_data()
    assert df_clean is not None
    assert 'duration_num' in df_clean.columns
    assert 'primary_country' in df_clean.columns
    assert 'audience_category' in df_clean.columns

def test_eda_clean_subset():
    df_eda = data_cleaner.get_eda_clean_subset()
    clean_subset = ['type', 'release_year', 'rating', 'country', 'duration']
    for col in clean_subset:
        assert df_eda[col].isnull().sum() == 0

def test_duration_parsing():
    df_clean = data_cleaner.clean_data()
    movies = df_clean[df_clean['type'] == 'Movie']
    # Duration for movies should be positive integers
    valid_durations = movies['duration_num'].dropna()
    assert len(valid_durations) > 0
    assert (valid_durations > 0).all()
