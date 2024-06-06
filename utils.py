from scipy.stats import norm
import numpy as np

def calculate_required_games(standard_deviation, accuracy, confidence_level):
    z_score = norm.ppf((1 + confidence_level) / 2)
    required_games = (z_score * standard_deviation / accuracy) ** 2
    return int(np.ceil(required_games))