import matplotlib.pyplot as plt
import numpy as np
import json
from datetime import timedelta
from future.builtins import *  # NOQA

from obspy import read
from obspy.core import read
# from obspy.core.utcdatetime import UTCDateTime
# from obspy.core.inventory import read_inventory
from obspy.clients.fdsn.client import Client

# import pdart.auth as auth
from pdart.util import linear_interpolation #, timing_correction
# from pdart.extra_plots.plot_timing_divergence import plot_timing


def view_Apollo(stream, starttime, endtime, network, station, channel, location, plot_seismogram, plot_response, year, day):
    # Snippet to read in raw seismogram and remove the instrument response for Apollo.
    client = Client("IRIS")

    # get the response file (wildcards allowed)
    inv = client.get_stations(starttime=starttime, endtime=endtime,
        network=network, sta=station, loc=location, channel=channel,
        level="response")

    if stream is None:
        stream = client.get_waveforms(network=network, station=station, channel=channel, location=location, starttime=starttime, endtime=endtime)

    else:
        stream.trim(starttime=starttime, endtime=endtime)


    for tr in stream:
        # interpolate across the gaps of one sample
        linear_interpolation(tr,interpolation_limit=1)
    stream.merge()

    for tr in stream:
        # optionally interpolate across any gap
        # for removing the instrument response from a seimogram,
        # it is useful to get a mask, then interpolate across the gaps,
        # then mask the trace again.
        if tr.stats.channel in ['MH1', 'MH2', 'MHZ']:

            # add linear interpolation but keep the original mask
            original_mask = linear_interpolation(tr,interpolation_limit=None)
            # remove the instrument response
            pre_filt = [0.1,0.3,0.9,1.1]
            tr.remove_response(inventory=inv, pre_filt=pre_filt, output="DISP",
                       water_level=None, plot=plot_response)
            if plot_response:
                plt.show()
                # plt.savefig(f'{year}_{day}.png')
            # apply the mask back to the trace
            tr.data = np.ma.masked_array(tr, mask=original_mask)

        elif tr.stats.channel in ['SHZ']:

            # add linear interpolation but keep the original mask
            original_mask = linear_interpolation(tr,interpolation_limit=None)
            # remove the instrument response
            pre_filt = [1,2,11,13]
            tr.remove_response(inventory=inv, pre_filt=pre_filt, output="DISP",
                       water_level=None, plot=plot_response)
            if plot_response:
                plt.show()
                # plt.savefig(f'{year}_{day}.png')


            # apply the mask back to the trace
            tr.data = np.ma.masked_array(tr, mask=original_mask)

    if plot_seismogram:
        stream.plot(equal_scale=False,size=(1000,600),method='full')




# Opening JSON file
f = open('smdata.json')
# returns JSON object as a dictionary
data = json.load(f)

# Iterating through the json list
for i in range(len(data)):
    # if (i == 14):
    #     pass
    # else:
    year = str(data[i]['Year'])
    day = str(data[i]['Day'])
    H = data[i]['H']
    M = data[i]['M']
    S = data[i]['S']


    moonquakeStartTime = (H * 3600) + (M * 60) + (S) + 50
    moonquakeEndTime = moonquakeStartTime + 120*60

    dir = './data/' + year + '/mh1_' + year + '_' + day + '.mseed'
    st = read(dir)

    view_Apollo(stream=None, starttime= st[0].stats.starttime + moonquakeStartTime, endtime = st[0].stats.starttime + moonquakeEndTime, network= st[0].stats.network, station=st[0].stats.station, channel=st[0].stats.channel, location= st[0].stats.location, plot_seismogram=True, plot_response=False, year=year, day=day)



# {
# 		"Year": 1976,
# 		"Day": 137,
# 		"H": 12,
# 		"M": 32,
# 		"S": 40,
# 		"Lat": 77,
# 		"Long": -10,
# 		"Magnitude": 1.5,
# 		"Comments": ""
# 	}




# dirlist = ['./data/sm/1971/xa.s14.00.mh1.1971.107.0.mseed', './data/sm/1971/xa.s14.00.mh1.1971.140.0.mseed', './data/sm/1971/xa.s14.00.mh1.1971.192.0.mseed']
# for i in dirlist:
#     dir = i
#     st = read(dir)
#     view_Apollo(stream=None, starttime= st[0].stats.starttime + moonquakeStartTime, endtime = st[0].stats.starttime + moonquakeEndTime,
#   network= st[0].stats.network, station=st[0].stats.station, channel=st[0].stats.channel, location= st[0].stats.location, plot_seismogram=True, plot_response=False)



# Closing file
f.close()