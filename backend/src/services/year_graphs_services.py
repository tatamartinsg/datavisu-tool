
def getDataToCreateGraphs(df, firstYear, lastYear):
    df_exploded = df.explode('sources').dropna(subset=['year'])

    # Conta a quantidade de publicações em cada source em cada ano, e agrupa
    counts = (
        df_exploded
        .groupby(['sources', 'year'])
        .size()
        .unstack(fill_value=0)
    )

    years = list(range(firstYear, lastYear))  
    counts = counts.reindex(columns=years, fill_value=0)

    # year_counts = (
    #     df_exploded
    #     .groupby(['sources', 'year'])
    #     .value_counts()               # Conta quantos itens tem em cada ano
    #     .sort_index()                 # Ordena por ano
    #     .reindex(years, fill_value=0) # Garante que todos os anos de 2010 a 2025 vão aparecer
    # )

   

    print("Year Counts:")
    for year, count in counts.sum(axis=0).items():
        print(f"{year}: {count}")

    year_data = [
        {"year": str(year), "count": int(count)}
        for year, count in counts.sum(axis=0).items()
    ]

    return year_data