import pytest
import pandas as pd
from backend.app.services.data_loader import data_loader

def test_data_loader_returns_dataframe():
    df = data_loader.load_data()
    assert isinstance(df, pd.DataFrame)
    assert not df.empty
    assert len(df) >= 8807

def test_required_columns_exist():
    df = data_loader.load_data()
    required = [
        'show_id', 'type', 'title', 'director', 'cast',
        'country', 'date_added', 'release_year', 'rating',
        'duration', 'listed_in', 'description'
    ]
    for col in required:
        assert col in df.columns, f"Missing required column: {col}"
