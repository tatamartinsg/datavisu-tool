
def getDataToCreateGraphs(df, firstYear, lastYear):
    df_exploded = df.explode('sources').dropna(subset=['year'])

    counts = (
        df_exploded
        .groupby(['sources', 'year'])
        .size()
        .unstack(fill_value=0)
    )

    years = list(range(firstYear, lastYear))  
    counts = counts.reindex(columns=years, fill_value=0)

    print("Year Counts:")
    for year, count in counts.sum(axis=0).items():
        print(f"{year}: {count}")

    year_data = [
        {"year": str(year), "count": int(count)}
        for year, count in counts.sum(axis=0).items()
    ]

    return year_data