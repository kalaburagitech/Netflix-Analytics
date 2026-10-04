from typing import Tuple, List, Dict, Any
import pandas as pd
import numpy as np
import logging
from backend.app.services.data_loader import data_loader

logger = logging.getLogger(__name__)

class DataCleaner:
    _instance = None
    _clean_df: pd.DataFrame = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = DataCleaner()
        return cls._instance

    def __init__(self):
        self._clean_df = None

    def clean_data(self, df: pd.DataFrame = None, force_refresh: bool = False) -> pd.DataFrame:
        if self._clean_df is not None and not force_refresh:
            return self._clean_df

        if df is None:
            df = data_loader.load_data()

        logger.info("Starting reproducible data cleaning pipeline...")
        df_clean = df.copy()

        # 1. Fill missing strings for metadata searchability
        df_clean['director'] = df_clean['director'].fillna('Unknown Director')
        df_clean['cast'] = df_clean['cast'].fillna('Unknown Cast')
        df_clean['country'] = df_clean['country'].fillna('Unknown Country')
        df_clean['description'] = df_clean['description'].fillna('')
        df_clean['listed_in'] = df_clean['listed_in'].fillna('Uncategorized')
        df_clean['rating'] = df_clean['rating'].fillna('Not Rated')

        # 2. Extract primary country
        df_clean['primary_country'] = df_clean['country'].apply(
            lambda x: x.split(',')[0].strip() if isinstance(x, str) else 'Unknown'
        )

        # 3. Clean duration
        # Movies: duration in minutes (integer)
        # TV Shows: season count (integer)
        def parse_duration(row):
            val = str(row['duration']).strip()
            if row['type'] == 'Movie':
                if 'min' in val:
                    try:
                        return int(val.replace('min', '').strip())
                    except ValueError:
                        return np.nan
                return np.nan
            else: # TV Show
                if 'Season' in val:
                    try:
                        return int(val.split(' ')[0].strip())
                    except ValueError:
                        return np.nan
                return np.nan

        df_clean['duration_num'] = df_clean.apply(parse_duration, axis=1)

        # 4. Standardize date_added and extract year/month
        df_clean['date_added_dt'] = pd.to_datetime(df_clean['date_added'].str.strip(), errors='coerce')
        df_clean['year_added'] = df_clean['date_added_dt'].dt.year.fillna(0).astype(int)
        df_clean['month_added'] = df_clean['date_added_dt'].dt.month_name().fillna('Unknown')

        # 5. Extract ratings category
        def classify_rating(r):
            r = str(r).upper().strip()
            adult = ['TV-MA', 'R', 'NC-17', 'NR', 'UR']
            teens = ['TV-14', 'PG-13']
            kids_family = ['TV-PG', 'PG', 'TV-Y7', 'TV-Y7-FV', 'TV-Y', 'TV-G', 'G']
            if r in adult:
                return 'Mature / Adults (18+)'
            elif r in teens:
                return 'Teens (13+ / 14+)'
            elif r in kids_family:
                return 'Kids & Family'
            return 'General / Unrated'

        df_clean['audience_category'] = df_clean['rating'].apply(classify_rating)

        self._clean_df = df_clean
        logger.info(f"Data cleaning complete. Total records: {len(self._clean_df)}")
        return self._clean_df

    def get_eda_clean_subset(self, df: pd.DataFrame = None) -> pd.DataFrame:
        """
        Original EDA subset from notebook:
        clean_subset = ['type', 'release_year', 'rating', 'country', 'duration']
        df_clean = df.dropna(subset=clean_subset)
        """
        if df is None:
            df = data_loader.load_data()
        clean_subset = ['type', 'release_year', 'rating', 'country', 'duration']
        return df.dropna(subset=clean_subset).copy()

data_cleaner = DataCleaner.get_instance()
