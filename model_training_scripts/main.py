import pandas as pd
from datasetGeneration import generate_dataset, n_samples, ranges, near_limit_coefficient
from train_model import train_model, predict_from_sample


def highlight_and_export_to_excel(dataFrame):
    print("exporting to excel...")
    with pd.ExcelWriter("highlighted_data.xlsx", engine='xlsxwriter') as writer:
        dataFrame.to_excel(writer, index=False, sheet_name='Data')
        workbook = writer.book
        worksheet = writer.sheets['Data']

        yellow_format = workbook.add_format({'bg_color': '#FFFF00'})

        for col_idx, (param, (low, high)) in enumerate(ranges.items()):
            col_letter = chr(65 + col_idx)  # np. 65 → 'A'
            cell_range = f"{col_letter}2:{col_letter}{len(dataFrame) + 1}"

            if low:
                difference = high - low
                near_limit_threshold = high - difference * (1 - near_limit_coefficient)
            else:
                near_limit_threshold = high * near_limit_coefficient

            worksheet.conditional_format(cell_range, {
                'type': 'cell',
                'criteria': '>=',
                'value': near_limit_threshold,
                'format': yellow_format,
            })


def create_and_export_synthetic_dataset():
    data = generate_dataset(ranges, n_samples)
    df = pd.DataFrame(data)
    df.to_csv("synthetic_water_quality.csv", index=False)
    highlight_and_export_to_excel(df)
    df.to_excel("synthetic_water_quality.xlsx", index=False, sheet_name='Data')


def calculate_soft_score(sample_dict, ranges):
    scores = []

    for param, value in sample_dict.items():
        if param in ranges:
            low, high = ranges[param]
            center = (low + high) / 2
            max_dist = max(abs(center - low), abs(center - high))
            if max_dist == 0:
                continue
            score = 1 - (abs(center - value) / max_dist)
            scores.append(min(max(score, 0), 1))  # clamp to [0,1]

    return sum(scores) / len(scores) * 100 if scores else 0


if __name__ == '__main__':

    # create_and_export_synthetic_dataset()

    sample = {
        'Ammonium (mg/l N)': 0.029,
        'Ortho Phosphate (mg/l P)': 0.04,
        'COD (mg/l O2)': 90.0,
        'BOD (mg/l O2)': 2.84,
        'Conductivity (mS/m)': 6.94,
        'pH': 7.17,
        'Nitrogen Total (mg/l N)': 0.27,
        'Nitrate (mg/l NO3)': 7.2,
        'Turbidity (NTU)': 8.2,
        'TSS (mg/l)': 15.4,
    }

    # train_model()

    result = predict_from_sample(sample)
    print("Is sample close to exceeding the legal thresholds?:", "Yes" if result[0] else "No")
    print(f"Probable security according to model: {result[1]:.1f}%")
