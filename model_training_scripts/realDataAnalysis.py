import numpy as np

selected_params = ['ammonium', 'fosfaat', 'COD', 'Biochemisch zuurstofverbruik over 5 dagen',
                   'Geleidendheid', 'Zuurgraad', 'stikstof totaal', 'nitraat', 'Turbidity', 'TSS']

missing_params = ['COD', 'Turbidity', 'TSS']

assumed_means = {
    'COD': 40.0,
    'Turbidity': 1.0,
    'TSS': 5.0
}

rename_map = {
    'ammonium': 'Ammonium (mg/l N)',
    'fosfaat': 'Ortho Phosphate (mg/l P)',
    'COD': 'COD (mg/l O2)',
    'Biochemisch zuurstofverbruik over 5 dagen': 'BOD (mg/l O2)',
    'Geleidendheid': 'Conductivity (mS/m)',
    'Zuurgraad': 'pH',
    'Turbidity': 'Turbidity (NTU)',
    'stikstof totaal': 'Nitrogen Total (mg/l N)',
    'nitraat': 'Nitrate (mg/l NO3)',
    'TSS': 'TSS (mg/l)'
}


def read_data(df):
    print("Reading real data...")
    parameters_name = []
    # df = pd.read_excel('real_measurements.xlsx', sheet_name='20025')
    print(df.head())
    for rec in df['OMS_PARAMETER']:
        if rec not in parameters_name:
            parameters_name.append(rec)

    selected_df = df[df['OMS_PARAMETER'].isin(selected_params)].copy()

    other_df = df[~df['OMS_PARAMETER'].isin(selected_params)].copy()

    selected_df['OMS_PARAMETER'] = selected_df['OMS_PARAMETER'].replace(rename_map)

    selected_df = selected_df.drop(columns=['OPMERKING', 'BEGINDATUM', 'EINDDATUM', 'BEGINTIJD',
                                            'EINDTIJD', 'WNSIDENT', 'WNSOMSCH', 'OMS_EENHEID',
                                            'HOEDANIGHEID', 'OMS_HOEDANIGHEID', 'COMPARTIMENT',
                                            'OMS_COMPARTIMENT', 'PARAMETER', 'EENHEID',
                                            'KLEINER_GROTER', 'CODE_MONSTER', 'MPNIDENT', 'EENHEID'])

    selected_df.to_excel("selected_parameters.xlsx", index=False)
    other_df.to_excel("other_parameters.xlsx", index=False)


def extract_parameters(df):
    print("Extracting valuable samples...")
    param_values_dict = {}

    for param in selected_params:
        if param not in missing_params:
            values = df[df['OMS_PARAMETER'] == param]['WAARDE_O'].tolist()
            param_values_dict[rename_map[param]] = values

    for param, values in param_values_dict.items():
        print(f"{param} ({len(values)}):")
        print(values)
        print()

    return param_values_dict


def calculate_means(df):
    params_mean_values = {}
    params_std_values = {}
    params_values = extract_parameters(df)

    for param in selected_params:
        if param not in missing_params:
            params_mean_values[rename_map[param]] = np.mean(params_values[rename_map[param]])
            params_std_values[rename_map[param]] = np.std(params_values[rename_map[param]])
        else:
            params_mean_values[rename_map[param]] = assumed_means[param]
            params_std_values[rename_map[param]] = assumed_means[param]

    return params_mean_values, params_std_values
