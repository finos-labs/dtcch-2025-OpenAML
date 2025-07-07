import pandas as pd
import os

def main(filepath):
    df = pd.read_csv(filepath)

    # Count NaN values for each column
    nan_counts = df.isna().sum()

    # Print the counts
    print("NaN counts for each feature:")
    print(nan_counts)
    print(df.info())
    print(df.describe())
    

if __name__ == "__main__":
    filepath = os.path.join("data","raw.csv") # or raw.csv
    main(filepath=filepath)