import pandas as pd
import matplotlib.pyplot as plt
import io
import base64



def plot(file):
    plt.figure(figsize=(6, 4))
    data = pd.read_csv(file)
    data["velocity(m/s)"].plot(label="Seismic Activity", linewidth=1, color="#6464ff")

    buf = io.BytesIO()
    plt.savefig(buf, format='png')  # Save as PNG to the BytesIO object
    plt.close()  # Close the plot to avoid display
    buf.seek(0)  # Move to the beginning of the BytesIO object

    # Encode the image to base64
    encoded_image = base64.b64encode(buf.read()).decode('utf-8')

    return encoded_image


# print(plot(r"./xa.s12.00.mhz.1970-01-19HR00_evid00002.csv"))
