import numpy as np
import pandas as pd
from realDataAnalysis import calculate_means

# number of samples
n_samples = 10_000

# ratio of near limit and regular
regular_ratio = 0.8
near_limit_ratio = 0.2  # 20% near limit

# near limit coefficient
near_limit_coefficient = 0.8

exceed_ratio = 0.05
below_detection_ratio = 0.02


correlation_matrix = np.array([
  # ['NH4','PO4','COD','BOD','Cond','pH','NTot','NO3','Turb','TSS']
    [1.00, 0.30, 0.60, 0.50, 0.70, -0.40, 0.80, 0.20, 0.40, 0.45],  # 'NH4'
    [0.30, 1.00, 0.50, 0.40, 0.50, -0.30, 0.50, 0.10, 0.30, 0.35],  # 'PO4'
    [0.60, 0.50, 1.00, 0.85, 0.65, -0.20, 0.65, 0.25, 0.55, 0.60],  # 'COD'
    [0.50, 0.40, 0.85, 1.00, 0.60, -0.30, 0.55, 0.20, 0.50, 0.55],  # 'BOD'
    [0.70, 0.50, 0.65, 0.60, 1.00, -0.50, 0.75, 0.30, 0.45, 0.50],  # 'Cond'
    [-0.4, -0.3, -0.2, -0.3, -0.5, 1.00, -0.35, -0.1, -0.25, -0.3],  # 'pH'
    [0.80, 0.50, 0.65, 0.55, 0.75, -0.35, 1.00, 0.40, 0.50, 0.55],  # 'NTot'
    [0.20, 0.10, 0.25, 0.20, 0.30, -0.10, 0.40, 1.00, 0.15, 0.10],  # 'NO3'
    [0.40, 0.30, 0.55, 0.50, 0.45, -0.25, 0.50, 0.15, 1.00, 0.85],  # 'Turb'
    [0.45, 0.35, 0.60, 0.55, 0.50, -0.30, 0.55, 0.10, 0.85, 1.00]   # 'TSS'
])


# supposed legal ranges
ranges = {
    'Ammonium (mg/l N)': (0.0, 1.5),
    'Ortho Phosphate (mg/l P)': (0.0, 0.9),
    'COD (mg/l O2)': (0.0, 125.0),
    'BOD (mg/l O2)': (0.0, 25.0),
    'Conductivity (mS/m)': (0.0, 100.0),
    'pH': (7.0, 9.0),
    'Nitrogen Total (mg/l N)': (0.0, 25.0),
    'Nitrate (mg/l NO3)': (0.0, 50.0),
    'Turbidity (NTU)': (0.0, 50.0),
    'TSS (mg/l)': (0.0, 35.0),
}


def generate_dataset(ranges, n_samples):
    print("dataset generation...")
    data = {param: [] for param in ranges}
    target = []
    params = list(ranges.keys())

    for _ in range(n_samples):
        is_near = np.random.rand() < near_limit_ratio  # 20% near limit

        for param, (low, high) in ranges.items():
            if is_near:
                near_limit_param_count = np.random.choice([1, 2, 3], p=[0.6, 0.3, 0.1])

                near_limit_params = set(np.random.choice(params, size=near_limit_param_count, replace=False))
                if low:
                    difference = high - low
                    if param in near_limit_params:
                        value = np.random.uniform(high - difference * (1 - near_limit_coefficient), high)
                    else:
                        value = np.random.uniform(low, high - difference * near_limit_coefficient)
                else:
                    if param in near_limit_params:
                        value = np.random.uniform(high * near_limit_coefficient, high)
                    else:
                        value = np.random.uniform(low, high * near_limit_coefficient)
            else:
                if low:
                    difference = high - low
                    value = np.random.uniform(low, high - difference * near_limit_coefficient)
                else:
                    value = np.random.uniform(low, high * near_limit_coefficient)

            data[param].append(value)
        target.append(int(is_near))  # 1 if near, 0 otherwise

    data['Near_Limit'] = target
    return data


def sample_within_range(mean, std, low, high):
    while True:
        value = np.random.normal(mean, std)
        if low <= value <= high:
            return value


def generate_realistic_dataset(ranges, n_samples):
    print("dataset generation...")
    data = {param: [] for param in ranges}
    near_limit_param_list = []
    target = []
    params = list(ranges.keys())

    mean_dict, std_dict = calculate_means(pd.read_excel('real_measurements.xlsx', sheet_name='20025'))

    means = np.array([mean_dict[param] for param in params])
    stds = np.array([std_dict[param] for param in params])

    print('mean values:')
    for key, value in mean_dict.items():
        print(key, value)

    covariance_matrix = correlation_matrix * np.outer(stds, stds)

    synthetic_samples = np.random.multivariate_normal(means, covariance_matrix, size=n_samples)

    raw_df = pd.DataFrame(synthetic_samples, columns=params)

    raw_df.to_excel("synthetic_raw_before_clipping.xlsx", index=False)

    for i, param in enumerate(params):
        low, high = ranges[param]
        synthetic_samples[:, i] = abs(synthetic_samples[:, i])

    for row in synthetic_samples:
        is_near = np.random.rand() < near_limit_ratio

        if is_near:
            near_limit_param_count = np.random.choice([1, 2, 3], p=[0.6, 0.3, 0.1])
            near_limit_params = set(np.random.choice(params, size=near_limit_param_count, replace=False))
            near_limit_param_list.append(','.join(sorted(near_limit_params)))

            new_row = []
            for i, param in enumerate(params):
                low, high = ranges[param]
                difference = high - low
                if param in near_limit_params:
                    # value = np.random.uniform(high - difference * (1 - near_limit_coefficient), high)  # ?
                    value = sample_within_range(means[i] + stds[i], stds[i] * 0.5, low, high)  # do usprawnienia bo moze byc juz ponad srednia duzo
                else:
                    # value = sample_within_range(means[i], stds[i], low, high)
                    value = row[i]
                # value = np.clip(value, low, high)  # ?

                new_row.append(value)
                data[param].append(value)

        else:
            near_limit_param_list.append('')
            for i, param in enumerate(params):
                value = row[i]
                data[param].append(value)

        target.append(int(is_near))  # 1 if near, 0 otherwise

    data['Near_Limit'] = target
    data['Near_Limit_Params'] = near_limit_param_list
    return data
